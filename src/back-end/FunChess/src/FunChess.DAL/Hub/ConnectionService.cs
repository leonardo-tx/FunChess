using System.Collections.Concurrent;
using FunChess.Core.Hub.Services;

namespace FunChess.DAL.Hub;

public sealed class ConnectionService : IConnectionService
{
    private static readonly ConcurrentDictionary<Type, ConnectionService> Instances = new(); 
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

    public static IConnectionService GetInstance<T>() where T : Microsoft.AspNetCore.SignalR.Hub
    {
        Type type = typeof(T);
        if (Instances.TryGetValue(type, out ConnectionService? instance)) return instance;

        instance = new ConnectionService();
        if (!Instances.TryAdd(type, instance)) throw new Exception("This exception can not happen.");

        return instance;
    }
}