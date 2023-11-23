namespace FunChess.Core.Chess.Repositories;

public interface IQueueRepository
{
    public int QueueCount { get; }

    public bool AddConnection(string connectionId);

    public bool RemoveConnection(string connectionId);

    public bool ConnectionExists(string connectionId);
    
    public bool Enqueue(ulong accountId, string connectionId);
    
    public QueueAccount Dequeue();

    public bool AddAccountToMatch(ulong accountId, Match match);

    public bool RemoveAccountWithoutMatch(ulong accountId);

    public void FinishMatch(Match match);

    public Match? FindAccountMatch(ulong accountId);

    public IEnumerable<Match?> GetAllMatches();
}