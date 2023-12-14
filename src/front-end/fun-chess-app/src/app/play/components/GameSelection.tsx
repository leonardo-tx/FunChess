import useLang from "@/data/langs/hooks/useLang";
import { Heading, VStack, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { JSX } from "react";
import { FaComputer, FaGamepad, FaUserGroup } from "react-icons/fa6";
import { IoEarth } from "react-icons/io5";

export default function GameSelection(): JSX.Element {
    const { t } = useLang();

    return (
        <Container>
                <Heading fontWeight={700} size="lg" as="h2">{t("titles.play")}</Heading>
                <FaGamepad size={50} />
                <ButtonsContainer>
                    <MatchButton href="/play/online">
                        <IoEarth size={30} />
                        <VStack alignItems="flex-start">
                            <Text>{t("play.online-mode-title")}</Text>
                            <Text fontWeight={300} fontSize="smaller">{t("play.online-mode-text")}</Text>
                        </VStack>
                    </MatchButton>
                    <MatchButton href="/play/friend">
                        <FaUserGroup size={30} />
                        <VStack alignItems="flex-start">
                            <Text>{t("play.friend-mode-title")}</Text>
                            <Text fontWeight={300} fontSize="smaller">{t("play.friend-mode-text")}</Text>
                        </VStack>
                    </MatchButton>
                    <MatchButton href="/play/local">
                        <FaComputer size={30} />
                        <VStack alignItems="flex-start">
                            <Text>{t("play.local-mode-title")}</Text>
                            <Text fontWeight={300} fontSize="smaller">{t("play.local-mode-text")}</Text>
                        </VStack>
                    </MatchButton>
                </ButtonsContainer>
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

    @media only screen and (max-width: 1024px) {
        width: 100%;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const MatchButton = styled(Link)`
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