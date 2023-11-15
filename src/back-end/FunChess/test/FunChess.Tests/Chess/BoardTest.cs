using FunChess.Core.Chess;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Structs;

namespace FunChess.Tests.Chess;

public sealed class BoardTest
{
    [Fact]
    public void ValidateInitialBoard()
    {
        ReadOnlySpan<Cell> initialBoard = BoardConstants.GetInitialBoard().Span;
        Board board = new();

        ReadOnlySpan<Cell> internalBoard = board.InternalBoardAsSpan();
        for (int i = 0; i < BoardConstants.TotalSize; i++)
        {
            Assert.True(initialBoard[i].Piece == internalBoard[i].Piece);
            Assert.True(initialBoard[i].Team == internalBoard[i].Team);
        }
        Assert.True(board.Turn == Team.White);
    }

    [Fact]
    public void ValidateTurnChange()
    {
        Board board = new();

        Assert.True(board.Turn == Team.White);
        Assert.True(board.NextTurn == Team.Black);
        board.MovePiece(new Move(new Position(8), new Position(24))); // Valid move
        
        Assert.True(board.Turn == Team.Black);
        Assert.True(board.NextTurn == Team.White);
        board.MovePiece(new Move(new Position(9), new Position(25))); // Invalid move
        
        Assert.True(board.Turn == Team.Black);
        Assert.True(board.NextTurn == Team.White);
        board.MovePiece(new Move(new Position(55), new Position(47))); // Valid move
        
        Assert.True(board.Turn == Team.White);
        Assert.True(board.NextTurn == Team.Black);
    }

    [Fact]
    public void ValidateParsing()
    {
        Board board = new();

        byte[] boardToBytes = board.ToByteArray();
        Board parsedBoard = Board.Parse(boardToBytes);

        for (int i = 0; i < BoardConstants.TotalSize; i++)
        {
            Cell originalCell = board.InternalBoardAsSpan()[i];
            Cell parsedCell = parsedBoard.InternalBoardAsSpan()[i];
            
            Assert.True(originalCell.Piece == parsedCell.Piece && originalCell.Team == parsedCell.Team);
        }
    }

    [Fact]
    public void ValidateKingInCheck()
    {
        Board board = new(); 
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(13), new Position(29)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(54), new Position(38)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(29), new Position(38)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(53), new Position(45)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(38), new Position(45)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(55), new Position(47)));
        Assert.False(board.KingInCheck());
        
        board.MovePiece(new Move(new Position(45), new Position(53)));
        Assert.True(board.KingInCheck());
    }
}