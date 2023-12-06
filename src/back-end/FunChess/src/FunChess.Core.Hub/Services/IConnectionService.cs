namespace FunChess.Core.Hub.Services;

public interface IConnectionService
{
    public bool Add(string connectionId);

    public bool Remove(string connectionId);

    public bool Exists(string connectionId);
}