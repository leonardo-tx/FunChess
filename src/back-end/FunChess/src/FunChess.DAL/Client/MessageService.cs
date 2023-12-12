using FunChess.Core.Client;
using FunChess.Core.Client.Dtos;
using FunChess.Core.Client.Mappers;
using FunChess.Core.Client.Services;
using FunChess.DAL.Context;
using FunChess.DAL.Generic;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace FunChess.DAL.Client;

public sealed class MessageService : GenericDbService, IMessageService
{
    public MessageService(DatabaseContext context, MessageMapper messageMapper) : base(context)
    {
        _messageMapper = messageMapper;
    }

    private readonly MessageMapper _messageMapper;

    public async Task<MessageDtoOutput?> SendAsync(ulong senderId, MessageDtoInput input)
    {
        Friendship? friendship = await Context.Friendships.FindAsync(senderId, input.FriendId);
        if (friendship is null) return null;
        
        Message generatedMessage = new(friendship, input.Text);
        
        EntityEntry<Message> entityEntry = await Context.Messages.AddAsync(generatedMessage);
        await Context.SaveChangesAsync();

        return _messageMapper.ToOutput(entityEntry.Entity);
    }

    public async Task<IEnumerable<MessageDtoOutput>> GetAllAsync(ulong accountId, ulong friendId)
    {
        Friendship? friendship1 = await Context.Friendships.FindAsync(accountId, friendId);
        if (friendship1 is null) return Enumerable.Empty<MessageDtoOutput>();
        
        Friendship friendship2 = (await Context.Friendships.FindAsync(friendId, accountId))!;
        return Context.Messages
            .Where(message => message.Friendship == friendship1 || message.Friendship == friendship2)
            .Select(message => _messageMapper.ToOutput(message));
    }
}