using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Pieces;

internal sealed class Knight : Piece
{
    internal override bool MoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
        if (move.DiffX is 1 or -1)
        {
            return move.DiffY is 2 or -2;
        }
        if (move.DiffY is 1 or -1)
        {
            return move.DiffX is 2 or -2;
        }
        return false;
    }
}