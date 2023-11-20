import Piece from "../Piece";
import Board from "../Board";
import SpecialMove from "../enums/SpecialMove";
import Move from "../structs/Move";

class Knight extends Piece {
    private constructor() {
        super(32);
    }

    public static readonly instance: Piece = new Knight();

    public override moveIsValid(_board: Board, move: Move): [boolean, SpecialMove] {
        const specialMove = SpecialMove.None;
        if (move.diffX === 1 || move.diffX === -1) {
            return [move.diffY === 2 || move.diffY === -2, specialMove];
        }
        if (move.diffY === 1 || move.diffY === -1) {
            return [move.diffX === 2 || move.diffX === -2, specialMove];
        }
        return [false, specialMove];
    }
}

export default Knight;