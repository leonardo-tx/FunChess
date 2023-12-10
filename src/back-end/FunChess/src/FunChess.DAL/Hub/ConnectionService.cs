using System.Collections.Concurrent;

namespace FunChess.DAL.Hub;

public sealed class ConnectionService
{
    private static readonly ConcurrentDictionary<Type, ConnectionService> Instances = new(); 
    private readonly HashSet<string> _connectedIds = new();
    
    public bool Add(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Add(connectionId);
        }
    }

    public bool Remove(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Remove(connectionId);
        }
    }

    public bool Exists(string connectionId)
    {
        lock (_connectedIds)
        {
            return _connectedIds.Contains(connectionId);
        }
    }

    public static ConnectionService GetInstance<T>() where T : Microsoft.AspNetCore.SignalR.Hub
    {
        Type type = typeof(T);
        if (Instances.TryGetValue(type, out ConnectionService? instance)) return instance;

        instance = new ConnectionService();
        if (!Instances.TryAdd(type, instance)) throw new Exception("This exception can not happen.");

        return instance;
    }
}