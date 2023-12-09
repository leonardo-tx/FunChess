using FunChess.Core.Auth.Enums;

namespace FunChess.Core.Auth;

public sealed class SimpleAccount
{
    public required ulong Id { get; set; }
    
    public required string Username { get; set; }
    
    public required DateOnly Creation { get; set; }
    
    public required FriendStatus FriendStatus { get; set; }

    public static SimpleAccount Parse(Account account, FriendStatus friendStatus)
    {
        return new SimpleAccount
        {
            Id = account.Id,
            Username = account.Username,
            Creation = account.Creation,
            FriendStatus = friendStatus
        };
    }
}