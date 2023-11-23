using System.Collections.Concurrent;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Repositories;

namespace FunChess.DAL.Chess;

public sealed class QueueRepository : IQueueRepository
{
    private readonly ConcurrentQueue<QueueAccount> _queue = new();
    private readonly HashSet<string> _connectedIds = new();
    private readonly ConcurrentDictionary<ulong, Match?> _accountsOnMatch = new();

    public int QueueCount => _queue.Count;

    public bool AddConnection(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Add(connectionId);
        }
    }

    public bool RemoveConnection(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Remove(connectionId);
        }
    }

    public bool ConnectionExists(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Contains(connectionId);
        }
    }
    
    public bool Enqueue(ulong accountId, string connectionId)
    {
        if (!_accountsOnMatch.TryAdd(accountId, null)) return false;
        
        _queue.Enqueue(new QueueAccount(accountId, connectionId));
        return true;
    }

    public QueueAccount Dequeue()
    {
        if (_queue.IsEmpty) throw new Exception("Cannot dequeue, queue is empty.");
        _ = _queue.TryDequeue(out QueueAccount? queueUser);

        return queueUser!;
    }

    public bool AddAccountToMatch(ulong accountId, Match match)
    {
        return _accountsOnMatch.TryUpdate(accountId, match, null);
    }

    public bool RemoveAccountWithoutMatch(ulong accountId)
    {
        if (!_accountsOnMatch.TryGetValue(accountId, out Match? match) || match is not null) return false;
        
        _accountsOnMatch.Remove(accountId, out _);
        return true;
    }

    public void FinishMatch(Match match)
    {
        ReadOnlySpan<Player> players = match.Players.Span;
        for (int i = 0; i < players.Length; i++)
        {
            _accountsOnMatch.Remove(players[i].AccountId, out _);
        }
    }

    public Match? FindAccountMatch(ulong accountId)
    {
        _ = _accountsOnMatch.TryGetValue(accountId, out Match? match);
        return match;
    }

    public IEnumerable<Match?> GetAllMatches() => _accountsOnMatch.Values;
}