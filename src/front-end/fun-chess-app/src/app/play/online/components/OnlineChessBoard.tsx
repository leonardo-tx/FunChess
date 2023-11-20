import Board from "@/core/chess/Board";
import Move from "@/core/chess/structs/Move";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import Team from "@/core/chess/enums/Team";
import { getInitialBoard } from "@/core/chess/constants/board-constants";
import Match from "@/core/chess/Match";
import { HubConnection } from "@microsoft/signalr";

interface Props {
    board: Board;
    connection: HubConnection | null;
    team: Team;
    onMatch: boolean;
    updateMatchInfo: Dispatch<SetStateAction<Match | null>>
}

export default function OnlineChessBoard({ board, connection, team, onMatch, updateMatchInfo }: Props): JSX.Element {
    const [cells, setCells] = useState(getInitialBoard());

    useEffect(() => {
        setCells([...board.internalBoard]);
        if (connection === null) return;

        connection.on("BoardUpdate", (match: Match, moveText: string) => {
            const move = Move.parse(moveText);
            if (board.movePiece(move)) setCells([...board.internalBoard]);

            updateMatchInfo(match);
        })
        return () => { connection.off("BoardUpdate"); }
    }, [connection, board, updateMatchInfo])

    const onMove = (move: Move): boolean => {
        if (connection === null || team !== board.turn) return false;
        const canMove = board.pieceCanMove(move);

        if (canMove) connection.invoke("Move", move.toString());
        return canMove;
    };

    return (
        <ChessBoard 
            onMove={onMove} 
            disable={!onMatch} 
            board={cells}
            inverse={team === Team.Black} 
        />
    )
}