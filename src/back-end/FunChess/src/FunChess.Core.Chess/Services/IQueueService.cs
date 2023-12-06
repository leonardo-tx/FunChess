using FunChess.Core.Hub.Services;

namespace FunChess.Core.Chess.Services;

public interface IQueueService
{
    public int QueueCount { get; }

    public IConnectionService Connections { get; }
    
    public bool Enqueue(ulong accountId, string connectionId);
    
    public QueueAccount Dequeue();

    public void RegisterMatchToAccounts(Match match);

    public bool RemoveAccountWithoutMatch(ulong accountId);

    public void FinishMatch(Match match);

    public Match? FindAccountMatch(ulong accountId);

    public IEnumerable<Match?> GetAllMatches();
}