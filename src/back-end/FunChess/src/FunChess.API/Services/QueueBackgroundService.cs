using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Services;

public sealed class QueueBackgroundService : BackgroundService
{
    public QueueBackgroundService(IHubContext<MatchHub> matchHub, IQueueRepository queueRepository)
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
            await CreateMatch(stoppingToken);
        }
    }

    private async Task CreateMatch(CancellationToken stoppingToken)
    {
        Match match = new
        (
            900.00f,
            new Player(await GetQueueAccount(stoppingToken), Team.White), 
            new Player(await GetQueueAccount(stoppingToken), Team.Black)
        );
        _queueRepository.RegisterMatchToAccounts(match);

        SimpleMatch matchInfo = new(match);
        
        await _matchHub.Clients.Client(match.WhiteTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.White, stoppingToken);
        await _matchHub.Clients.Client(match.BlackTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.Black, stoppingToken);
    }

    private async Task<QueueAccount> GetQueueAccount(CancellationToken stoppingToken)
    {
        QueueAccount? result = null;
        do
        {
            while (_queueRepository.QueueCount == 0) await Task.Delay(500, stoppingToken);
            
            QueueAccount queueAccount = _queueRepository.Dequeue();
            if (!_queueRepository.Connections.Exists(queueAccount.ConnectionId))
            {
                _queueRepository.RemoveAccountWithoutMatch(queueAccount.AccountId);
                continue;
            }
            result = queueAccount;
        } while (result is null);

        return result;
    }
}