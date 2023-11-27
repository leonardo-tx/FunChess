using System.Text.Json.Serialization;

namespace FunChess.Core.Auth;

public sealed class FriendshipRequest
{
    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public FriendshipRequest()
    {

    }

    private FriendshipRequest(Account account, Account friend, FriendRequestType requestType)
    {
        if (account.Id == friend.Id)
        {
            throw new ArgumentException("It is not possible to create a friend request for the same account.");
        }
        
        AccountId = account.Id;
        FriendId = friend.Id;
        RequestType = requestType;
    }
    
    public ulong AccountId { get; set; }

    [JsonIgnore]
    public Account Account { get; set; } = null!;

    public ulong FriendId { get; set; }

    [JsonIgnore]
    public Account Friend { get; set; } = null!;
    
    public FriendRequestType RequestType { get; set; }

    public static (FriendshipRequest, FriendshipRequest) GetFriendshipRequests(Account sender, Account receiver)
    {
        return
        (
            new FriendshipRequest(sender, receiver, FriendRequestType.Delivered),
            new FriendshipRequest(receiver, sender, FriendRequestType.Received)
        );
    }
}