namespace FunChess.Core.Hub;

public sealed class AccountConnection
{
    public AccountConnection(ulong accountId, string connectionId)
    {
        AccountId = accountId;
        ConnectionId = connectionId;
    }
    
    public ulong AccountId { get; }
    
    public string ConnectionId { get; }
}