namespace FunChess.Core.Client;

public sealed class CurrentAccount
{
    public required ulong Id { get; set; }
    
    public required string Email { get; set; }
    
    public required string Username { get; set; }
    
    public required DateOnly Creation { get; set; }

    public static CurrentAccount Parse(Account account)
    {
        return new CurrentAccount
        {
            Id = account.Id,
            Email = account.Email,
            Username = account.Username,
            Creation = account.Creation
        };
    }
}