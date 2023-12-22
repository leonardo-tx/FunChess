using FunChess.Core.Hub.Services;

namespace FunChess.Core.Hub;

public struct AccountConnection
{
    public AccountConnection(ulong? accountId, IConnectionService connectionService)
    {
        if (!accountId.HasValue) throw new ArgumentException("Account id cannot be null.");
        
        AccountId = accountId.Value;
        ConnectionId = connectionService.FindConnectionId(AccountId) ?? throw new ArgumentException("User is not connected to hub.");
    }
    
    public ulong AccountId { get; }
    
    public string ConnectionId { get; }
}