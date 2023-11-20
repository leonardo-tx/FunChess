import { getInitialBoard } from "@/core/chess/constants/board-constants";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { JSX } from "react";

export default function DummyChessBoard(): JSX.Element {

    return (
        <ChessBoard disable={true} onMove={() => false} board={getInitialBoard()} />
    );
}