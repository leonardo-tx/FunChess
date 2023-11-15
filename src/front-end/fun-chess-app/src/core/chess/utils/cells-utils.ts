import Cell from "../Cell";
import Move from "../structs/Move";
import Position from "../structs/Position";

export function checkNorth(board: Cell[], move: Move) {
    for (let y = move.previous.y + 1; y < move.next.y; y++) {
        const currentPosition = new Position(y, move.previous.x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkSouth(board: Cell[], move: Move) {
    for (let y = move.previous.y - 1; y > move.next.y; y--) {
        const currentPosition = new Position(y, move.previous.x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkEast(board: Cell[], move: Move) {
    for (let x = move.previous.x + 1; x < move.next.x; x++) {
        const currentPosition = new Position(move.previous.y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkWest(board: Cell[], move: Move) {
    for (let x = move.previous.x - 1; x > move.next.x; x--) {
        const currentPosition = new Position(move.previous.y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkNortheast(board: Cell[], move: Move) {
    for (let y = move.previous.y + 1, x = move.previous.x + 1; y < move.next.y; y++, x++) {
        const currentPosition = new Position(y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkNorthwest(board: Cell[], move: Move) {
    for (let y = move.previous.y + 1, x = move.previous.x - 1; y < move.next.y; y++, x--) {
        const currentPosition = new Position(y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}

export function checkSoutheast(board: Cell[], move: Move) {
    for (let y = move.previous.y - 1, x = move.previous.x + 1; y > move.next.y; y--, x++) {
        const currentPosition = new Position(y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}
    
export function checkSouthwest(board: Cell[], move: Move) {
    for (let y = move.previous.y - 1, x = move.previous.x - 1; y > move.next.y; y--, x--) {
        const currentPosition = new Position(y, x);
        if (!board[currentPosition.index].isEmpty()) return false;
    }
    return true;
}