using System.Collections.Concurrent;
using FunChess.Core.Auth;
using FunChess.Core.Auth.Repositories;

namespace FunChess.DAL.Auth;

public sealed class FriendshipRepository : IFriendshipRepository
{
    private ConcurrentDictionary<int, FriendshipRequest> Requests { get; } = new();
    private ConcurrentDictionary<int, Friendship> Friendships { get; } = new();
    
    public Task Invite(Account sender, Account receiver)
    { 
        (
            FriendshipRequest senderRequest, 
            FriendshipRequest receiverRequest
        ) = FriendshipRequest.GetFriendshipRequests(sender, receiver);
        
        Requests.TryAdd(HashCode.Combine(senderRequest.AccountId, senderRequest.FriendId), senderRequest);
        Requests.TryAdd(HashCode.Combine(receiverRequest.AccountId, receiverRequest.FriendId), receiverRequest);
        
        return Task.CompletedTask;
    }

    public Task<bool> AcceptInvite(ulong senderId, ulong receiverId)
    {
        int senderKey = HashCode.Combine(senderId, receiverId);
        int receiverKey = HashCode.Combine(receiverId, senderId);
        if (!Requests.TryRemove(senderKey, out var senderRequest)) return Task.FromResult(false);
        if (!Requests.TryRemove(receiverKey, out var receiverRequest)) return Task.FromResult(false);

        (Friendship sender, Friendship receiver) = Friendship.GetFriendships(senderRequest, receiverRequest);
        Friendships.TryAdd(senderKey, sender);
        Friendships.TryAdd(receiverKey, receiver);
        
        return Task.FromResult(true);
    }

    public Task Remove(Account account1, Account account2)
    {
        int relationKey1 = HashCode.Combine(account1.Id, account2.Id);
        int relationKey2 = HashCode.Combine(account2.Id, account1.Id);
        
        Friendships.TryRemove(relationKey1, out _);
        Friendships.TryRemove(relationKey2, out _);
        
        return Task.CompletedTask;
    }

    public Task<Friendship?> Find(Account account1, Account account2)
    {
        Friendships.TryGetValue(HashCode.Combine(account1.Id, account2.Id), out Friendship? friendship);
        return Task.FromResult(friendship);
    }

    public Task<FriendshipRequest?> FindRequest(Account account1, Account account2)
    {
        Requests.TryGetValue(HashCode.Combine(account1.Id, account2.Id), out FriendshipRequest? request);
        return Task.FromResult(request);
    }

    public IEnumerable<FriendshipRequest> GetAllRequests(Account account)
    {
        return Requests.Values
            .Where(request => request.AccountId == account.Id)
            .AsEnumerable();
    }

    public IEnumerable<Friendship> GetAllFriendships(Account account)
    {
        return Friendships.Values
            .Where(friendship => friendship.AccountId == account.Id)
            .AsEnumerable();
    }

    public Task<IEnumerable<Message>> GetAllMessages(Account account1, Account account2)
    {
        Friendship? friendship1 = Friendships.Values
            .FirstOrDefault(friendship => friendship.AccountId == account1.Id && friendship.FriendId == account2.Id);
        if (friendship1 is null) throw new ArgumentException("There is no friendship between the two given accounts.");
        
        Friendship? friendship2 = Friendships.Values
            .FirstOrDefault(friendship => friendship.AccountId == account2.Id && friendship.FriendId == account1.Id);
        if (friendship2 is null) throw new ArgumentException("There is no friendship between the two given accounts.");
        
        IEnumerable<Message> messages = friendship1.Messages.Concat(friendship2.Messages).OrderBy(message => message.Creation);
        return Task.FromResult(messages);
    }
}