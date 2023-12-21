import Board from "@/core/chess/Board";
import Move from "@/core/chess/structs/Move";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { JSX } from "react";

interface Props {
    board: Board
}

export default function LocalChessBoard({ board }: Props): JSX.Element {
    const onMove = (move: Move): boolean => {
        return board.movePiece(move);
    };

    return (
        <ChessBoard onMove={onMove} board={board} />
    )
}