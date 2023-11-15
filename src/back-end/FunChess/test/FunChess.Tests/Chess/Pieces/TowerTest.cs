using FunChess.Core.Chess;
using FunChess.Core.Chess.Structs;
using FunChess.Core.Chess.Constants;

namespace FunChess.Tests.Chess.Pieces;

public sealed class TowerTest
{
    [Fact]
    public void ValidateAllInitialMovements()
    {
        Board board = new();

        // White towers
        for (int y = 0; y < BoardConstants.Length; y++)
        {
            for (int x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(new(0, 0), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(0, 7), nextMove)));
            }
        }
        board.MovePiece(new Move(new Position(1, 0), new Position(2, 0)));

        // Black towers
        for (int y = 0; y < BoardConstants.Length; y++)
        {
            for (int x = 0; x < BoardConstants.Length; x++)
            {
                Position nextMove = new(y, x);
                Assert.False(board.PieceCanMove(new Move(new(7, 0), nextMove)));
                Assert.False(board.PieceCanMove(new Move(new(7, 7), nextMove)));
            }
        }
    }
}