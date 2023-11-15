import Board from "@/core/chess/Board";
import { getInitialBoard } from "@/core/chess/constants/board-constants";
import Move from "@/core/chess/structs/Move";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { JSX, useEffect, useState } from "react";

interface Props {
    board: Board
}

export default function LocalChessBoard({ board }: Props): JSX.Element {
    const [cells, setCells] = useState(getInitialBoard());

    useEffect(() => {
        setCells([...board.internalBoard]);
    }, [board])

    const onMove = (move: Move): boolean => {
        const moved = board.movePiece(move);
        if (moved) setCells([...board.internalBoard])
        
        return moved;
    };

    return (
        <ChessBoard onMove={onMove} board={cells} />
    )
}