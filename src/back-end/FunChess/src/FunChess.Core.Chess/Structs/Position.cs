using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Extensions;

namespace FunChess.Core.Chess.Structs;

public readonly struct Position
{
    public Position(byte y, byte x)
    {
        if (y.LengthIsOutOfBorder()) throw new ArgumentException("The y is out of the border.", nameof(y));
        if (x.LengthIsOutOfBorder()) throw new ArgumentException("The x is out of the border.", nameof(x));

        Y = y; X = x; Index = (byte)(y * BoardConstants.Length + x);
    }
    
    public Position(byte index)
    {
        if (index.SizeIsOutOfBorder()) throw new ArgumentException("The index is out of the border.", nameof(index));

        X = (byte)(index % BoardConstants.Length);
        Y = (byte)(index / BoardConstants.Length);
        Index = index;
    }

    public byte X { get; }

    public byte Y { get; }

    public byte Index { get; }

    public override string ToString()
    {
        return Index.ToString();
    }
}