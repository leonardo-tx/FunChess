using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Extensions;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Pieces;

internal sealed class King : Piece
{
    private const int MoveLength = 1;

    public override bool Move(Board board, Move move)
    {
        if (!MoveIsValid(board, move, out SpecialMove specialMove)) return false;
        
        board.InternalBoard[move.Next.Index] = board.InternalBoard[move.Previous.Index];
        board.InternalBoard[move.Previous.Index] = Cell.Empty;
        board.Teams[board.Turn].CastlingPlays = CastlingPlay.None;
        board.Teams[board.Turn].KingPosition = move.Next;
        
        switch (specialMove)
        {
            case SpecialMove.LeftCastling:
                switch (board.Turn)
                {
                    case Team.White:
                        board.InternalBoard[3] = board.InternalBoard[0];
                        board.InternalBoard[0] = Cell.Empty;
                        break;
                    case Team.Black:
                        board.InternalBoard[59] = board.InternalBoard[56];
                        board.InternalBoard[56] = Cell.Empty;
                        break;
                }
                return true;
            case SpecialMove.RightCastling:
                switch (board.Turn)
                {
                    case Team.White:
                        board.InternalBoard[5] = board.InternalBoard[7];
                        board.InternalBoard[7] = Cell.Empty;
                        break;
                    case Team.Black:
                        board.InternalBoard[61] = board.InternalBoard[63];
                        board.InternalBoard[63] = Cell.Empty;
                        break;
                }
                return true;
            default:
                return true;
        }
    }

    public override bool MoveIsValid(Board board, Move move, out SpecialMove specialMove)
    {
        specialMove = SpecialMove.None;
        bool moveIsValid = move.DiffX is >= -MoveLength and <= MoveLength && move.DiffY is >= -MoveLength and <= MoveLength;
        CastlingPlay possiblePlays = board.Teams[board.Turn].CastlingPlays;
        
        if (moveIsValid || possiblePlays == CastlingPlay.None || move.DiffY != 0 || board.KingInCheck()) return moveIsValid;
        
        Position previous, next;
        switch (move.DiffX)
        {
            case 2:
                specialMove = SpecialMove.RightCastling;
                if ((possiblePlays & CastlingPlay.RightCastling) == CastlingPlay.None) return false;
                if (!board.InternalBoard.CheckEast(move)) return false;

                previous = new Position(board.Turn == Team.White ? (byte)7 : (byte)63);
                next = new Position(board.Turn == Team.White ? (byte)5 : (byte)61);
                return Rook.MoveIsValid(board, new Move(previous, next), out _);
            case -2:
                specialMove = SpecialMove.LeftCastling;
                if ((possiblePlays & CastlingPlay.LeftCastling) == CastlingPlay.None) return false;
                if (!board.InternalBoard.CheckWest(move)) return false;

                previous = new Position(board.Turn == Team.White ? (byte)0 : (byte)56);
                next = new Position(board.Turn == Team.White ? (byte)3 : (byte)59);
                return Rook.MoveIsValid(board, new Move(previous, next), out _);
        }
        return false;
    }
}