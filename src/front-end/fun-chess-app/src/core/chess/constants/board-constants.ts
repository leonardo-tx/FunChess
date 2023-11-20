import Cell from "../Cell";
import Team from "../enums/Team";
import Bishop from "../pieces/Bishop";
import King from "../pieces/King";
import Knight from "../pieces/Knight";
import Pawn from "../pieces/Pawn";
import Queen from "../pieces/Queen";
import Rook from "../pieces/Rook";

export const BOARD_LENGTH = 8;

export const BOARD_TOTAL_SIZE = BOARD_LENGTH * BOARD_LENGTH;

export const MAX_INDEX = BOARD_LENGTH - 1;

export const MIN_INDEX = 0;

export function getInitialBoard(): Cell[] {
    return [
        Cell.get(Rook.instance, Team.White), Cell.get(Knight.instance, Team.White), Cell.get(Bishop.instance, Team.White), Cell.get(Queen.instance, Team.White),
        Cell.get(King.instance, Team.White), Cell.get(Bishop.instance, Team.White), Cell.get(Knight.instance, Team.White), Cell.get(Rook.instance, Team.White),
        Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White),
        Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White), Cell.get(Pawn.instance, Team.White),
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black),
        Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black), Cell.get(Pawn.instance, Team.Black),
        Cell.get(Rook.instance, Team.Black), Cell.get(Knight.instance, Team.Black), Cell.get(Bishop.instance, Team.Black), Cell.get(Queen.instance, Team.Black),
        Cell.get(King.instance, Team.Black), Cell.get(Bishop.instance, Team.Black), Cell.get(Knight.instance, Team.Black), Cell.get(Rook.instance, Team.Black)
    ];
}