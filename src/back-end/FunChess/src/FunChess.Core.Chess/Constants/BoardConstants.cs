using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess.Constants;

public static class BoardConstants
{
    public const int Length = 8;
    public const int TotalSize = Length * Length;
    public const int MaxIndex = Length - 1;
    public const int MinIndex = 0;

    public static Cell[] GenerateDefaultBoard()
    {
        var board = new Cell[TotalSize];
        Array.Copy(InitialBoard, board, TotalSize);

        return board;
    }

    public static ReadOnlyMemory<Cell> GetInitialBoard() => InitialBoard;

    private static readonly Cell[] InitialBoard =
    {
        Cell.Get(Piece.Rook, Team.White), Cell.Get(Piece.Knight, Team.White), Cell.Get(Piece.Bishop, Team.White), Cell.Get(Piece.Queen, Team.White),
        Cell.Get(Piece.King, Team.White), Cell.Get(Piece.Bishop, Team.White), Cell.Get(Piece.Knight, Team.White), Cell.Get(Piece.Rook, Team.White),
        Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White),
        Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White), Cell.Get(Piece.Pawn, Team.White),
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black),
        Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black), Cell.Get(Piece.Pawn, Team.Black),
        Cell.Get(Piece.Rook, Team.Black), Cell.Get(Piece.Knight, Team.Black), Cell.Get(Piece.Bishop, Team.Black), Cell.Get(Piece.Queen, Team.Black),
        Cell.Get(Piece.King, Team.Black), Cell.Get(Piece.Bishop, Team.Black), Cell.Get(Piece.Knight, Team.Black), Cell.Get(Piece.Rook, Team.Black),
    };
}