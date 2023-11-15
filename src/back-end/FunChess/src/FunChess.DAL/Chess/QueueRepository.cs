using System.Collections.Concurrent;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Repositories;

namespace FunChess.DAL.Chess;

public sealed class QueueRepository : IQueueRepository
{
    private readonly ConcurrentQueue<QueueAccount> _queue = new();
    private readonly ConcurrentDictionary<ulong, Match> _accountsOnMatch = new();

    public int QueueCount => _queue.Count;
    
    public bool Enqueue(ulong accountId, string connectionId)
    {
        if (_accountsOnMatch.ContainsKey(accountId)) return false;

        _queue.Enqueue(new QueueAccount(accountId, connectionId));
        return true;
    }

    public QueueAccount Dequeue()
    {
        if (_queue.IsEmpty) throw new Exception("Cannot dequeue, queue is empty.");
        _ = _queue.TryDequeue(out QueueAccount? queueUser);

        return queueUser!;
    }

    public bool AddToOnMatch(ulong accountId, Match match)
    {
        return _accountsOnMatch.TryAdd(accountId, match);
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

    public IEnumerable<Match> GetAllMatches() => _accountsOnMatch.Values;
}