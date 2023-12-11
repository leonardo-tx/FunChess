namespace FunChess.Core.Client.Services;

public interface IFriendChatService
{
    public bool AddConnection(ulong accountId, string connectionId);

    public bool RemoveConnection(ulong accountId);

    public string? FindConnectionId(ulong accountId);

    public bool ReplaceConnection(ulong accountId, string oldConnectionId, string newConnectionId);
}