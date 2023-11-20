using System.Security.Claims;
using FunChess.Core.Auth.Attributes;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Repositories;
using FunChess.Core.Chess.Structs;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Hubs;

[AuthorizeCustom]
public sealed class MatchHub : Hub
{
    public MatchHub(IQueueRepository queueRepository)
    {
        _queueRepository = queueRepository;
    }

    private readonly IQueueRepository _queueRepository;

    public override async Task OnConnectedAsync()
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return;
        }
        Match? match = _queueRepository.FindAccountMatch(id);

        if (match is null) return;
        Player player = match.GetPlayerById(id);

        if (!player.Disconnected)
        {
            Context.Abort();
            return;
        }
        player.Disconnected = false;
        await Clients.Client(Context.ConnectionId).SendAsync("Match", new SimpleMatch(match), match.Board.ToString(), player.Team);
        await Groups.AddToGroupAsync(Context.ConnectionId, match.Id);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return Task.CompletedTask;
        }
        Match? match = _queueRepository.FindAccountMatch(id);

        if (match is null) return Task.CompletedTask;
        Player player = match.GetPlayerById(id);

        player.Disconnected = true;
        return Task.CompletedTask;
    }

    [HubMethodName("Enqueue")]
    public Task<bool> EnqueueMethod()
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return Task.FromResult(false);
        }
        return Task.FromResult(_queueRepository.Enqueue(id, Context.ConnectionId));
    }

    [HubMethodName("Move")]
    public async Task<bool> MoveMethod(string moveText)
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return false;
        }
        if (!Move.TryParse(moveText, out Move? move)) return false;
        
        Match? match = _queueRepository.FindAccountMatch(id);
        
        if (match is null) return false;
        if (!match.MoveAtBoard(id, move.Value)) return false;
        
        await Clients.Group(match.Id).SendAsync("BoardUpdate", new SimpleMatch(match), move.ToString());
        return true;
    }
}