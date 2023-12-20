using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class KingTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        Position blackKing = new(7, 3);
        Position whiteKing = new(0, 3);

        // White king
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(whiteKing, nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));

        // Black king
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(blackKing, nextMove)));
            }
        }
    }
}