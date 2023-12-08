namespace FunChess.Core.Auth;

public sealed class SimpleAccount
{
    public required ulong Id { get; set; }
    
    public required string Username { get; set; }
    
    public required DateOnly Creation { get; set; }
    
    public required bool IsFriend { get; set; }

    public static SimpleAccount Parse(Account account, bool isFriend)
    {
        return new SimpleAccount
        {
            Id = account.Id,
            Username = account.Username,
            Creation = account.Creation,
            IsFriend = isFriend
        };
    }
}