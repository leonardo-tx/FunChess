namespace FunChess.Core.Auth.Services;

public interface IFriendshipService
{
    public Task InviteAsync(ulong senderId, ulong receiverId);

    public Task<bool> AcceptInviteAsync(ulong senderId, ulong receiverId);

    public Task<bool> DeclineInviteAsync(ulong senderId, ulong receiverId);

    public Task<bool> RemoveAsync(ulong accountId1, ulong accountId2);

    public Task<Friendship?> FindAsync(ulong accountId1, ulong accountId2);

    public Task<FriendshipRequest?> FindRequestAsync(ulong accountId1, ulong accountId2);

    public IAsyncEnumerable<FriendshipRequest> GetAllRequests(Account account);

    public IAsyncEnumerable<Friendship> GetAllFriendships(Account account);

    public Task<IEnumerable<Message>> GetAllMessagesAsync(Account account1, Account account2);
}