import Piece from "./Piece";
import Team from "./enums/Team";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

class Cell {
    private static readonly CellsVariations = new Map<number, Cell>();

    public static readonly Empty = new Cell(null, null);

    static {
        for (let i = 1; i <= 2; i++) {
            Cell.CellsVariations.set(i + 4, new Cell(King.instance, i));
            Cell.CellsVariations.set(i + 8, new Cell(Queen.instance, i));
            Cell.CellsVariations.set(i + 16, new Cell(Rook.instance, i));
            Cell.CellsVariations.set(i + 32, new Cell(Knight.instance, i));
            Cell.CellsVariations.set(i + 64, new Cell(Bishop.instance, i));
            Cell.CellsVariations.set(i + 128, new Cell(Pawn.instance, i));
        }
    }

    private constructor(piece: Piece | null, team: Team | null) {
        this.piece = piece;
        this.team = team;
    }

    public readonly piece: Piece | null;

    public readonly team: Team | null;

    public isFromTeam(team: Team): boolean {
        return this.team === team
    }

    public isEmpty(): boolean {
        return this === Cell.Empty;
    }

    public toByte(): number {
        if (this.isEmpty()) return 0;
        return Piece.toByte(this.piece) + this.team!;
    }

    public static parse(value: number): Cell {
        if (value === 0) return this.Empty;

        const piece = Piece.parse(value);
        const team: Team = value - Piece.toByte(piece);

        return Cell.get(piece, team);
    }

    public static get(piece: Piece, team: Team): Cell {
        const value = Piece.toByte(piece) + team;
        return Cell.CellsVariations.get(value)!;
    }
}

export default Cell;