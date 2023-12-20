using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess.Extensions;

public static class CellArrayExtensions
{
    public static bool CheckNorth(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y + 1); y < move.Next.Y; y++)
        {
            Position currentPosition = new(y, move.Previous.X);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckSouth(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y - 1); y > move.Next.Y; y--)
        {
            Position currentPosition = new(y, move.Previous.X);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckEast(this Cell[] board, Move move)
    {
        for (byte x = (byte)(move.Previous.X + 1); x < move.Next.X; x++)
        {
            Position currentPosition = new(move.Previous.Y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckWest(this Cell[] board, Move move)
    {
        for (byte x = (byte)(move.Previous.X - 1); x > move.Next.X; x--)
        {
            Position currentPosition = new(move.Previous.Y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckNortheast(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y + 1), x = (byte)(move.Previous.X + 1); y < move.Next.Y; y++, x++)
        {
            Position currentPosition = new(y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckNorthwest(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y + 1), x = (byte)(move.Previous.X - 1); y < move.Next.Y; y++, x--)
        {
            Position currentPosition = new(y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }

    public static bool CheckSoutheast(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y - 1), x = (byte)(move.Previous.X + 1); y > move.Next.Y; y--, x++)
        {
            Position currentPosition = new(y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }
    
    public static bool CheckSouthwest(this Cell[] board, Move move)
    {
        for (byte y = (byte)(move.Previous.Y - 1), x = (byte)(move.Previous.X - 1); y > move.Next.Y; y--, x--)
        {
            Position currentPosition = new(y, x);
            if (!board[currentPosition.Index].IsEmpty()) return false;
        }
        return true;
    }
}