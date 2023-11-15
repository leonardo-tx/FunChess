import Piece from "./Piece";
import "./constants/board-constants";
import Team from "./enums/Team";

class Cell {
    private static readonly CellsVariations = new Map<number, Cell>();

    public static readonly Empty = new Cell(null, null);

    static {
        for (let i = 1; i <= 2; i++) {
            for (let j = 4; j <= 128; j <<= 1) {
                Cell.CellsVariations.set(j + i, new Cell(Piece.parse(j), i));
            }
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