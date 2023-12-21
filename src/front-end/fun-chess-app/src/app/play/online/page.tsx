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
import OnlineOnMatchContainer from "./components/OnlineOnMatchContainer";
import EndModal from "./components/EndModal";
import { useDisclosure } from "@chakra-ui/react";
import Account from "@/core/auth/models/Account";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import useAuth from "@/data/auth/hooks/useAuth";

export default function PlayOnline(): JSX.Element {
    const [board, setBoard] = useState(new Board());
    const [matchInfo, setMatchInfo] = useState<Match | null>(null);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [onQueue, setOnQueue] = useState(false);
    const [team, setTeam] = useState(Team.White);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [opponentAccount, setOpponentAccount] = useState<Account | null>(null)
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { currentAccount } = useAuth();

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        connection.on("End", (match: Match) => {
            setMatchInfo(match);
            onOpen();
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
                    getSimpleAccount(match.players[team % 2].accountId).then(response => setOpponentAccount(response.result ?? null))
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
                getSimpleAccount(match.players[team % 2].accountId).then(response => setOpponentAccount(response.result ?? null))
            });
            setPageLoaded(true);
        });
        return () => { connection.stop(); }
    }, [onOpen]);

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
                        account={opponentAccount}
                        matchInfo={matchInfo}
                        updateTime={matchInfo?.matchState === MatchState.Running && (team === Team.White ? board.turn === Team.Black : board.turn === Team.White)}
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
                        updateTime={matchInfo?.matchState === MatchState.Running && (team === Team.White ? board.turn === Team.White : board.turn === Team.Black)}
                        team={team}
                        account={currentAccount}
                    />
                </MatchBoardContainer>
                {matchInfo !== null ? <OnlineOnMatchContainer onSurrender={() => connection?.invoke("Surrender")} /> : <OnlineMatchSelection onQueue={onQueue} connectToQueue={connectToQueue} />}
            </Container>
            {matchInfo !== null && opponentAccount !== null && <EndModal onClose={onClose} isOpen={isOpen} matchInfo={matchInfo} team={team} opponentAccount={opponentAccount} />}
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