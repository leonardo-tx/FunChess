using FunChess.Core.Auth;
using FunChess.Core.Auth.Repositories;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore;

namespace FunChess.DAL.Auth;

public sealed class FriendshipRepository : GenericDatabaseRepository, IFriendshipRepository
{
    public FriendshipRepository(DatabaseContext context) : base(context)
    {
    }

    public async Task Invite(Account sender, Account receiver)
    { 
        (
            FriendshipRequest senderRequest, 
            FriendshipRequest receiverRequest
        ) = FriendshipRequest.GetFriendshipRequests(sender, receiver);
        
        await Context.FriendshipRequests.AddRangeAsync(senderRequest, receiverRequest);
        await Context.SaveChangesAsync();
    }

    public async Task<bool> AcceptInvite(ulong senderId, ulong receiverId)
    {
        FriendshipRequest? senderRequest = await Context.FriendshipRequests.FindAsync(senderId, receiverId);
        if (senderRequest is null) return false;

        FriendshipRequest? receiverRequest = await Context.FriendshipRequests.FindAsync(receiverId, senderId);
        if (receiverRequest is null) return false;

        (Friendship sender, Friendship receiver) = Friendship.GetFriendships(senderRequest, receiverRequest);
        Context.FriendshipRequests.RemoveRange(senderRequest, receiverRequest);
        
        await Context.Friendships.AddRangeAsync(sender, receiver);
        await Context.SaveChangesAsync();
        
        return true;
    }

    public async Task Remove(Account account1, Account account2)
    {
        Friendship? friendshipRelation1 = await Context.Friendships.FindAsync(account1.Id, account2.Id);
        if (friendshipRelation1 is not null)
        {
            Context.Friendships.Remove(friendshipRelation1);
        }
        
        Friendship? friendshipRelation2 = await Context.Friendships.FindAsync(account2.Id, account1.Id);
        if (friendshipRelation2 is not null)
        {
            Context.Friendships.Remove(friendshipRelation2);
        }
        await Context.SaveChangesAsync();
    }

    public async Task<Friendship?> Find(Account account1, Account account2)
    {
        return await Context.Friendships.FindAsync(account1.Id, account2.Id);
    }

    public async Task<FriendshipRequest?> FindRequest(Account account1, Account account2)
    {
        return await Context.FriendshipRequests.FindAsync(account1.Id, account2.Id);
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

    public async Task<IEnumerable<Message>> GetAllMessages(Account account1, Account account2)
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