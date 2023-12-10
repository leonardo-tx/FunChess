using FunChess.Core.Client.Dtos;

namespace FunChess.Core.Client.Services;

public interface IMessageService
{
    public Task<bool> SendAsync(ulong senderId, MessageDtoInput input);

    public Task<IEnumerable<MessageDtoOutput>> GetAllAsync(ulong accountId, ulong friendId);
}