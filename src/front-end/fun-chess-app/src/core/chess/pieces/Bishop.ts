import Piece from "../Piece";
import Board from "../Board";
import SpecialMove from "../enums/SpecialMove";
import Move from "../structs/Move";
import { checkNortheast, checkNorthwest, checkSoutheast, checkSouthwest } from "../utils/cells-utils";

class Bishop extends Piece {
    private constructor() {
        super(64);
    }

    public static readonly instance: Piece = new Bishop();

    public override moveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        const specialMove = SpecialMove.None;
        if (move.diffX === move.diffY) {
            if (Math.abs(move.diffX) <= 1) {
                return [true, specialMove];
            }
            return [move.diffX < 0 ? checkSouthwest(board.internalBoard, move) : checkNortheast(board.internalBoard, move), specialMove];
        }
        if (move.diffX + move.diffY !== 0) return [false, specialMove];
        if (Math.abs(move.diffX) <= 1) {
            return [true, specialMove];
        }
        return [move.diffX < 0 ? checkNorthwest(board.internalBoard, move) : checkSoutheast(board.internalBoard, move), specialMove];
    }
}

export default Bishop;