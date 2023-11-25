namespace FunChess.Core.Auth;

public sealed class Friendship
{
    public Friendship(Account account, Account friend)
    {
        AccountId = account.Id;
        Account = account;
        FriendId = friend.Id;
        Friend = friend;
    }

    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public Friendship()
    {

    }

    public ulong AccountId { get; set; }

    public Account Account { get; set; } = null!;

    public ulong FriendId { get; set; }

    public Account Friend { get; set; } = null!;

    public List<Message> Messages { get; set; } = new();
}
    