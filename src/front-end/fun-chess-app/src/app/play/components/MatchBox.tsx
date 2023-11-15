import { Heading, VStack, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import { FaGamepad, FaUserGroup } from "react-icons/fa6";
import { IoEarth } from "react-icons/io5";

interface Props {
    connectToQueue: () => void;
    onQueue: boolean;
}

export default function MatchBox({ connectToQueue, onQueue }: Props): JSX.Element {
    const [time, setTime] = useState<number | null>(null);

    useEffect(() => {
        if (!onQueue) { setTime(null); return; }

        const initialQueueTime = Date.now();
        const interval = setInterval(() => setTime(Date.now() - initialQueueTime), 1000)

        return () => clearInterval(interval);
    }, [onQueue])

    return (
        <MatchContainer>
                <Heading fontWeight={700} size="lg" as="h2">Jogar Xadrez</Heading>
                <FaGamepad size={50} />
                <ButtonsContainer>
                    <MatchButton onClick={() => connectToQueue()}>
                        <IoEarth size={40} />
                        <VStack alignItems="flex-start">
                            <Text>Modo online</Text>
                            <Text fontWeight={300} fontSize="smaller">Jogue uma partida contra outra pessoa</Text>
                        </VStack>
                    </MatchButton>
                    <MatchButton>
                        <FaUserGroup size={40} />
                        <VStack alignItems="flex-start">
                            <Text>Jogar com um amigo</Text>
                            <Text fontWeight={300} fontSize="smaller">Convide um amigo de sua lista para jogar uma partida</Text>
                        </VStack>
                    </MatchButton>
                </ButtonsContainer>
                {time !== null && <Text>{Math.floor(time / 1000 / 60 % 60).toLocaleString('pt-BR')} : {Math.floor(time / 1000 % 60).toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}</Text>}
            </MatchContainer>
    );
}

const MatchContainer = styled.div`
    background-color: #23232c;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 10px 40px;
    border-radius: 8px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const MatchButton = styled.button`
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 8px;
    background-color: #2a2b35;
    border-radius: 8px;
    transition: background-color 0.1s ease-out;

    &:hover {
        background-color: #1c1c24;
    }
`;