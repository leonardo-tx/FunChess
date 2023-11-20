using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Extensions;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Pieces;

internal sealed class Queen : Piece
{
    public override bool Move(Board board, Move move)
    {
        if (!MoveIsValid(board, move, out _)) return false;

        board.InternalBoard[move.Next.Index] = board.InternalBoard[move.Previous.Index];
        board.InternalBoard[move.Previous.Index] = Cell.Empty;

        return true;
    }
    
    public override bool MoveIsValid(Board board, Move move, out SpecialMove specialMove)
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
        if (move.DiffX + move.DiffY == 0)
        {
            if (Math.Abs(move.DiffX) <= 1)
            {
                return true;
            }
            return move.DiffX < 0 ? board.InternalBoard.CheckNorthwest(move) : board.InternalBoard.CheckSoutheast(move);
        }
        if (move.DiffX == 0)
        {
            if (Math.Abs(move.DiffY) <= 1)
            {
                return true;
            }
            return move.DiffY < 0 ? board.InternalBoard.CheckSouth(move) : board.InternalBoard.CheckNorth(move);
        }
        if (move.DiffY != 0) return false;
        if (Math.Abs(move.DiffX) <= 1) return true;
        
        return move.DiffX < 0 ? board.InternalBoard.CheckWest(move) : board.InternalBoard.CheckEast(move);
    }
}