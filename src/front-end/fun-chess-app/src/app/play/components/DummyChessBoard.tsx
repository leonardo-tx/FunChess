import Board from "@/core/chess/Board";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { JSX } from "react";

export default function DummyChessBoard(): JSX.Element {

    return (
        <ChessBoard disable={true} onMove={() => false} board={new Board()} />
    );
}