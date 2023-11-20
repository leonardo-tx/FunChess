import Piece from "../Piece";
import Board from "../Board";
import CastlingPlay from "../enums/CastlingPlay";
import SpecialMove from "../enums/SpecialMove";
import Move from "../structs/Move";
import { checkEast, checkNorth, checkSouth, checkWest } from "../utils/cells-utils";

class Rook extends Piece {
    private constructor() {
        super(16);
    }

    public static readonly instance: Piece = new Rook();

    public override move(board: Board, move: Move): [boolean, SpecialMove] {
        const tuple = super.move(board, move);
        if (!tuple[0]) return tuple;
        
        let plays = board.teams.get(board.turn)!.castlingPlays;
        if ((plays & CastlingPlay.LeftCastling) === CastlingPlay.LeftCastling && move.previous.index === 0 || move.previous.index === 56) {
            plays &= ~CastlingPlay.LeftCastling;
            board.teams.get(board.turn)!.castlingPlays = plays;
        }
        else if ((plays & CastlingPlay.RightCastling) === CastlingPlay.RightCastling && move.previous.index === 7 || move.previous.index === 63) {
            plays &= ~CastlingPlay.RightCastling;
            board.teams.get(board.turn)!.castlingPlays = plays;
        }
        return tuple;
    }

    public override moveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        const specialMove = SpecialMove.None;
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

export default Rook;