using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Extensions;

namespace FunChess.Core.Chess.Pieces;

internal sealed class Pawn : Piece
{
    private const int MoveLength = 1;
    private const int InitialMoveLength = 2;

    internal override bool Move(Board board, Move move, out SpecialMove specialMove)
    {
        if (!base.Move(board, move, out specialMove)) return false;
        switch (specialMove)
        {
            case SpecialMove.PawnLong:
                board.Teams[board.Turn].ExposedEnPassant = move.Next;
                break;
            case SpecialMove.EnPassant when board.Turn == Team.White:
                board.InternalBoard[board.Teams[Team.Black].ExposedEnPassant!.Value.Index] = Cell.Empty;
                break;
            case SpecialMove.EnPassant:
                board.InternalBoard[board.Teams[Team.White].ExposedEnPassant!.Value.Index] = Cell.Empty;
                break;
        }
        if (board.Turn == Team.White)
        {
            if (move.Next.Y == BoardConstants.MaxIndex) board.InternalBoard[move.Next.Index] = Cell.Get(Queen, Team.White);
            return true;
        }
        if (move.Next.Y == BoardConstants.MinIndex) board.InternalBoard[move.Next.Index] = Cell.Get(Queen, Team.Black);
        return true;
    }

    internal override bool MoveIsValid(Board board, Move move , out SpecialMove specialMove)
    {
        return board.Turn == Team.White 
            ? WhiteMoveIsValid(board, move, out specialMove) 
            : BlackMoveIsValid(board, move, out specialMove);
    }

    private static bool WhiteMoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
        if (move.Previous.Y == BoardConstants.MinIndex + 1)
        {
            if (move.DiffY == InitialMoveLength)
            {
                specialMove = SpecialMove.PawnLong;
                return move.DiffX == 0 && board.InternalBoard[move.Next.Index].IsEmpty() && board.InternalBoard.CheckNorth(move);
            }
        }
        if (move.DiffY != MoveLength || move.DiffX < -MoveLength || move.DiffX > MoveLength) return false;
        if (move.DiffX == 0) return board.InternalBoard[move.Next.Index].IsEmpty();
        if (!board.InternalBoard[move.Next.Index].IsEmpty()) return true;

        specialMove = SpecialMove.EnPassant;
        DetailedTeam blackTeam = board.Teams[Team.Black];
        return blackTeam.ExposedEnPassant.HasValue && blackTeam.ExposedEnPassant.Value.Index + 8 == move.Next.Index;
    }
    
    private static bool BlackMoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
        if (move.Previous.Y == BoardConstants.MaxIndex - 1)
        {
            if (move.DiffY == -InitialMoveLength)
            {
                specialMove = SpecialMove.PawnLong;
                return move.DiffX == 0 && board.InternalBoard[move.Next.Index].IsEmpty() && board.InternalBoard.CheckSouth(move);
            }
        }
        if (move.DiffY != -MoveLength || move.DiffX < -MoveLength || move.DiffX > MoveLength) return false;
        if (move.DiffX == 0) return board.InternalBoard[move.Next.Index].IsEmpty();
        if (!board.InternalBoard[move.Next.Index].IsEmpty()) return true;
        
        specialMove = SpecialMove.EnPassant;
        DetailedTeam whiteTeam = board.Teams[Team.White];
        return whiteTeam.ExposedEnPassant.HasValue && whiteTeam.ExposedEnPassant.Value.Index - 8 == move.Next.Index;
    }
}