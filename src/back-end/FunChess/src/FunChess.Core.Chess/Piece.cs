using FunChess.Core.Chess.Enums;
using FunChess.Core.Chess.Pieces;
using FunChess.Core.Chess.Structs;

namespace FunChess.Core.Chess;

public abstract class Piece : IEquatable<Piece>
{
    private static readonly Dictionary<byte, Piece> ChessPieces = new(6);

    public static readonly Piece King = new King();
    public static readonly Piece Queen = new Queen();
    public static readonly Piece Rook = new Rook();
    public static readonly Piece Knight = new Knight();
    public static readonly Piece Bishop = new Bishop();
    public static readonly Piece Pawn = new Pawn();

    protected Piece()
    {
        byte key = (byte)(1 << (2 + ChessPieces.Count));

        Value = key;
        ChessPieces.Add(key, this);
    }
    
    private byte Value { get; }

    public abstract bool Move(Board board, Move move);

    public abstract bool MoveIsValid(Board board, Move move, out SpecialMove specialMove);

    public bool Equals(Piece? other)
    {
        if (other is null)
        {
            return false;
        }
        return Value == other.Value;
    }

    public static explicit operator Piece(byte value)
    {
        for (byte i = 4; i <= 128; i <<= 1)
        {
            if ((i & value) == 0) continue;
            return ChessPieces[i];
        }
        throw new ArgumentException("Byte must contain a piece value.");
    }

    public static explicit operator byte(Piece? value)
    {
        return value == null ? (byte)0 : value.Value;
    }

    public static bool operator ==(Piece? left, Piece? right)
    {
        if (left is null)
        {
            return right is null;
        }
        return left.Equals(right);
    }

    public static bool operator !=(Piece? left, Piece? right)
    {
        if (left is null)
        {
            return right is not null;
        }
        return !left.Equals(right);
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Piece piece) return false;
        return piece.Value == Value;
    }

    public override int GetHashCode() => throw new NotImplementedException();
}