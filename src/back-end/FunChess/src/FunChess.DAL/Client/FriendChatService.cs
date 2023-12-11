using System.Collections.Concurrent;
using FunChess.Core.Client.Services;

namespace FunChess.DAL.Client;

public sealed class FriendChatService : IFriendChatService
{
    private readonly ConcurrentDictionary<ulong, string> _accountIdToConnectionId = new();

    public bool AddConnection(ulong accountId, string connectionId)
    {
        return _accountIdToConnectionId.TryAdd(accountId, connectionId);
    }

    public bool RemoveConnection(ulong accountId)
    {
        return _accountIdToConnectionId.TryRemove(accountId, out _);
    }

    public string? FindConnectionId(ulong accountId)
    {
        _accountIdToConnectionId.TryGetValue(accountId, out string? connectionId);
        return connectionId;
    }

    public bool ReplaceConnection(ulong accountId, string oldConnectionId, string newConnectionId)
    {
        return _accountIdToConnectionId.TryUpdate(accountId, newConnectionId, oldConnectionId);
    }
}