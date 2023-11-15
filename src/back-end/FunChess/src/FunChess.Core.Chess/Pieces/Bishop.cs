using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Extensions;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Pieces;

internal sealed class Bishop : Piece
{
    internal override bool MoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
        if (move.DiffX == move.DiffY)
        {
            if (Math.Abs(move.DiffX) <= 1)
            {
                return true;
            }
            return move.DiffX < 0 ? board.InternalBoard.CheckSouthwest(move) : board.InternalBoard.CheckNortheast(move);
        }
        if (move.DiffX + move.DiffY != 0) return false;
        if (Math.Abs(move.DiffX) <= 1)
        {
            return true;
        }
        return move.DiffX < 0 ? board.InternalBoard.CheckNorthwest(move) : board.InternalBoard.CheckSoutheast(move);
    }
}