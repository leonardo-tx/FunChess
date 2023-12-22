import Cell from "./Cell";
import DetailedTeam from "./DetailedTeam";
import { BOARD_TOTAL_SIZE, getInitialBoard } from "./constants/board-constants";
import CastlingPlay from "./enums/CastlingPlay";
import MovementResult from "./enums/MovementResult";
import SpecialMove from "./enums/SpecialMove";
import Team from "./enums/Team";
import King from "./pieces/King";
import Move from "./structs/Move";
import Position from "./structs/Position";

export default class Board {
    public constructor(board?: Cell[], teams?: Map<Team, DetailedTeam>, team?: Team) {
        if (board === undefined || teams === undefined || team === undefined) {
            this.internalBoard = getInitialBoard();
            this.teams = new Map<Team, DetailedTeam>();
            this.teams.set(Team.White, new DetailedTeam(undefined, undefined, Team.White));
            this.teams.set(Team.Black, new DetailedTeam(undefined, undefined, Team.Black));
            
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

    public movePiece(move: Move): MovementResult {
        const movementResult = this.pieceCanMove(move);
        if (movementResult === MovementResult.None || movementResult === MovementResult.Illegal) return movementResult;

        this.internalBoard[move.previous.index].piece!.move(this, move);
        this.changeTurn();
        
        if (this.kingInDanger()) return MovementResult.Check;
        return movementResult;
    }

    public pieceCanMove(move: Move): MovementResult {
        const selectedCell = this.internalBoard[move.previous.index];
        if (selectedCell.isEmpty() || move.previous.index == move.next.index || !selectedCell.isFromTeam(this._turn)) return MovementResult.None;

        const targetCell = this.internalBoard[move.next.index];
        if (!targetCell.isEmpty() && targetCell.isFromTeam(this._turn)) {
            if (this.kingInDanger()) return MovementResult.Illegal;
            return MovementResult.None;
        }
        
        const moveIsValidTuple = selectedCell.piece!.moveIsValid(this, move);
        if (!moveIsValidTuple[0]) {
            if (this.kingInDanger()) return MovementResult.Illegal;
            return MovementResult.None;
        }

        const kingAlreadyInDanger = this.kingInDanger();

        this.internalBoard[move.next.index] = selectedCell;
        this.internalBoard[move.previous.index] = Cell.Empty;

        const isKing = selectedCell.piece === King.instance;
        if (isKing) {
            this.teams.get(this._turn)!.kingPosition = move.next;
        }
        const kingInDanger = this.kingInDanger();
        if (isKing) {
            this.teams.get(this._turn)!.kingPosition = move.previous;
        }
        
        this.internalBoard[move.next.index] = targetCell;
        this.internalBoard[move.previous.index] = selectedCell;
        
        if (kingInDanger) return kingAlreadyInDanger ? MovementResult.Illegal : MovementResult.None;
        if (moveIsValidTuple[1] === SpecialMove.LeftCastling || moveIsValidTuple[1] === SpecialMove.RightCastling) return MovementResult.Castle;
        if (targetCell.isEmpty()) return MovementResult.Move;

        return MovementResult.Capture;
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
        const kingPosition: Position | null = this.teams.get(this._turn)!.kingPosition;
        if (kingPosition !== null) return kingPosition;

        const kingCell = Cell.get(King.instance, this._turn)
        for (let i = 0; i < BOARD_TOTAL_SIZE; i++) {
            if (this.internalBoard[i] === kingCell) return new Position(i);
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