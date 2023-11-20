import Cell from "./Cell";
import DetailedTeam from "./DetailedTeam";
import Piece from "./Piece";
import { BOARD_TOTAL_SIZE, getInitialBoard } from "./constants/board-constants";
import CastlingPlay from "./enums/CastlingPlay";
import Team from "./enums/Team";
import King from "./pieces/King";
import Move from "./structs/Move";
import Position from "./structs/Position";

export default class Board {
    public constructor(board?: Cell[], teams?: Map<Team, DetailedTeam>, team?: Team) {
        if (board === undefined || teams === undefined || team === undefined) {
            this.internalBoard = getInitialBoard();
            this.teams = new Map<Team, DetailedTeam>();
            this.teams.set(Team.White, new DetailedTeam());
            this.teams.set(Team.Black, new DetailedTeam());
            
            return;
        }
        this.internalBoard = board;
        this.teams = teams;
        this._turn = team
    }

    private _turn = Team.White;

    public get turn(): Team {
        return this._turn;
    }

    public get nextTurn(): Team {
        return this._turn % Team.Black + Team.White;
    }

    public readonly internalBoard: Cell[];

    public readonly teams: Map<Team, DetailedTeam>;

    public movePiece(move: Move): boolean {
        if (!this.pieceCanMove(move)) return false;

        this.internalBoard[move.previous.index].piece!.move(this, move);
        this.changeTurn();

        return true;
    }

    public pieceCanMove(move: Move): boolean {
        const selectedCell = this.internalBoard[move.previous.index];
        if (selectedCell.isEmpty() || move.previous.index == move.next.index || !selectedCell.isFromTeam(this._turn)) return false;

        const targetCell = this.internalBoard[move.next.index];
        if (!targetCell.isEmpty() && targetCell.isFromTeam(this._turn)) return false;
        
        if (!selectedCell.piece!.moveIsValid(this, move)[0]) return false;

        this.internalBoard[move.next.index] = selectedCell;
        this.internalBoard[move.previous.index] = Cell.Empty;

        const kingInDanger = this.kingInDanger();
        
        this.internalBoard[move.next.index] = targetCell;
        this.internalBoard[move.previous.index] = selectedCell;
        
        return !kingInDanger;
    }

    public kingInDanger(): boolean {
        const kingPosition = this.getKingPosition();
        const currentTeamExposedEnPassant = this.teams.get(this._turn)!.exposedEnPassant;
        const targetTeamExposedEnPassant = this.teams.get(this.nextTurn)!.exposedEnPassant;
        const targetCastlingPlays = this.teams.get(this.nextTurn)!.castlingPlays;
        for (let i = 0; i < BOARD_TOTAL_SIZE; i++) {
            const currentCell = this.internalBoard[i];
            if (currentCell.isEmpty() || currentCell.isFromTeam(this._turn)) continue;

            const possibleMove = new Move(new Position(i), kingPosition);

            this.changeTurn();
            const moveIsValid = currentCell.piece!.moveIsValid(this, possibleMove)[0];

            this.teams.get(this._turn)!.exposedEnPassant = targetTeamExposedEnPassant;
            this.teams.get(this._turn)!.castlingPlays = targetCastlingPlays;
            this._turn = this.nextTurn;
            this.teams.get(this._turn)!.exposedEnPassant = currentTeamExposedEnPassant;

            if (moveIsValid) return true;
        }
        return false;
    }

    private getKingPosition(): Position {
        for (let i = 0; i < BOARD_TOTAL_SIZE; i++) {
            const currentCell = this.internalBoard[i];
            if (!currentCell.isEmpty() && currentCell.isFromTeam(this._turn) && currentCell.piece === King.instance) return new Position(i);
        }
        throw new Error("Invalid board! Missing king.");
    }

    private changeTurn(): void {
        this._turn = this.nextTurn;
        this.teams.get(this._turn)!.exposedEnPassant = null;
    }

    public static Parse(bytes: Uint8Array): Board {
        const turn: Team = bytes[0];
        const teams = new Map<Team, DetailedTeam>();

        let bytesIndex = 1;
        for (let i = 1; i <= 2; i++) {
            const exposedEnPassant = bytes[bytesIndex + 1] === 255 ? null : new Position(bytes[bytesIndex + 1]);
            const castlingPlays: CastlingPlay = bytes[bytesIndex];

            teams.set(i, new DetailedTeam(castlingPlays, exposedEnPassant));
            bytesIndex += 2;
        }

        const board: Cell[] = [];
        for (let i = 0; bytesIndex < bytes.length; bytesIndex += 2) {
            let repeatCount = bytes[bytesIndex];
            for (let j = 0; j < repeatCount; j++) board[i++] = Cell.parse(bytes[bytesIndex + 1]);
        }
        return new Board(board, teams, turn);
    }
}