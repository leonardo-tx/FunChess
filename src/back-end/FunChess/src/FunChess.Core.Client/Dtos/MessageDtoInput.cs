namespace FunChess.Core.Client.Dtos;

public sealed class MessageDtoInput
{
    public required string Text { get; set; }
    
    public required ulong FriendId { get; set; }
}