using System.Text.Json.Serialization;

namespace FunChess.Core.Auth;

public sealed class FriendshipRequest
{
    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public FriendshipRequest()
    {

    }

    private FriendshipRequest(ulong accountId, ulong friendId, FriendRequestType requestType)
    {
        if (accountId == friendId)
        {
            throw new ArgumentException("It is not possible to create a friend request for the same account.");
        }

        AccountId = accountId;
        FriendId = friendId;
        RequestType = requestType;
    }
    
    public ulong AccountId { get; set; }

    [JsonIgnore]
    public Account Account { get; set; } = null!;

    public ulong FriendId { get; set; }

    [JsonIgnore]
    public Account Friend { get; set; } = null!;
    
    public FriendRequestType RequestType { get; set; }

    public static (FriendshipRequest, FriendshipRequest) GetFriendshipRequests(ulong senderId, ulong receiverId)
    {
        return
        (
            new FriendshipRequest(senderId, receiverId, FriendRequestType.Delivered),
            new FriendshipRequest(receiverId, senderId, FriendRequestType.Received)
        );
    }
}