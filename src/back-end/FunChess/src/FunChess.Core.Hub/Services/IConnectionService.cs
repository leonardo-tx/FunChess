namespace FunChess.Core.Hub.Services;

public interface IConnectionService
{
    public bool AddConnection(ulong accountId, string connectionId);

    public bool RemoveConnection(ulong accountId);

    public string? FindConnectionId(ulong accountId);

    public bool ReplaceConnection(ulong accountId, string oldConnectionId, string newConnectionId);
}