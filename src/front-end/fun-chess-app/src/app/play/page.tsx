"use client"

import useAuth from "@/data/auth/hooks/useAuth";
import Board from "@/core/chess/Board";
import styled from "@emotion/styled";
import { redirect } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import OnlineChessBoard from "./components/OnlineChessBoard";
import LocalChessBoard from "./components/LocalChessBoard";
import MatchBox from "./components/MatchBox";
import { atMatch } from "@/data/chess/fetchers/match-fetchers";
import Team from "@/core/chess/enums/Team";
import PlayerBanner from "./components/PlayerBanner";
import Match from "@/core/chess/Match";

export default function Play(): JSX.Element {
    const { authenticated } = useAuth();
    const [board, setBoard] = useState(new Board());
    const [matchInfo, setMatchInfo] = useState<Match | null>(null);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [onQueue, setOnQueue] = useState(false);
    const [team, setTeam] = useState(Team.White);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        if (!authenticated) { redirect("/login"); return; }

        return () => { connection !== null && connection.stop(); }
    }, [authenticated, connection]);

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        atMatch().then(apiResponse => {
            const onMatch = apiResponse.result ?? false;
            connection.on("End", (code: number) => console.log(code));
            if (onMatch) {
                connection.start();
                connection.on("Match", (match: Match, boardText: string, team: Team) => {
                    const buffer = Buffer.from(boardText, "base64");
                    const board = Board.Parse(buffer);
        
                    setBoard(board);
                    setMatchInfo(match);
                    setTeam(team);
                    setPageLoaded(true);

                    connection.off("Match");
                });
                return;
            }
            connection.on("MatchStart", (match: Match, team: Team) => {
                setBoard(new Board());
                setMatchInfo(match);
                setOnQueue(false);
                setTeam(team);
                connection.off("MatchStart");
            });
            setPageLoaded(true);
        });
    }, [])

    const connectToQueue = (): void => {
        if (connection === null || matchInfo !== null) return;
        if (connection.state === HubConnectionState.Connected) {
            connection!.invoke("Enqueue").then(enqueued => enqueued && setOnQueue(true));
            return;
        }

        connection.start().then(() => {
            if (connection.state !== HubConnectionState.Connected) return;
            connection!.invoke("Enqueue").then(enqueued => enqueued && setOnQueue(true));
        });
    }

    return pageLoaded ? (
        <Container>
            <MatchBoardContainer>
                <PlayerBanner 
                    matchInfo={matchInfo}
                    updateTime={team === Team.White ? board.turn === Team.Black : board.turn === Team.White}
                    team={team === Team.White ? Team.Black : Team.White} 
                />
                {matchInfo !== null && connection !== null 
                    ? <OnlineChessBoard updateMatchInfo={setMatchInfo} team={team} connection={connection} board={board} /> 
                    : <LocalChessBoard board={board} />
                }
                <PlayerBanner 
                    matchInfo={matchInfo}
                    updateTime={team === Team.White ? board.turn === Team.White : board.turn === Team.Black}
                    team={team}
                    isCurrentAccount={true}
                />
            </MatchBoardContainer>
            {matchInfo !== null || <MatchBox onQueue={onQueue} connectToQueue={connectToQueue} />}
        </Container>
    ) : <></>;
}

function getHubConnection(): HubConnection {
    return new HubConnectionBuilder()
        .withUrl(`ws://${process.env.apiUrl}/Hub/Queue`, { 
            withCredentials: true, 
            skipNegotiation: true, 
            transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
}

const Container = styled.div`
    display: flex;
    padding: 0px 3%;
    gap: 4em;

    @media only screen and (max-width: 1024px) {
        flex-direction: column-reverse;
        padding: 2px 5px;
        align-items: center;
    }
`;

const MatchBoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: clamp(0px, min(100%, 85vh), 790px);
`;