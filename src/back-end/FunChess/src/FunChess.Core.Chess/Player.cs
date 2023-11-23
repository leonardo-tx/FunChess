using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess;

public sealed class Player
{
    public Player(QueueAccount queueAccount, Team team)
    {
        AccountId = queueAccount.AccountId;
        ConnectionId = queueAccount.ConnectionId;
        Team = team;
    }
    
    public Team Team { get; }
    
    public ulong AccountId { get; }
    
    public float SpentSeconds { get; internal set; }
    
    public string ConnectionId { get; set; }
}