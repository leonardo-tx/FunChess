using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess;

public sealed class Board
{
    public Board()
    {
        InternalBoard = BoardConstants.GenerateDefaultBoard();
        Teams = new Dictionary<Team, DetailedTeam>
        {
            { Team.White, new DetailedTeam(Team.White) },
            { Team.Black, new DetailedTeam(Team.Black) }
        };
    }

    private Board(Cell[] board, Dictionary<Team, DetailedTeam> teams, Team turn)
    {
        InternalBoard = board;
        Teams = teams;
        Turn = turn;
    }

    private MatchState? _lastMatchState;

    internal readonly Cell[] InternalBoard;

    internal readonly Dictionary<Team, DetailedTeam> Teams;

    public Team Turn { get; private set; } = Team.White;

    public Team NextTurn => (Team)((byte)Turn % (byte)Team.Black + (byte)Team.White);
    
    public ReadOnlySpan<Cell> InternalBoardAsSpan() => InternalBoard;

    public bool MovePiece(Move move)
    {
        if (!PieceCanMove(move)) return false;

        InternalBoard[move.Previous.Index].Piece!.Move(this, move);
        ChangeTurn();

        return true;
    }

    public bool PieceCanMove(Move move)
    {
        Cell selectedCell = InternalBoard[move.Previous.Index];
        if (!selectedCell.IsFromTeam(Turn) || move.Previous.Index == move.Next.Index) return false;

        Cell targetCell = InternalBoard[move.Next.Index];
        if (targetCell.IsFromTeam(Turn)) return false;
        
        if (!selectedCell.Piece.MoveIsValid(this, move, out _)) return false;

        InternalBoard[move.Next.Index] = selectedCell;
        InternalBoard[move.Previous.Index] = Cell.Empty;

        bool isKing = selectedCell.Piece == Piece.King;

        if (isKing) Teams[Turn].KingPosition = move.Next;
        bool kingInCheck = KingInCheck();
        if (isKing) Teams[Turn].KingPosition = move.Previous;
        
        InternalBoard[move.Next.Index] = targetCell;
        InternalBoard[move.Previous.Index] = selectedCell;
        
        return !kingInCheck;
    }

    public MatchState GetMatchState()
    {
        if (_lastMatchState.HasValue) return _lastMatchState.Value;
        
        bool kingInCheck = KingInCheck();

        if (!kingInCheck)
        {
            _lastMatchState = HasAtLeastOneMove() ? MatchState.Running : MatchState.Stalemate;
            return _lastMatchState.Value;
        }
        if (HasAtLeastOneMove())
        {
            _lastMatchState = MatchState.Running;
            return _lastMatchState.Value;
        }
        _lastMatchState = (MatchState)NextTurn;
        return _lastMatchState.Value;
    }

    private bool HasAtLeastOneMove()
    {
        for (byte i = 0; i < BoardConstants.TotalSize; i++)
        {
            Cell currentCell = InternalBoard[i];
            if (!currentCell.IsFromTeam(Turn)) continue;

            Position previous = new(i);
            for (byte j = 0; j < BoardConstants.TotalSize; j++)
            {
                Move possibleMove = new(previous, new Position(j));
                if (PieceCanMove(possibleMove)) return true;
            }
        }
        return false;
    }

    public bool KingInCheck()
    {
        Position kingPosition = GetKingPosition();
        Position? currentTeamExposedEnPassant = Teams[Turn].ExposedEnPassant;
        Position? targetTeamExposedEnPassant = Teams[NextTurn].ExposedEnPassant;
        CastlingPlay targetCastlingPlays = Teams[NextTurn].CastlingPlays;
        for (byte i = 0; i < BoardConstants.TotalSize; i++)
        {
            Cell currentCell = InternalBoard[i];
            if (currentCell.IsEmpty() || currentCell.IsFromTeam(Turn)) continue;

            Move possibleMove = new(new Position(i), kingPosition);

            ChangeTurn();
            bool moveIsValid = currentCell.Piece.MoveIsValid(this, possibleMove, out _);

            Teams[Turn].ExposedEnPassant = targetTeamExposedEnPassant;
            Teams[Turn].CastlingPlays = targetCastlingPlays;
            Turn = NextTurn;
            Teams[Turn].ExposedEnPassant = currentTeamExposedEnPassant;

            if (moveIsValid) return true;
        }
        return false;
    }

    private Position GetKingPosition()
    {
        Position? kingPosition = Teams[Turn].KingPosition;
        if (kingPosition.HasValue) return kingPosition.Value;
        
        Cell kingCell = Cell.Get(Piece.King, Turn);
        for (byte i = 0; i < BoardConstants.TotalSize; i++)
        {
            if (InternalBoard[i] == kingCell) return new Position(i);
        }
        throw new Exception("Invalid board! Missing king.");
    }

    private void ChangeTurn()
    {
        _lastMatchState = null;
        Turn = NextTurn;
        Teams[Turn].ExposedEnPassant = null;
    }

    public byte[] ToByteArray()
    {
        List<byte> bytes = new() { (byte)Turn };
        for (int i = 1; i <= Teams.Count; i++)
        {
            bytes.Add((byte)Teams[(Team)i].CastlingPlays);
            bytes.Add(Teams[(Team)i].ExposedEnPassant?.Index ?? byte.MaxValue);
        }
        
        Cell lastCell = InternalBoard[0], currentCell = InternalBoard[0];
        int repeatCount = 1;
        
        for (int i = 1; i < BoardConstants.TotalSize; i++)
        {
            currentCell = InternalBoard[i];
            if (lastCell == currentCell) { ++repeatCount; continue; }

            AddCellsInfoToBytes(bytes, lastCell, repeatCount);
            repeatCount = 1;
            lastCell = currentCell;
        }
        AddCellsInfoToBytes(bytes, currentCell, repeatCount);
        return bytes.ToArray();
    }
    
    private static void AddCellsInfoToBytes(ICollection<byte> bytes, Cell cell, int repeatCount)
    {
        bytes.Add((byte)repeatCount);
        if (cell.IsEmpty())
        {
            bytes.Add(byte.MinValue);
            return;
        }
        bytes.Add((byte)cell);
    }

    public override string ToString()
    {
        ReadOnlySpan<byte> bytes = ToByteArray();
        return Convert.ToBase64String(bytes);
    }

    public static Board Parse(byte[] bytes)
    {
        var turn = (Team)bytes[0];
        var teams = new Dictionary<Team, DetailedTeam>(2);

        int bytesIndex = 1;
        for (int i = 1; i <= 2; i++)
        {
            teams[(Team)i] = new DetailedTeam
            (
                (CastlingPlay)bytes[bytesIndex], 
                bytes[bytesIndex + 1] == byte.MaxValue ? null : new Position(bytes[bytesIndex + 1])
            );
            bytesIndex += 2;
        }

        var board = new Cell[BoardConstants.TotalSize];
        for (int i = 0; bytesIndex < bytes.Length; bytesIndex += 2)
        {
            int repeatCount = bytes[bytesIndex];
            for (int j = 0; j < repeatCount; j++) board[i++] = (Cell)bytes[bytesIndex + 1];
        }
        return new Board(board, teams, turn);
    }
}