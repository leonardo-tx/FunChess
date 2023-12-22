using FunChess.API.Hubs;
using FunChess.Core.Chess;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Services;
using FunChess.Core.Hub;
using FunChess.Core.Hub.Services;
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
    private readonly IConnectionService _connectionService = ConnectionService.GetInstance<MatchHub>();
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CreateMatch(stoppingToken);
        }
    }

    private async Task CreateMatch(CancellationToken stoppingToken)
    {
        AccountConnection? accountConnection1 = null, accountConnection2 = null;
        do
        {
            try
            {
                accountConnection1 ??= new AccountConnection(GetQueueAccount(), _connectionService);
                accountConnection2 ??= new AccountConnection(GetQueueAccount(), _connectionService);

                if (accountConnection1.Value.AccountId == accountConnection2.Value.AccountId)
                {
                    accountConnection1 = null;
                    accountConnection2 = null;
                }
            }
            catch (ArgumentException)
            {
                await Task.Delay(500, stoppingToken);
                if (accountConnection1.HasValue)
                {
                    string? connectionId = _connectionService.FindConnectionId(accountConnection1.Value.AccountId);
                    if (connectionId is null || connectionId != accountConnection1.Value.ConnectionId)
                    {
                        accountConnection1 = null;
                    }
                }
                if (accountConnection2.HasValue)
                {
                    string? connectionId = _connectionService.FindConnectionId(accountConnection2.Value.AccountId);
                    if (connectionId is null || connectionId != accountConnection2.Value.ConnectionId)
                    {
                        accountConnection2 = null;
                    }
                }
            }
        } while (!accountConnection1.HasValue || !accountConnection2.HasValue);
        Match match = new
        (
            900.00f,
            new Player(accountConnection1.Value, Team.White), 
            new Player(accountConnection2.Value, Team.Black)
        );
        _queueService.RegisterMatchToAccounts(match);

        SimpleMatch matchInfo = new(match);
        
        await _matchHub.Clients.Client(match.WhiteTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.White, stoppingToken);
        await _matchHub.Clients.Client(match.BlackTeamPlayer.ConnectionId).SendAsync("MatchStart", matchInfo, Team.Black, stoppingToken);
    }

    private ulong? GetQueueAccount()
    {
        return _queueService.QueueCount == 0 ? null : _queueService.Dequeue();
    }
}