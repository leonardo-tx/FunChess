using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Services;
using FunChess.DAL.Hub;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Workers;

public sealed class QueueWorker : BackgroundService
{
    public QueueWorker(IHubContext<MatchHub> matchHub, IQueueService queueService)
    {
        _matchHub = matchHub;
        _queueService = queueService;
    }

    private readonly IHubContext<MatchHub> _matchHub;
    private readonly IQueueService _queueService;
    private readonly ConnectionService _connectionService = ConnectionService.GetInstance<MatchHub>();
    
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
        _queueService.RegisterMatchToAccounts(match);

        SimpleMatch matchInfo = new(match);
        
        await _matchHub.Clients.Client(match.WhiteTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.White, stoppingToken);
        await _matchHub.Clients.Client(match.BlackTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.Black, stoppingToken);
    }

    private async Task<QueueAccount> GetQueueAccount(CancellationToken stoppingToken)
    {
        QueueAccount? result = null;
        do
        {
            while (_queueService.QueueCount == 0) await Task.Delay(500, stoppingToken);
            
            QueueAccount queueAccount = _queueService.Dequeue();
            if (!_connectionService.Exists(queueAccount.ConnectionId))
            {
                _queueService.RemoveAccountWithoutMatch(queueAccount.AccountId);
                continue;
            }
            result = queueAccount;
        } while (result is null);

        return result;
    }
}