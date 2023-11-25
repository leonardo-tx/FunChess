using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace FunChess.Core.Auth;

public sealed class Message
{
    public Message(string text)
    {
        Text = text;
    }

    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public Message()
    {
        
    }
    
    [Key]
    public Guid Id { get; set; }

    private string _text = null!;

    [MinLength(1)]
    [MaxLength(512)]
    [Required]
    public string Text
    {
        get => _text;
        set
        {
            ThrowIfTextIsInvalid(value);
            _text = value;
        }
    }
    
    public DateTime Creation { get; set; } = DateTime.UtcNow;

    public Friendship Friendship { get; set; } = null!;

    [NotMapped]
    public ulong AuthorId => Friendship.AccountId;
    
    private static void ThrowIfTextIsInvalid([NotNull] string? text)
    {
        if (text is null) throw new ArgumentNullException(nameof(text), "Text cannot be null.");
        if (text.Length is < 1 or > 512) throw new ArgumentOutOfRangeException
        (
            nameof(text), text.Length, 
            "Text was out of range. Must be greater than 0 and less than 513."
        );
    }
}