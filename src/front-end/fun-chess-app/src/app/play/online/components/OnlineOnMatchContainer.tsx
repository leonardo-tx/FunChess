import useLang from "@/data/settings/hooks/useLang";
import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { JSX } from "react";
import { FaFlag } from "react-icons/fa6";

interface Props {
    onSurrender: () => void;
}

export default function OnlineOnMatchContainer({ onSurrender }: Props): JSX.Element {
    const { t } = useLang();

    return (
        <Container>
            <Button leftIcon={<FaFlag />} onClick={onSurrender}>{t("buttons.surrender")}</Button>
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