using FunChess.Core.Auth;
using FunChess.Core.Auth.Services;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore;

namespace FunChess.DAL.Auth;

public sealed class FriendshipService : GenericDbService, IFriendshipService
{
    public FriendshipService(DatabaseContext context) : base(context)
    {
    }

    public async Task InviteAsync(ulong senderId, ulong receiverId)
    { 
        (
            FriendshipRequest senderRequest, 
            FriendshipRequest receiverRequest
        ) = FriendshipRequest.GetFriendshipRequests(senderId, receiverId);
        
        await Context.FriendshipRequests.AddRangeAsync(senderRequest, receiverRequest);
        await Context.SaveChangesAsync();
    }

    public async Task<bool> AcceptInviteAsync(ulong senderId, ulong receiverId)
    {
        FriendshipRequest? senderRequest = await Context.FriendshipRequests.FindAsync(senderId, receiverId);
        if (senderRequest is null || senderRequest.RequestType == FriendRequestType.Received) return false;

        FriendshipRequest receiverRequest = (await Context.FriendshipRequests.FindAsync(receiverId, senderId))!;

        (Friendship sender, Friendship receiver) = Friendship.GetFriendships(senderRequest, receiverRequest);
        Context.FriendshipRequests.RemoveRange(senderRequest, receiverRequest);
        
        await Context.Friendships.AddRangeAsync(sender, receiver);
        await Context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> DeclineInviteAsync(ulong senderId, ulong receiverId)
    {
        FriendshipRequest? senderRequest = await Context.FriendshipRequests.FindAsync(senderId, receiverId);
        if (senderRequest is null) return false;

        FriendshipRequest? receiverRequest = await Context.FriendshipRequests.FindAsync(receiverId, senderId);
        if (receiverRequest is null) return false;
        
        Context.FriendshipRequests.RemoveRange(senderRequest, receiverRequest);
        await Context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveAsync(ulong accountId1, ulong accountId2)
    {
        bool removed = false;
        Friendship? friendshipRelation1 = await Context.Friendships.FindAsync(accountId1, accountId2);
        if (friendshipRelation1 is not null)
        {
            Context.Friendships.Remove(friendshipRelation1);
            removed = true;
        }
        
        Friendship? friendshipRelation2 = await Context.Friendships.FindAsync(accountId2, accountId1);
        if (friendshipRelation2 is not null)
        {
            Context.Friendships.Remove(friendshipRelation2);
            removed = true;
        }
        
        if (removed) await Context.SaveChangesAsync();
        return removed;
    }

    public async Task<Friendship?> FindAsync(ulong accountId1, ulong accountId2)
    {
        return await Context.Friendships.FindAsync(accountId1, accountId2);
    }

    public async Task<FriendshipRequest?> FindRequestAsync(ulong accountId1, ulong accountId2)
    {
        return await Context.FriendshipRequests.FindAsync(accountId1, accountId2);
    }

    public IAsyncEnumerable<FriendshipRequest> GetAllRequests(Account account)
    {
        return Context.FriendshipRequests
            .Where(request => request.AccountId == account.Id)
            .AsAsyncEnumerable();
    }

    public IAsyncEnumerable<Friendship> GetAllFriendships(Account account)
    {
        return Context.Friendships
            .Where(friendship => friendship.AccountId == account.Id)
            .AsAsyncEnumerable();
    }

    public async Task<IEnumerable<Message>> GetAllMessagesAsync(Account account1, Account account2)
    {
        Friendship? friendship1 = await Context.Friendships
            .Include(friendship => friendship.Messages)
            .FirstOrDefaultAsync(friendship => friendship.AccountId == account1.Id && friendship.FriendId == account2.Id);
        if (friendship1 is null) throw new ArgumentException("There is no friendship between the two given accounts.");
        
        Friendship? friendship2 = await Context.Friendships
            .Include(f => f.Messages)
            .FirstOrDefaultAsync(friendship => friendship.AccountId == account2.Id && friendship.FriendId == account1.Id);
        if (friendship2 is null) throw new ArgumentException("There is no friendship between the two given accounts.");
        
        return friendship1.Messages.Concat(friendship2.Messages).OrderBy(message => message.Creation);
    }
}