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
        _queueRepository.Connections.Add(Context.ConnectionId);
        Match? match = _queueRepository.FindAccountMatch(id);

        if (match is null) return;
        Player player = match.GetPlayerById(id);
        
        if (_queueRepository.Connections.Exists(player.ConnectionId))
        {
            Context.Abort();
            return;
        }
        player.ConnectionId = Context.ConnectionId;
        
        await Clients.Client(Context.ConnectionId).SendAsync("Match", new SimpleMatch(match), match.Board.ToString(), player.Team);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _queueRepository.Connections.Remove(Context.ConnectionId);
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

        await Clients.Clients
        (
            match.WhiteTeamPlayer.ConnectionId,
            match.BlackTeamPlayer.ConnectionId
        ).SendAsync("BoardUpdate", new SimpleMatch(match), move.ToString());
        return true;
    }
}