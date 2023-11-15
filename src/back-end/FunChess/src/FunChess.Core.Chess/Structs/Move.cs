using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace FunChess.Core.Chess.Structs;

public readonly struct Move
{
    public Move(Position previous, Position next)
    {
        Previous = previous;
        Next = next;
        DiffX = next.X - previous.X;
        DiffY = next.Y - previous.Y;
    }

    public Position Previous { get; }

    public Position Next { get; }

    public int DiffX { get; }

    public int DiffY { get; }

    public override string ToString()
    {
        return $"{Previous}|{Next}";
    }

    public static bool TryParse(string text,[NotNullWhen(true)] out Move? move)
    {
        move = null;
        
        ReadOnlySpan<char> span = text;
        if (span.IsEmpty) return false;
        
        int index = 1;
        while (index < span.Length && span[index] != '|')
        {
            ++index;
        }
        if (index + 1 == span.Length) return false;
        if (!int.TryParse(span[..index], out int previous)) return false;
        if (!int.TryParse(span.Slice(index + 1, span.Length - index - 1), out int next)) return false;

        try
        {
            Position previousPosition = new(previous);
            Position nextPosition = new(next);

            move = new Move(previousPosition, nextPosition);
            return true;
        }
        catch
        {
            return false;
        }
    }
}