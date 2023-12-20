using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class BishopTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        // White bishops
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(new(0, 2), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(0, 5), nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));
        // Black bishops
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(new(7, 2), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(7, 5), nextMove)));
            }
        }
    }
}