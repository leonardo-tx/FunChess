using System.Collections.Concurrent;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Services;
using FunChess.Core.Hub;

namespace FunChess.DAL.Chess;

public sealed class QueueService : IQueueService
{
    private readonly ConcurrentQueue<ulong> _queue = new();
    private readonly ConcurrentDictionary<ulong, Match?> _accountsOnMatch = new();

    public int QueueCount => _queue.Count;

    public bool Enqueue(ulong accountId)
    {
        if (!_accountsOnMatch.TryAdd(accountId, null)) return false;
        
        _queue.Enqueue(accountId);
        return true;
    }

    public ulong Dequeue()
    {
        if (_queue.IsEmpty) throw new Exception("Cannot dequeue, queue is empty.");
        _ = _queue.TryDequeue(out ulong accountId);

        return accountId;
    }

    public void RegisterMatchToAccounts(Match match)
    {
        bool updatedFirst = _accountsOnMatch.TryUpdate(match.WhiteTeamPlayer.AccountId, match, null);
        bool updatedSecond = _accountsOnMatch.TryUpdate(match.BlackTeamPlayer.AccountId, match, null);

        if (!updatedFirst || !updatedSecond)
        {
            throw new ArgumentException("Invalid match, one or two players are already on a match.");
        }
    }

    public bool RemoveAccountWithoutMatch(ulong accountId)
    {
        if (!_accountsOnMatch.TryGetValue(accountId, out Match? match) || match is not null) return false;
        
        _accountsOnMatch.Remove(accountId, out _);
        return true;
    }

    public void FinishMatch(Match match)
    {
        _accountsOnMatch.Remove(match.WhiteTeamPlayer.AccountId, out _);
        _accountsOnMatch.Remove(match.BlackTeamPlayer.AccountId, out _);
    }

    public Match? FindAccountMatch(ulong accountId)
    {
        _ = _accountsOnMatch.TryGetValue(accountId, out Match? match);
        return match;
    }

    public IEnumerable<Match?> GetAllMatches() => _accountsOnMatch.Values;
}