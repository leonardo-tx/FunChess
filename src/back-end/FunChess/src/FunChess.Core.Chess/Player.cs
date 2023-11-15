using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess;

public sealed class Player
{
    public Player(ulong accountId, Team team)
    {
        AccountId = accountId;
        Team = team;
    }
    
    public Team Team { get; }
    
    public ulong AccountId { get; }
    
    public float SpentSeconds { get; internal set; }
    
    public bool Disconnected { get; set; }
}