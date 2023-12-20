using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess;

public sealed class DetailedTeam
{
    public DetailedTeam(Team team)
    {
        KingPosition = team == Team.White ? new Position(0, 4) : new Position(7, 4);
    }
    
    internal DetailedTeam(CastlingPlay castlingPlays, Position? exposedEnPassant)
    {
        CastlingPlays = castlingPlays;
        ExposedEnPassant = exposedEnPassant;
    }
    
    public CastlingPlay CastlingPlays { get; internal set; } = CastlingPlay.All;

    public Position? ExposedEnPassant { get; internal set; }
    
    public Position? KingPosition { get; internal set; }
}