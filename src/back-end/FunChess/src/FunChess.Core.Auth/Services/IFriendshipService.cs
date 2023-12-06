namespace FunChess.Core.Auth.Services;

public interface IFriendshipService
{
    public Task Invite(Account sender, Account receiver);

    public Task<bool> AcceptInvite(ulong senderId, ulong receiverId);

    public Task Remove(Account account1, Account account2);

    public Task<Friendship?> Find(Account account1, Account account2);

    public Task<FriendshipRequest?> FindRequest(Account account1, Account account2);

    public IAsyncEnumerable<FriendshipRequest> GetAllRequests(Account account);

    public IAsyncEnumerable<Friendship> GetAllFriendships(Account account);

    public Task<IEnumerable<Message>> GetAllMessages(Account account1, Account account2);
}