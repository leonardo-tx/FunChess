import Move from "./structs/Move";
import Board from "./Board";
import Cell from "./Cell";
import SpecialMove from "./enums/SpecialMove";
import Pawn from "./pieces/Pawn";
import Bishop from "./pieces/Bishop";
import Rook from "./pieces/Rook";

abstract class Piece {
    private static readonly ChessPieces = new Map<number, Piece>();

    private _value: number;

    public constructor(value: number) {
        Piece.ChessPieces.set(value, this);
        this._value = value;
    }

    public move(board: Board, move: Move): [boolean, SpecialMove] {
        const tuple = this.moveIsValid(board, move)
        if (tuple[0]) {
            board.internalBoard[move.next.index] = board.internalBoard[move.previous.index];
            board.internalBoard[move.previous.index] = Cell.Empty;
        }
        return tuple;
    }

    public abstract moveIsValid(board: Board, move: Move): [boolean, SpecialMove]

    public static toByte(piece: Piece | null): number {
        return piece === null ? 0 : piece._value;
    }

    public static parse(value: number): Piece {
        for (let i = 4; i <= 128; i <<= 1) {
            if ((i & value) === 0) continue;
            return Piece.ChessPieces.get(i)!;
        }
        throw new Error("Byte must contain a piece value.");
    }
}

export default Piece;