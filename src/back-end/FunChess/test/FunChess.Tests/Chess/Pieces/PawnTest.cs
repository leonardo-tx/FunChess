using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class PawnTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        // White pawns
        for (int x = 0; x < BoardConstants.Length; x++)
        {
            Position pawnToMove = new(1, x);
            for (int y = 2; y < BoardConstants.Length; y++)
            {
                Position nextMove = new(y, x);
                if (y <= 3)
                {
                    Assert.True(board.PieceCanMove(new Move(pawnToMove, nextMove)));
                    continue;
                }
                Assert.False(board.PieceCanMove(new Move(pawnToMove, nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));

        // Black pawns
        for (int x = 0; x < BoardConstants.Length; x++)
        {
            Position pawnToMove = new(6, x);
            for (int y = 5; y >= BoardConstants.MinIndex; y--)
            {
                Position nextMove = new(y, x);
                if (y >= 4)
                {
                    Assert.True(board.PieceCanMove(new Move(pawnToMove, nextMove)));
                    continue;
                }
                Assert.False(board.PieceCanMove(new Move(pawnToMove, nextMove)));
            }
        }
    }
}