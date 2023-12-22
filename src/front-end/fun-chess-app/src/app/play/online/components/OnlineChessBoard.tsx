import Board from "@/core/chess/Board";
import Move from "@/core/chess/structs/Move";
import ChessBoard from "@/lib/shared/components/ChessBoard";
import { Dispatch, JSX, SetStateAction, useEffect } from "react";
import Team from "@/core/chess/enums/Team";
import Match from "@/core/chess/Match";
import { HubConnection } from "@microsoft/signalr";
import { playAudio } from "@/data/sounds/audio-player";
import MovementResult from "@/core/chess/enums/MovementResult";

interface Props {
    board: Board;
    connection: HubConnection | null;
    team: Team;
    onMatch: boolean;
    updateMatchInfo: Dispatch<SetStateAction<Match | null>>
}

export default function OnlineChessBoard({ board, connection, team, onMatch, updateMatchInfo }: Props): JSX.Element {
    useEffect(() => {
        if (connection === null) return;

        connection.on("BoardUpdate", (match: Match, moveText: string) => {
            const move = Move.parse(moveText);
            const movementResult = board.movePiece(move)
            
            playAudio(movementResult === MovementResult.Move && board.turn === team ? "move-opponent" : movementResult);
            updateMatchInfo(match);
        })
        return () => { connection.off("BoardUpdate"); }
    }, [connection, board, updateMatchInfo, team])

    const onMove = (move: Move): boolean => {
        if (connection === null || team !== board.turn) return false;
        const movementResult = board.pieceCanMove(move);
        const moveIsValid = movementResult !== MovementResult.None && movementResult !== MovementResult.Illegal;

        if (moveIsValid) connection.invoke("Move", move.toString());
        else if (movementResult === MovementResult.Illegal) {
            playAudio(movementResult);
        }
        return movementResult !== MovementResult.None;
    };

    return (
        <ChessBoard 
            onMove={onMove} 
            disable={!onMatch} 
            board={board}
            inverse={team === Team.Black}
        />
    )
}