using System.Text.Json.Serialization;
using FunChess.Core.Chess.Constants;
using FunChess.Core.Chess.Extensions;

namespace FunChess.Core.Chess.Structs;

public readonly struct Position
{
    public Position(int y, int x)
    {
        if (y.LengthIsOutOfBorder()) throw new ArgumentException("The y is out of the border.", nameof(y));
        if (x.LengthIsOutOfBorder()) throw new ArgumentException("The x is out of the border.", nameof(x));

        Y = y; X = x; Index = y * BoardConstants.Length + x;
    }
    
    public Position(int index)
    {
        if (index.SizeIsOutOfBorder()) throw new ArgumentException("The index is out of the border.", nameof(index));

        X = index % BoardConstants.Length;
        Y = index / BoardConstants.Length;
        Index = index;
    }

    public int X { get; }

    public int Y { get; }

    public int Index { get; }

    public override string ToString()
    {
        return Index.ToString();
    }
}