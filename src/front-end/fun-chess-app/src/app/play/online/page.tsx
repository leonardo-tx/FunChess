"use client";

import Board from "@/core/chess/Board";
import Match from "@/core/chess/Match";
import Team from "@/core/chess/enums/Team";
import { atMatch } from "@/data/chess/fetchers/match-fetchers";
import styled from "@emotion/styled";
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { JSX, useEffect, useState } from "react";
import PlayerBanner from "../components/PlayerBanner";
import OnlineChessBoard from "./components/OnlineChessBoard";
import OnlineMatchSelection from "./components/OnlineMatchSelection";
import MatchState from "@/core/chess/enums/MatchState";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";

export default function PlayOnline(): JSX.Element {
    const [board, setBoard] = useState(new Board());
    const [matchInfo, setMatchInfo] = useState<Match | null>(null);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [onQueue, setOnQueue] = useState(false);
    const [team, setTeam] = useState(Team.White);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [matchState, setMatchState] = useState(MatchState.Running);

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        connection.on("End", (state: MatchState) => {
            setMatchState(state);
        });

        atMatch().then(apiResponse => {
            const onMatch = apiResponse.result ?? false;
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
                setMatchState(match.matchState);
                setTeam(team);
            });
            setPageLoaded(true);
        });
        return () => { connection.stop(); }
    }, []);

    if (!pageLoaded) return <></>;

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
    };

    return (
        <AuthorizeProvider>
            <Container $onMatch={matchInfo !== null}>
                <MatchBoardContainer>
                    <PlayerBanner 
                        matchInfo={matchInfo}
                        updateTime={matchState === MatchState.Running && (team === Team.White ? board.turn === Team.Black : board.turn === Team.White)}
                        team={team === Team.White ? Team.Black : Team.White} 
                    />
                    <OnlineChessBoard 
                        onMatch={matchInfo !== null} 
                        updateMatchInfo={setMatchInfo} 
                        team={team} 
                        connection={connection} 
                        board={board} 
                    /> 
                    <PlayerBanner 
                        matchInfo={matchInfo}
                        updateTime={matchState === MatchState.Running && (team === Team.White ? board.turn === Team.White : board.turn === Team.Black)}
                        team={team}
                        isCurrentAccount={true}
                    />
                </MatchBoardContainer>
                {matchInfo !== null || <OnlineMatchSelection onQueue={onQueue} connectToQueue={connectToQueue} />}
            </Container>
        </AuthorizeProvider>
    );
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

const Container = styled("div", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $onMatch: boolean
}>`
    display: flex;
    padding: 0px 3%;
    gap: 4em;
    height: 100%;
    align-items: center;

    @media only screen and (max-width: 1024px) {
        flex-direction: ${props => props.$onMatch ? "column" : "column-reverse"};
        padding: 2px 5px;
    }
`;

const MatchBoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: clamp(0px, min(100%, 85vh), 790px);
`;