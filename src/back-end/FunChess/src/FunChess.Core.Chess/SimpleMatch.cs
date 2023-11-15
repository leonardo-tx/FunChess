using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess;

public readonly struct SimpleMatch
{
    private DateTime MinDateTime { get; } = new(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    
    public SimpleMatch(Match match)
    {
        SecondsLimit = match.SecondsLimit;
        TimeStamp = (match.LastMoveDateTime.Ticks - MinDateTime.Ticks) / 10000;
        MatchState = match.MatchState;
        Players = match.Players.ToArray();
    }
    
    public float SecondsLimit { get; }
    
    public long TimeStamp { get; }
    
    public MatchState MatchState { get; }
    
    public Player[] Players { get; }
}