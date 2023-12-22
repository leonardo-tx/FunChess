import Board from "@/core/chess/Board";
import MovementResult from "@/core/chess/enums/MovementResult";
import Move from "@/core/chess/structs/Move";
import { playAudio } from "@/data/sounds/audio-player";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { JSX } from "react";

interface Props {
    board: Board
}

export default function LocalChessBoard({ board }: Props): JSX.Element {
    const onMove = (move: Move): boolean => {
        const movementResult = board.movePiece(move);
        const moveIsValid = movementResult !== MovementResult.None && movementResult !== MovementResult.Illegal;
        if (moveIsValid || movementResult === MovementResult.Illegal) playAudio(movementResult);

        return moveIsValid
    };

    return (
        <ChessBoard onMove={onMove} board={board} />
    )
}