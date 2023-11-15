import Account from "@/core/auth/models/Account";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import Match from "@/core/chess/Match";
import Team from "@/core/chess/enums/Team";
import useAuth from "@/data/auth/hooks/useAuth";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import { BiTimer } from "react-icons/bi";

interface Props {
    matchInfo: Match | null;
    updateTime: boolean;
    team: Team
    isCurrentAccount?: boolean
}

export default function PlayerBanner({ matchInfo, updateTime, team, isCurrentAccount = false }: Props): JSX.Element {
    const [lastingSeconds, setLastingSeconds] = useState<number | null>(null);
    const [playerInfo, setPlayerInfo] = useState<{ team: Team, accountId: number, spentSeconds: number } | null>(null)
    const [account, setAccount] = useState<Account | null>(null);
    const { currentAccount } = useAuth();

    useEffect(() => {
        if (matchInfo === null) { setLastingSeconds(null); setPlayerInfo(null); return; }
        
        const playerInfo = matchInfo?.players[team - 1];
        setPlayerInfo(playerInfo);

        if (!updateTime) {
            setLastingSeconds(matchInfo.secondsLimit - playerInfo.spentSeconds);
            return;
        }

        const interval = setInterval(() => {
            const currentSpentSeconds = (Date.now() - matchInfo.timeStamp) / 1000;
            const lastingSeconds = matchInfo.secondsLimit - playerInfo.spentSeconds - currentSpentSeconds;
            setLastingSeconds(lastingSeconds < 0 ? 0 : lastingSeconds);
        }, 1000)
        
        return () => clearInterval(interval);
    }, [updateTime, matchInfo, team]);

    useEffect(() => {
        if (isCurrentAccount) {
            setAccount(currentAccount);
            return;
        }
        if (playerInfo === null) {
            setAccount(null);
            return;
        }
        getSimpleAccount(playerInfo.accountId).then(response => setAccount(response.result ?? null))
    }, [isCurrentAccount, currentAccount, playerInfo])

    const minutes = Math.floor((lastingSeconds ?? 0) / 60);
    const seconds = Math.floor((lastingSeconds ?? 0) % 60);

    return (
        <Banner>
            <Profile>
                {account !== null &&
                    <>
                        <Image src={defaultIcon} alt="Ícone de perfil" />
                        <Text>{account.username}</Text>
                    </>
                }
            </Profile>
            {lastingSeconds !== null &&
                <Timer>
                    <Text>{minutes.toLocaleString('pt-BR')} : {seconds.toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}</Text>
                    {updateTime && <BiTimer size={25} />}
                </Timer>
            }
        </Banner>
    );
}

const Banner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px;
`;

const Profile = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 30px;

    & img {
        width: clamp(30px, min(100%, 5vw), 40px);
    }
`

const Timer = styled.div`
    padding: 5px 10px;
    width: 130px;
    max-width: 130px;
    min-width: 130px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff0f;
    border-radius: 5px;
    flex-direction: row-reverse;
`;