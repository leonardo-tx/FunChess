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
            await CreateMatch(stoppingToken);
        }
    }

    private async Task CreateMatch(CancellationToken stoppingToken)
    {
        QueueAccount queueAccount1 = await GetQueueAccount(stoppingToken);
        QueueAccount queueAccount2 = await GetQueueAccount(stoppingToken);
        
        Match match = new
        (
            900.00f,
            new Player(queueAccount1, Team.White), 
            new Player(queueAccount2, Team.Black)
        );

        _queueRepository.AddAccountToMatch(queueAccount1.AccountId, match);
        _queueRepository.AddAccountToMatch(queueAccount2.AccountId, match);
        
        await _matchHub.Groups.AddToGroupAsync(queueAccount1.ConnectionId, match.Id, stoppingToken);
        await _matchHub.Groups.AddToGroupAsync(queueAccount2.ConnectionId, match.Id, stoppingToken);

        SimpleMatch matchInfo = new(match);
        
        await _matchHub.Clients.Client(queueAccount1.ConnectionId).SendAsync("MatchStart", matchInfo, Team.White, stoppingToken);
        await _matchHub.Clients.Client(queueAccount2.ConnectionId).SendAsync("MatchStart", matchInfo, Team.Black, stoppingToken);
    }

    private async Task<QueueAccount> GetQueueAccount(CancellationToken stoppingToken)
    {
        QueueAccount? result = null;
        do
        {
            while (_queueRepository.QueueCount == 0) await Task.Delay(500, stoppingToken);
            
            QueueAccount queueAccount = _queueRepository.Dequeue();
            if (!_queueRepository.ConnectionExists(queueAccount.ConnectionId))
            {
                _queueRepository.RemoveAccountWithoutMatch(queueAccount.AccountId);
                continue;
            }
            result = queueAccount;
        } while (result is null);

        return result;
    }
}