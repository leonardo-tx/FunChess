import CastlingPlay from "./enums/CastlingPlay";
import Team from "./enums/Team";
import Position from "./structs/Position";

export default class DetailedTeam {
    public constructor(castlingPlays?: CastlingPlay, exposedEnPassant?: Position | null, team?: Team) {
        if (castlingPlays !== undefined && exposedEnPassant !== undefined) {
            this.castlingPlays = castlingPlays;
            this.exposedEnPassant = exposedEnPassant;

            return;
        }
        if (team !== undefined) {
            this.kingPosition = team === Team.White ? new Position(0, 4) : new Position(7, 4);
        }
    }

    public castlingPlays = CastlingPlay.All;

    public exposedEnPassant: Position | null = null;

    public kingPosition: Position | null = null;
}