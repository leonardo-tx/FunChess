import Position from "./Position";

export default class Move {
    public constructor(previous: Position, next: Position) {
        this.previous = previous;
        this.next = next;
        this.diffX = next.x - previous.x;
        this.diffY = next.y - previous.y;
    }

    public readonly previous: Position;

    public readonly next: Position;

    public readonly diffX: number;

    public readonly diffY: number;

    public toString(): string {
        return `${this.previous.index}|${this.next.index}`;
    }

    public static parse(text: string): Move {
        const indexes = text.split('|');
        if (indexes.length !== 2) throw Error("Text is not a valid move.");

        const previous = new Position(parseInt(indexes[0]));
        const next = new Position(parseInt(indexes[1]));

        return new Move(previous, next);
    }
}