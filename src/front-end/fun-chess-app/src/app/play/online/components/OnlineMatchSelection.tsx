import { Button, Heading, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import { FaGamepad, FaUserGroup } from "react-icons/fa6";
import { IoEarth } from "react-icons/io5";
import { Text } from "@chakra-ui/react";

interface Props {
    connectToQueue: () => void;
    onQueue: boolean;
}

export default function OnlineMatchSelection({ connectToQueue, onQueue }: Props): JSX.Element {
    const [time, setTime] = useState<number | null>(null);

    useEffect(() => {
        if (!onQueue) { setTime(null); return; }

        const initialQueueTime = Date.now();
        const interval = setInterval(() => setTime(Date.now() - initialQueueTime), 1000)

        return () => clearInterval(interval);
    }, [onQueue])

    return (
        <Container>
            <Button minW="250px" size="lg" isLoading={onQueue} loadingText="Procurando partida" onClick={connectToQueue} colorScheme="green">Jogar</Button>
            {time !== null && <Text>{Math.floor(time / 1000 / 60 % 60).toLocaleString('pt-BR')} : {Math.floor(time / 1000 % 60).toLocaleString('pt-BR', { minimumIntegerDigits: 2 })}</Text>}
        </Container>
    );
}

const Container = styled.div`
    background-color: #23232c;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 40px;
    border-radius: 8px;
    height: 100%;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const PlayButton = styled.button`
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