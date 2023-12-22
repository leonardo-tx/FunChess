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
        }
        else
        {
            Clients.Client(connectionId).SendAsync("Disconnected");
            _connectionService.ReplaceConnection(id, connectionId, Context.ConnectionId);
        }
        Match? match = _queueService.FindAccountMatch(id);

        if (match is null) return Task.CompletedTask;
        Player player = match.GetPlayerById(id);
        
        player.ConnectionId = Context.ConnectionId;
        match.UpdateTurnPlayerSpentSeconds();
        
        Clients.Client(Context.ConnectionId).SendAsync("Match", new SimpleMatch(match), match.Board.ToString(), player.Team);
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
            _queueService.RemoveAccountWithoutMatch(id);
            _connectionService.RemoveConnection(id);
        }
        return Task.CompletedTask;
    }

    [HubMethodName("Enqueue")]
    public Task<bool> EnqueueMethod()
    {
        ulong id = Context.User!.GetAccountId();
        if (_connectionService.FindConnectionId(id) != Context.ConnectionId)
        {
            Context.Abort();
            return Task.FromResult(false);
        }
        return Task.FromResult(_queueService.Enqueue(id));
    }

    [HubMethodName("Move")]
    public async Task<bool> MoveMethod(string moveText)
    {
        ulong id = Context.User!.GetAccountId();
        if (_connectionService.FindConnectionId(id) != Context.ConnectionId)
        {
            Context.Abort();
            return false;
        }
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
    public Task Surrender()
    {
        ulong id = Context.User!.GetAccountId();
        if (_connectionService.FindConnectionId(id) != Context.ConnectionId)
        {
            Context.Abort();
            return Task.CompletedTask;
        }
        Match? match = _queueService.FindAccountMatch(id);

        match?.Surrender(id);
        return Task.CompletedTask;
    }
}