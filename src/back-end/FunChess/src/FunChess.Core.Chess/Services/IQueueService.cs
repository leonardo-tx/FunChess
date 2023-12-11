using FunChess.Core.Hub;

namespace FunChess.Core.Chess.Services;

public interface IQueueService
{
    public int QueueCount { get; }
    
    public bool Enqueue(ulong accountId, string connectionId);
    
    public AccountConnection Dequeue();

    public void RegisterMatchToAccounts(Match match);

    public bool RemoveAccountWithoutMatch(ulong accountId);

    public void FinishMatch(Match match);

    public Match? FindAccountMatch(ulong accountId);

    public IEnumerable<Match?> GetAllMatches();
}