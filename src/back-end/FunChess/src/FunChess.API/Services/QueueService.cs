using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace FunChess.API.Services;

public sealed class QueueService : BackgroundService
{
    public QueueService(IHubContext<MatchHub> matchHub, IQueueRepository queueRepository)
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
            while (_queueRepository.QueueCount > 1)
            {
                await CreateMatch(stoppingToken);
            }
            await Task.Delay(500, stoppingToken);
        }
    }

    private async Task CreateMatch(CancellationToken stoppingToken)
    {
        QueueAccount queueAccount1 = await GetQueueAccount(stoppingToken);
        QueueAccount queueAccount2 = await GetQueueAccount(stoppingToken);
        while (queueAccount1.AccountId == queueAccount2.AccountId)
        {
            if (_queueRepository.QueueCount == 0) continue;
            queueAccount2 = await GetQueueAccount(stoppingToken);
        }
        
        Match match = new
        (
            900.00f,
            new Player(queueAccount1.AccountId, Team.White), 
            new Player(queueAccount2.AccountId, Team.Black)
        );

        _queueRepository.AddToOnMatch(queueAccount1.AccountId, match);
        _queueRepository.AddToOnMatch(queueAccount2.AccountId, match);
        
        await _matchHub.Groups.AddToGroupAsync(queueAccount1.ConnectionId, match.Id, stoppingToken);
        await _matchHub.Groups.AddToGroupAsync(queueAccount2.ConnectionId, match.Id, stoppingToken);

        SimpleMatch matchInfo = new(match);
        
        await _matchHub.Clients.Client(queueAccount1.ConnectionId).SendAsync("MatchStart", matchInfo, Team.White, stoppingToken);
        await _matchHub.Clients.Client(queueAccount2.ConnectionId).SendAsync("MatchStart", matchInfo, Team.Black, stoppingToken);
    }

    private async Task<QueueAccount> GetQueueAccount(CancellationToken stoppingToken)
    {
        QueueAccount? queueAccountResult = null;
        do
        {
            while (_queueRepository.QueueCount == 0)
            {
                await Task.Delay(500, stoppingToken);
            }
            QueueAccount queueAccount = _queueRepository.Dequeue();

            if (_queueRepository.FindAccountMatch(queueAccount.AccountId) is null)
            {
                queueAccountResult = queueAccount;
            }
        } while (queueAccountResult is null);
        
        return queueAccountResult;
    }
}