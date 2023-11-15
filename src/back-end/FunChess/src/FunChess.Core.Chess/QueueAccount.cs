namespace FunChess.Core.Chess;

public sealed class QueueAccount
{
    public QueueAccount(ulong accountId, string connectionId)
    {
        AccountId = accountId;
        ConnectionId = connectionId;
    }
    
    public ulong AccountId { get; }
    
    public string ConnectionId { get; }
}