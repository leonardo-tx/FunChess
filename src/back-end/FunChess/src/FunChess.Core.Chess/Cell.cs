using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices;
using FunChess.Core.Chess.Enums;

namespace FunChess.Core.Chess;

public sealed class Cell
{
    private static readonly Dictionary<byte, Cell> CellsVariations = new();
    
    static Cell()
    {
        CellsVariations.Add(0, new Cell(null, null));
        for (int i = 1; i <= 2; i++)
        {
            for (int j = 4; j <= 128; j <<= 1)
            {
                CellsVariations.Add((byte)(j + i), new Cell((Piece)j, (Team)i));
            }
        }
        Empty = CellsVariations[0];
    }
    
    private Cell(Piece? piece, Team? team)
    {
        Piece = piece;
        Team = team;
    }
    
    public Piece? Piece { get; private init; }
    
    public Team? Team { get; private init; }
    
    [MemberNotNullWhen(true, nameof(Piece), nameof(Team))]
    public bool IsFromTeam(Team team)
    {
        return Team == team;
    }
    
    [MemberNotNullWhen(false, nameof(Piece), nameof(Team))]
    public bool IsEmpty()
    {
        return this == Empty;
    }

    public static explicit operator byte(Cell cell)
    {
        if (cell.IsEmpty()) return 0;
        return (byte)(cell.Team + (byte)cell.Piece);
    }

    public static explicit operator Cell(byte value)
    {
        if (value == 0) return Empty;

        var piece = (Piece)value;
        var team = (Team)(value - (byte)piece);
        
        return Get(piece, team);
    }

    public static readonly Cell Empty;

    public static Cell Get(Piece piece, Team team)
    {
        byte value = (byte)((byte)piece + team);
        _ = CellsVariations.TryGetValue(value, out Cell? cell);

        return cell!;
    }
}