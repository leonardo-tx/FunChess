namespace FunChess.Core.Chess.Repositories;

public interface IQueueRepository
{
    public int QueueCount { get; }
    
    public bool Enqueue(ulong accountId, string connectionId);
    
    public QueueAccount Dequeue();

    public bool AddToOnMatch(ulong accountId, Match match);

    public void FinishMatch(Match match);

    public Match? FindAccountMatch(ulong accountId);

    public IEnumerable<Match> GetAllMatches();
}