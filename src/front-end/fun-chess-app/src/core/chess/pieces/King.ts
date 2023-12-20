import Piece from "../Piece";
import Board from "../Board";
import Cell from "../Cell";
import CastlingPlay from "../enums/CastlingPlay";
import SpecialMove from "../enums/SpecialMove";
import Team from "../enums/Team";
import Move from "../structs/Move";
import Position from "../structs/Position";
import { checkEast, checkWest } from "../utils/cells-utils";
import Rook from "./Rook";

const MOVE_LENGTH = 1;

class King extends Piece {
    private constructor() {
        super(4);
    }

    public static readonly instance: Piece = new King();

    public override move(board: Board, move: Move): [boolean, SpecialMove] {
        const tuple = super.move(board, move);
        if (!tuple[0]) return tuple;
        
        board.teams.get(board.turn)!.castlingPlays = CastlingPlay.None;
        board.teams.get(board.turn)!.kingPosition = move.next;
        
        switch (tuple[1]) {
            case SpecialMove.LeftCastling:
                switch (board.turn) {
                    case Team.White:
                        board.internalBoard[3] = board.internalBoard[0];
                        board.internalBoard[0] = Cell.Empty;
                        break;
                    case Team.Black:
                        board.internalBoard[59] = board.internalBoard[56];
                        board.internalBoard[56] = Cell.Empty;
                        break;
                }
                return tuple;
            case SpecialMove.RightCastling:
                switch (board.turn) {
                    case Team.White:
                        board.internalBoard[5] = board.internalBoard[7];
                        board.internalBoard[7] = Cell.Empty;
                        break;
                    case Team.Black:
                        board.internalBoard[61] = board.internalBoard[63];
                        board.internalBoard[63] = Cell.Empty;
                        break;
                }
                return tuple;
            default:
                return tuple;
        }
    }

    public override moveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        let specialMove = SpecialMove.None;
        const moveIsValid = move.diffX >= -MOVE_LENGTH && move.diffX <= MOVE_LENGTH && move.diffY >= -MOVE_LENGTH && move.diffY <= MOVE_LENGTH;
        const possiblePlays = board.teams.get(board.turn)!.castlingPlays;
        
        if (moveIsValid || possiblePlays === CastlingPlay.None || move.diffY !== 0 || board.kingInDanger()) return [moveIsValid, specialMove];
        
        let previous: Position, next: Position;
        switch (move.diffX) {
            case 2:
                specialMove = SpecialMove.RightCastling;
                if ((possiblePlays & CastlingPlay.RightCastling) === CastlingPlay.None) return [false, specialMove];
                if (!checkEast(board.internalBoard, move)) return [false, specialMove];

                previous = new Position(board.turn === Team.White ? 7 : 63);
                next = new Position(board.turn === Team.White ? 5 : 61);
                return [Rook.instance.moveIsValid(board, new Move(previous, next))[0], specialMove];
            case -2:
                specialMove = SpecialMove.LeftCastling;
                if ((possiblePlays & CastlingPlay.LeftCastling) === CastlingPlay.None) return [false, specialMove];
                if (!checkWest(board.internalBoard, move)) return [false, specialMove];

                previous = new Position(board.turn === Team.White ? 0 : 56);
                next = new Position(board.turn === Team.White ? 3 : 59);
                return [Rook.instance.moveIsValid(board, new Move(previous, next))[0], specialMove];
        }
        return [false, specialMove];
    }
}

export default King;