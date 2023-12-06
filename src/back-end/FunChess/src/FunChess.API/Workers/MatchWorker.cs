using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Services;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Workers;

public sealed class MatchWorker : BackgroundService
{
    public MatchWorker(IHubContext<MatchHub> matchHub, IQueueService queueService)
    {
        _matchHub = matchHub;
        _queueService = queueService;
    }
    
    private readonly IHubContext<MatchHub> _matchHub;
    private readonly IQueueService _queueService;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await FindFinishedMatches(stoppingToken);
            await Task.Delay(500, stoppingToken);
        }
    }

    private async Task FindFinishedMatches(CancellationToken stoppingToken)
    {
        IEnumerable<Match?> matches = _queueService.GetAllMatches();
        foreach (Match? match in matches)
        {
            if (match is null || match.MatchState == MatchState.Running) continue;
            _queueService.FinishMatch(match);

            await _matchHub.Clients.Clients
            (
                match.WhiteTeamPlayer.ConnectionId,
                match.BlackTeamPlayer.ConnectionId
            ).SendAsync("End", match.MatchState, stoppingToken);
        }
    }
}