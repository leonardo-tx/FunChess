using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Services;

public sealed class MatchService : BackgroundService
{
    public MatchService(IHubContext<MatchHub> matchHub, IQueueRepository queueRepository)
    {
        _matchHub = matchHub;
        _queueRepository = queueRepository;
    }
    
    private readonly IHubContext<MatchHub> _matchHub;
    private readonly IQueueRepository _queueRepository;

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
        IEnumerable<Match> matches = _queueRepository.GetAllMatches();
        foreach (Match match in matches)
        {
            if (match.MatchState == MatchState.Running) continue;
            _queueRepository.FinishMatch(match);

            await _matchHub.Clients.Group(match.Id).SendAsync("End", match.MatchState, stoppingToken);
        }
    }
}