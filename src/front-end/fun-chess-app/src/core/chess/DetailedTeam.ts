import CastlingPlay from "./enums/CastlingPlay";
import Team from "./enums/Team";
import Position from "./structs/Position";

export default class DetailedTeam {
    public constructor(castlingPlays?: CastlingPlay, exposedEnPassant?: Position | null) {
        if (castlingPlays !== undefined && exposedEnPassant !== undefined) {
            this.castlingPlays = castlingPlays;
            this.exposedEnPassant = exposedEnPassant;
        }
    }

    public castlingPlays = CastlingPlay.All;

    public exposedEnPassant: Position | null = null;
}