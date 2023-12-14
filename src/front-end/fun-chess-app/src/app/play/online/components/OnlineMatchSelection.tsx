import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import useLang from "@/data/langs/hooks/useLang";

interface Props {
    connectToQueue: () => void;
    onQueue: boolean;
}

export default function OnlineMatchSelection({ connectToQueue, onQueue }: Props): JSX.Element {
    const [time, setTime] = useState<number | null>(null);
    const { t } = useLang();

    useEffect(() => {
        if (!onQueue) { setTime(null); return; }

        const initialQueueTime = Date.now();
        const interval = setInterval(() => setTime(Date.now() - initialQueueTime), 1000)

        return () => clearInterval(interval);
    }, [onQueue])

    return (
        <Container>
            <Button 
                minW="250px" 
                size="lg" 
                isLoading={onQueue} 
                loadingText={t("buttons.play-loading")} 
                onClick={connectToQueue} 
                colorScheme="green"
            >
                {t("buttons.play")}
            </Button>
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