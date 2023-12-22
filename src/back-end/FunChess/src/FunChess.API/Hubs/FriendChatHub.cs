using System.Security.Claims;
using FunChess.Core.Client.Attributes;
using FunChess.Core.Client.Dtos;
using FunChess.Core.Client.Extensions;
using FunChess.Core.Client.Services;
using FunChess.Core.Hub.Services;
using FunChess.DAL.Hub;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Hubs;

[AuthorizeCustom]
public sealed class FriendChatHub : Hub
{
    public FriendChatHub(IMessageService messageService)
    {
        _messageService = messageService;
    }

    private readonly IMessageService _messageService;
    private readonly IConnectionService _connectionService = ConnectionService.GetInstance<FriendChatHub>();

    public override Task OnConnectedAsync()
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return Task.CompletedTask;
        }
        string? connectionId = _connectionService.FindConnectionId(id);
        if (connectionId is null)
        {
            _connectionService.AddConnection(id, Context.ConnectionId);
            return Task.CompletedTask;
        }
        Clients.Client(connectionId).SendAsync("Disconnected");
        _connectionService.ReplaceConnection(id, connectionId, Context.ConnectionId);
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            return Task.CompletedTask;
        }
        string currentConnectionId = _connectionService.FindConnectionId(id)!;
        if (currentConnectionId == Context.ConnectionId)
        {
            _connectionService.RemoveConnection(id);
        }
        return Task.CompletedTask;
    }

    [HubMethodName("SendMessage")]
    public async Task<MessageDtoOutput?> SendMessageMethod(MessageDtoInput messageInput)
    {
        ulong id = Context.User!.GetAccountId();
        if (_connectionService.FindConnectionId(id) != Context.ConnectionId)
        {
            Context.Abort();
            return null;
        }
        
        try
        {
            MessageDtoOutput? generatedMessage = await _messageService.SendAsync(id, messageInput);
            if (generatedMessage is null) return null;

            string? connectionId = _connectionService.FindConnectionId(messageInput.FriendId);
            if (connectionId is not null)
            {
                await Clients.Client(connectionId).SendAsync("MessageReceived", generatedMessage);
            }
            return generatedMessage;
        }
        catch (ArgumentException)
        {
            return null;
        }
    }
}