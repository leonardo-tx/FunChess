import { BOARD_LENGTH, BOARD_TOTAL_SIZE, MAX_INDEX, MIN_INDEX } from "../constants/board-constants";

export default class Position {
    public constructor(y: number, x?: number) {
        if (x === undefined) {
            const index = y;
            if (index >= BOARD_TOTAL_SIZE || index < MIN_INDEX) throw new Error("The index is out of the border.");

            this.x = index % BOARD_LENGTH;
            this.y = Math.floor(index / BOARD_LENGTH);
            this.index = index;
            
            return;
        }
        if (y > MAX_INDEX || y < MIN_INDEX) throw new Error("The y is out of the border.");
        if (x > MAX_INDEX || x < MIN_INDEX) throw new Error("The x is out of the border.");

        this.x = x;
        this.y = y;
        this.index = y * BOARD_LENGTH + x;
    }

    public readonly x: number

    public readonly y: number

    public readonly index: number
}