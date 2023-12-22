using FunChess.Core.Chess.Enums;
using FunChess.Core.Hub;

namespace FunChess.Core.Chess;

public sealed class Player
{
    public Player(AccountConnection accountConnection, Team team)
    {
        AccountId = accountConnection.AccountId;
        ConnectionId = accountConnection.ConnectionId;
        Team = team;
    }
    
    public Team Team { get; }
    
    public ulong AccountId { get; }
    
    public float SpentSeconds { get; internal set; }
    
    public string ConnectionId { get; set; }
}