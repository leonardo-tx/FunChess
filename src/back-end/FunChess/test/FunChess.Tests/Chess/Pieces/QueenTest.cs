using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class QueenTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        Position blackQueen = new(7, 4);
        Position whiteQueen = new(0, 4);

        // White queen
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(whiteQueen, nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));

        // Black queen
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(blackQueen, nextMove)));
            }
        }
    }
}