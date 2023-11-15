using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class KnightTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        // White knights
        for (int y = 0; y < BoardConstants.Length; y++)
        {
            for (int x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                if (y == 2 && (x == 0 || x == 2))
                {
                    Assert.True(board.PieceCanMove(new Move(new(0, 1), nextMove)));
                    Assert.False(board.PieceCanMove(new Move(new(0, 6), nextMove)));
                    continue;
                }
                if (y == 2 && (x == 7 || x == 5))
                {
                    Assert.False(board.PieceCanMove(new Move(new(0, 1), nextMove)));
                    Assert.True(board.PieceCanMove(new Move(new(0, 6), nextMove)));
                    continue;
                }
                Assert.False(board.PieceCanMove(new Move(new(0, 1), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(0, 6), nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));

        // Black knights
        for (int y = 0; y < BoardConstants.Length; y++)
        {
            for (int x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                if (y == 5 && (x == 0 || x == 2))
                {
                    Assert.True(board.PieceCanMove(new Move(new(7, 1), nextMove)));
                    Assert.False(board.PieceCanMove(new Move(new(7, 6), nextMove)));
                    continue;
                }
                if (y == 5 && (x == 7 || x == 5))
                {
                    Assert.False(board.PieceCanMove(new Move(new(7, 1), nextMove)));
                    Assert.True(board.PieceCanMove(new Move(new(7, 6), nextMove)));
                    continue;
                }
                Assert.False(board.PieceCanMove(new Move(new(7, 1), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(7, 6), nextMove)));
            }
        }
    }
}