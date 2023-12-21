import Account from "@/core/auth/models/Account";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import Match from "@/core/chess/Match";
import Team from "@/core/chess/enums/Team";
import { BiTimer } from "react-icons/bi";
import Link from "next/link";
import useLang from "@/data/settings/hooks/useLang";

interface Props {
    matchInfo: Match | null;
    updateTime: boolean;
    team: Team
    account: Account | null;
}

export default function PlayerBanner({ matchInfo, updateTime, team, account }: Props): JSX.Element {
    const [lastingSeconds, setLastingSeconds] = useState<number | null>(null);
    const [playerInfo, setPlayerInfo] = useState<{ team: Team, accountId: number, spentSeconds: number } | null>(null)
    const { t } = useLang();

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

    const minutes = Math.floor((lastingSeconds ?? 0) / 60);
    const seconds = Math.floor((lastingSeconds ?? 0) % 60);

    return (
        <Banner>
            <Profile>
                {account !== null &&
                    <ProfileLink href={`/profile?id=${account.id}`} target="_blank">
                        <Image src={defaultIcon} alt={t("alt.icon-profile", account.username)} />
                        <Text>{account.username}</Text>
                    </ProfileLink>
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

const ProfileLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 10px;
`;

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