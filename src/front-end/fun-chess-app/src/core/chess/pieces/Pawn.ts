import Piece from "../Piece";
import Board from "../Board";
import Cell from "../Cell";
import { MAX_INDEX, MIN_INDEX, QueenPiece } from "../constants/board-constants";
import SpecialMove from "../enums/SpecialMove";
import Team from "../enums/Team";
import Move from "../structs/Move";
import { checkNorth, checkSouth } from "../utils/cells-utils";

const MOVE_LENGTH = 1;
const INITIAL_MOVE_LENGTH = 2;

class Pawn extends Piece {
    public override move(board: Board, move: Move): [boolean, SpecialMove] {
        const tuple = super.move(board, move)
        if (!tuple[0]) return tuple;
        switch (tuple[1]) {
            case SpecialMove.PawnLong:
                board.teams.get(board.turn)!.exposedEnPassant = move.next;
                return tuple;
            case SpecialMove.EnPassant:
                if (board.turn === Team.White) {
                    board.internalBoard[board.teams.get(Team.Black)!.exposedEnPassant!.index] = Cell.Empty;
                    return tuple;
                }
                board.internalBoard[board.teams.get(Team.White)!.exposedEnPassant!.index] = Cell.Empty;
                return tuple;
        }
        if (board.turn === Team.White) {
            if (move.next.y === MAX_INDEX) board.internalBoard[move.next.index] = Cell.get(QueenPiece, Team.White);
            return tuple;
        }
        if (move.next.y === MIN_INDEX) board.internalBoard[move.next.index] = Cell.get(QueenPiece, Team.Black);
        return tuple;
    }

    public override moveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        return board.turn === Team.White 
            ? Pawn.whiteMoveIsValid(board, move) 
            : Pawn.blackMoveIsValid(board, move);
    }

    private static whiteMoveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        let specialMove = SpecialMove.None;
        if (move.previous.y === MIN_INDEX + 1) {
            if (move.diffY === INITIAL_MOVE_LENGTH) {
                specialMove = SpecialMove.PawnLong;
                return [move.diffX === 0 && board.internalBoard[move.next.index].isEmpty() && checkNorth(board.internalBoard, move), specialMove];
            }
        }
        if (move.diffY !== MOVE_LENGTH || move.diffX < -MOVE_LENGTH || move.diffX > MOVE_LENGTH) return [false, specialMove];
        if (move.diffX === 0) return [board.internalBoard[move.next.index].isEmpty(), specialMove];
        if (!board.internalBoard[move.next.index].isEmpty()) return [true, specialMove];

        specialMove = SpecialMove.EnPassant;
        const blackTeam = board.teams.get(Team.Black)!;
        return [blackTeam.exposedEnPassant !== null && blackTeam.exposedEnPassant.index + 8 === move.next.index, specialMove];
    }

    private static blackMoveIsValid(board: Board, move: Move): [boolean, SpecialMove] {
        let specialMove = SpecialMove.None;
        if (move.previous.y === MAX_INDEX - 1) {
            if (move.diffY === -INITIAL_MOVE_LENGTH) {
                specialMove = SpecialMove.PawnLong;
                return [move.diffX == 0 && board.internalBoard[move.next.index].isEmpty() && checkSouth(board.internalBoard, move), specialMove];
            }
        }
        if (move.diffY !== -MOVE_LENGTH || move.diffX < -MOVE_LENGTH || move.diffX > MOVE_LENGTH) return [false, specialMove];
        if (move.diffX === 0) return [board.internalBoard[move.next.index].isEmpty(), specialMove];
        if (!board.internalBoard[move.next.index].isEmpty()) return [true, specialMove];
        
        specialMove = SpecialMove.EnPassant;
        const whiteTeam = board.teams.get(Team.White)!;
        return [whiteTeam.exposedEnPassant !== null && whiteTeam.exposedEnPassant.index - 8 === move.next.index, specialMove];
    }
}

export default Pawn;