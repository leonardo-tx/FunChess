using FunChess.Core.Hub.Repositories;

namespace FunChess.Core.Chess.Repositories;

public interface IQueueRepository
{
    public int QueueCount { get; }

    public IConnectionRepository Connections { get; }
    
    public bool Enqueue(ulong accountId, string connectionId);
    
    public QueueAccount Dequeue();

    public void RegisterMatchToAccounts(Match match);

    public bool RemoveAccountWithoutMatch(ulong accountId);

    public void FinishMatch(Match match);

    public Match? FindAccountMatch(ulong accountId);

    public IEnumerable<Match?> GetAllMatches();
}