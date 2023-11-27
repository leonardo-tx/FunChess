using System.Text.Json.Serialization;

namespace FunChess.Core.Auth;

public sealed class Friendship
{
    private Friendship(FriendshipRequest friendshipRequest)
    {
        AccountId = friendshipRequest.AccountId;
        FriendId = friendshipRequest.FriendId;
    }

    [Obsolete("This constructor is for Entity Framework Core usage only. Don't use it.")]
    public Friendship()
    {

    }
    
    public ulong AccountId { get; set; }

    [JsonIgnore]
    public Account Account { get; set; } = null!;

    public ulong FriendId { get; set; }

    [JsonIgnore]
    public Account Friend { get; set; } = null!;

    [JsonIgnore]
    public List<Message> Messages { get; set; } = new();
    
    public static (Friendship, Friendship) GetFriendships(FriendshipRequest senderRequest, FriendshipRequest receiverRequest)
    {
        return
        (
            new Friendship(senderRequest),
            new Friendship(receiverRequest)
        );
    }
}
    