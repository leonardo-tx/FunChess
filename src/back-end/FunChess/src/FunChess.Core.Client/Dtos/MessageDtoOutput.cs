namespace FunChess.Core.Client.Dtos;

public sealed class MessageDtoOutput
{
    public required string Text { get; set; }
    
    public required DateTime Creation { get; set; }
    
    public required ulong AuthorId { get; set; }
}