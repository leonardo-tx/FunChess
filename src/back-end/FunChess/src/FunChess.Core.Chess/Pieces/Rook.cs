using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Extensions;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Pieces;

internal sealed class Rook : Piece
{
    public override bool Move(Board board, Move move)
    {
        if (!MoveIsValid(board, move, out _)) return false;
        
        board.InternalBoard[move.Next.Index] = board.InternalBoard[move.Previous.Index];
        board.InternalBoard[move.Previous.Index] = Cell.Empty;
        
        CastlingPlay plays = board.Teams[board.Turn].CastlingPlays;
        if ((plays & CastlingPlay.LeftCastling) == CastlingPlay.LeftCastling && move.Previous.Index is 0 or 56)
        {
            plays &= ~CastlingPlay.LeftCastling;
            board.Teams[board.Turn].CastlingPlays = plays;
        }
        else if ((plays & CastlingPlay.RightCastling) == CastlingPlay.RightCastling && move.Previous.Index is 7 or 63)
        {
            plays &= ~CastlingPlay.RightCastling;
            board.Teams[board.Turn].CastlingPlays = plays;
        }
        return true;
    }
    
    public override bool MoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
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