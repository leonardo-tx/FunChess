namespace FunChess.Core.Auth.Repositories;

public interface IFriendshipRepository
{
    public Task Invite(Account sender, Account receiver);

    public Task<bool> AcceptInvite(ulong senderId, ulong receiverId);

    public Task Remove(Account account1, Account account2);

    public Task<Friendship?> Find(Account account1, Account account2);

    public Task<FriendshipRequest?> FindRequest(Account account1, Account account2);

    public IEnumerable<FriendshipRequest> GetAllRequests(Account account);

    public IEnumerable<Friendship> GetAllFriendships(Account account);

    public Task<IEnumerable<Message>> GetAllMessages(Account account1, Account account2);
}