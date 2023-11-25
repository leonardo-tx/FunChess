namespace FunChess.Core.Auth.Repositories;

public interface IFriendshipRepository
{
    public Task Add(Account account1, Account account2);

    public Task Remove(Account account1, Account account2);

    public Task<Friendship?> Find(Account account1, Account account2);

    public IAsyncEnumerable<Friendship> GetAllFromAccount(Account account);

    public Task<IEnumerable<Message>> GetAllMessages(Account account1, Account account2);
}