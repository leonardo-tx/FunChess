namespace FunChess.Core.Hub.Repositories;

public interface IConnectionRepository
{
    public bool Add(string connectionId);

    public bool Remove(string connectionId);

    public bool Exists(string connectionId);
}