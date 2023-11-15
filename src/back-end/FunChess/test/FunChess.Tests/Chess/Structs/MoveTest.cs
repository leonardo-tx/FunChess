using System.Text;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Structs;

namespace FunChess.Tests.Chess.Structs;

public sealed class MoveTest
{
    [Fact]
    public void ValidateAllMoves()
    {
        for (int i = 0; i < BoardConstants.TotalSize; i++)
        {
            Position previousPosition = new(i);
            for (int j = 0; j < BoardConstants.TotalSize; j++)
            {
                Position nextPosition = new(j);
                Move move = new(previousPosition, nextPosition);

                int diffX = nextPosition.X - previousPosition.X;
                int diffY = nextPosition.Y - previousPosition.Y;
                
                Assert.True(move.DiffX == diffX);
                Assert.True(move.DiffY == diffY);
            }
        }
    }

    [Fact]
    public void ValidateAllParsings()
    {
        StringBuilder stringBuilder = new();
        for (int i = 0; i < BoardConstants.TotalSize; i++)
        {
            stringBuilder.Append($"{i}|");
            for (int j = 0; j < BoardConstants.TotalSize; j++)
            {
                stringBuilder.Append(j);
                bool validation = Move.TryParse(stringBuilder.ToString(), out _);
                Assert.True(validation);

                stringBuilder.Clear();
                stringBuilder.Append($"{i}|");
            }
            stringBuilder.Clear();
        }
    }
}