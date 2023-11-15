import Cell from "../Cell";
import type Piece from "../Piece";
import King from "../pieces/King";
import Bishop from "../pieces/Bishop";
import Team from "../enums/Team";
import Knight from "../pieces/Knight";
import Pawn from "../pieces/Pawn";
import Queen from "../pieces/Queen";
import Rook from "../pieces/Rook";

export const BOARD_LENGTH = 8;

export const BOARD_TOTAL_SIZE = BOARD_LENGTH * BOARD_LENGTH;

export const MAX_INDEX = BOARD_LENGTH - 1;

export const MIN_INDEX = 0;

export const KingPiece: Piece = new King();
export const QueenPiece: Piece = new Queen();
export const RookPiece: Piece = new Rook();
export const KnightPiece: Piece = new Knight();
export const BishopPiece: Piece = new Bishop();
export const PawnPiece: Piece = new Pawn();

export function getInitialBoard(): Cell[] {
    return [
        Cell.get(RookPiece, Team.White), Cell.get(KnightPiece, Team.White), Cell.get(BishopPiece, Team.White), Cell.get(QueenPiece, Team.White),
        Cell.get(KingPiece, Team.White), Cell.get(BishopPiece, Team.White), Cell.get(KnightPiece, Team.White), Cell.get(RookPiece, Team.White),
        Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White),
        Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White), Cell.get(PawnPiece, Team.White),
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.Empty, Cell.Empty, Cell.Empty, Cell.Empty,
        Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black),
        Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black), Cell.get(PawnPiece, Team.Black),
        Cell.get(RookPiece, Team.Black), Cell.get(KnightPiece, Team.Black), Cell.get(BishopPiece, Team.Black), Cell.get(QueenPiece, Team.Black),
        Cell.get(KingPiece, Team.Black), Cell.get(BishopPiece, Team.Black), Cell.get(KnightPiece, Team.Black), Cell.get(RookPiece, Team.Black)
    ];
}