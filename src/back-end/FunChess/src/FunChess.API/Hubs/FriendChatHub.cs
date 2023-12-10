using FunChess.Core.Client.Attributes;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Hubs;

[AuthorizeCustom]
public sealed class FriendChatHub : Hub
{
    
}