using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Structs;

namespace FunChess.Tests.Chess.Structs;

public sealed class PositionTest
{
    [Fact]
    public void ValidateIndexConstructor()
    {
        for (byte i = 0; i < BoardConstants.TotalSize; i++)
        {
            Position position = new(i);

            int y = i / BoardConstants.Length;
            int x = i % BoardConstants.Length;
            
            Assert.True(position.Index == i);
            Assert.True(position.X == x);
            Assert.True(position.Y == y);
        }
    }

    [Fact]
    public void ValidateCoordsConstructor()
    {
        for (byte y = 0; y < BoardConstants.Length; y++)
        {
            for (byte x = 0; x < BoardConstants.Length; x++)
            {
                Position position = new(y, x);
                int index = y * BoardConstants.Length + x;
                
                Assert.True(position.Index == index);
                Assert.True(position.X == x);
                Assert.True(position.Y == y);
            }
        }
    }
}