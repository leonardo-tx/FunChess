using FunChess.Core.Hub.Services;

namespace FunChess.DAL.Hub;

public sealed class ConnectionService : IConnectionService
{
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
}