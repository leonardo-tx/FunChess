import Piece from "../Piece";
import Board from "../Board";
import SpecialMove from "../enums/SpecialMove";
import Move from "../structs/Move";
import { checkEast, checkNorth, checkNortheast, checkNorthwest, checkSouth, checkSoutheast, checkSouthwest, checkWest } from "../utils/cells-utils";

class Queen extends Piece {
    private constructor() {
        super(8);
    }

    public static readonly instance: Piece = new Queen();

    public override moveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        const specialMove = SpecialMove.None;
        if (move.diffX === move.diffY) {
            if (Math.abs(move.diffX) <= 1) {
                return [true, specialMove];
            }
            return [move.diffX < 0 ? checkSouthwest(board.internalBoard, move) : checkNortheast(board.internalBoard, move), specialMove];
        }
        if (move.diffX + move.diffY === 0) {
            if (Math.abs(move.diffX) <= 1) {
                return [true, specialMove];
            }
            return [move.diffX < 0 ? checkNorthwest(board.internalBoard, move) : checkSoutheast(board.internalBoard, move), specialMove];
        }
        if (move.diffX === 0) {
            if (Math.abs(move.diffY) <= 1) {
                return [true, specialMove];
            }
            return [move.diffY < 0 ? checkSouth(board.internalBoard, move) : checkNorth(board.internalBoard, move), specialMove];
        }
        if (move.diffY !== 0) return [false, specialMove];
        if (Math.abs(move.diffX) <= 1) return [true, specialMove];
        
        return [move.diffX < 0 ? checkWest(board.internalBoard, move) : checkEast(board.internalBoard, move), specialMove];
    }
}

export default Queen;