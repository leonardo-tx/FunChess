using System.Security.Claims;
using FunChess.Core.Client.Attributes;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Services;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Client.Extensions;
using FunChess.Core.Hub.Services;
using FunChess.DAL.Hub;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Hubs;

[AuthorizeCustom]
public sealed class MatchHub : Hub
{
    public MatchHub(IQueueService queueService)
    {
        _queueService = queueService;
    }

    private readonly IQueueService _queueService;
    private readonly IConnectionService _connectionService = ConnectionService.GetInstance<MatchHub>();

    public override async Task OnConnectedAsync()
    {
        string? textId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (textId is null || !ulong.TryParse(textId, out ulong id))
        {
            Context.Abort();
            return;
        }
        _connectionService.Add(Context.ConnectionId);
        Match? match = _queueService.FindAccountMatch(id);

        if (match is null) return;
        Player player = match.GetPlayerById(id);
        
        if (_connectionService.Exists(player.ConnectionId))
        {
            Context.Abort();
            return;
        }
        player.ConnectionId = Context.ConnectionId;
        
        await Clients.Client(Context.ConnectionId).SendAsync("Match", new SimpleMatch(match), match.Board.ToString(), player.Team);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _connectionService.Remove(Context.ConnectionId);
        return Task.CompletedTask;
    }

    [HubMethodName("Enqueue")]
    public Task<bool> EnqueueMethod()
    {
        ulong id = Context.User!.GetAccountId();
        return Task.FromResult(_queueService.Enqueue(id, Context.ConnectionId));
    }

    [HubMethodName("Move")]
    public async Task<bool> MoveMethod(string moveText)
    {
        ulong id = Context.User!.GetAccountId();
        if (!Move.TryParse(moveText, out Move? move)) return false;
        
        Match? match = _queueService.FindAccountMatch(id);
        
        if (match is null) return false;
        if (!match.MoveAtBoard(id, move.Value)) return false;

        await Clients.Clients
        (
            match.WhiteTeamPlayer.ConnectionId,
            match.BlackTeamPlayer.ConnectionId
        ).SendAsync("BoardUpdate", new SimpleMatch(match), move.ToString());
        return true;
    }

    [HubMethodName("Surrender")]
    public async Task Surrender()
    {
        ulong id = Context.User!.GetAccountId();
        Match? match = _queueService.FindAccountMatch(id);

        match?.Surrender(id);
    }
}