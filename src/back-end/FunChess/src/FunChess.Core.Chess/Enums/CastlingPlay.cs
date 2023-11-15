namespace FunChess.Core.Chess.Enums;

[Flags]
public enum CastlingPlay
{
    None = 0,
    LeftCastling = 1,
    RightCastling = 2,
    All = 3
}