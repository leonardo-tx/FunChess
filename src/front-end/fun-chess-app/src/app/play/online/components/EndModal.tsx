import Match from "@/core/chess/Match";
import MatchState from "@/core/chess/enums/MatchState";
import Team from "@/core/chess/enums/Team";
import useLang from "@/data/settings/hooks/useLang";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, HStack, VStack, Text } from "@chakra-ui/react";
import { JSX, useState } from "react";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import useAuth from "@/data/auth/hooks/useAuth";
import styled from "@emotion/styled";
import Account from "@/core/auth/models/Account";

interface Props {
    onClose: () => void;
    isOpen: boolean;
    matchInfo: Match
    team: Team
    opponentAccount: Account
}

export default function EndModal({ onClose, isOpen, matchInfo, team, opponentAccount }: Props): JSX.Element {
    const { t } = useLang();
    const { currentAccount } = useAuth();

    let endType = EndType.Tie;
    let opponentEndType = EndType.Tie;

    switch (matchInfo.matchState) {
        case team as number:
            endType = EndType.Victory;
            opponentEndType = EndType.Defeat;
            break;
        case team as number % 2 + 1:
            endType = EndType.Defeat;
            opponentEndType = EndType.Victory;
            break;
    }

    const getTitle = (endType: EndType): string => {
        switch (endType) {
            case EndType.Victory:
                return t("play.victory-title");
            case EndType.Defeat:
                return t("play.defeat-title");
            case EndType.Tie:
                return t("play.tie-title");
        }
    }

    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">{getTitle(endType)}</ModalHeader>
                <ModalBody>
                    <HStack spacing={5} justifyContent="center">
                        <VStack>
                            <TextWithColor $endType={endType}>{getTitle(endType)}</TextWithColor>
                            <ImageWithBorder $endType={endType} src={defaultIcon} alt={t("alt.icon-profile", currentAccount!.username)} />
                            <Text>{currentAccount!.username}</Text>
                        </VStack>
                        <Text fontWeight="600">X</Text>
                        <VStack>
                            <TextWithColor $endType={opponentEndType}>{getTitle(opponentEndType)}</TextWithColor>
                            <ImageWithBorder $endType={opponentEndType} src={defaultIcon} alt={t("alt.icon-profile", opponentAccount.username)} />
                            <Text>{opponentAccount.username}</Text>
                        </VStack>
                    </HStack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

const TextWithColor = styled(Text, { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $endType: EndType;
}>`
    color: ${(props) => props.$endType === EndType.Victory ? "#81c973" : props.$endType === EndType.Tie ? "#838383" : "#c26262"};
`

const ImageWithBorder = styled(Image, { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $endType: EndType;
}>`
    aspect-ratio: 1 / 1;
    width: 100px;
    border: 3px solid ${(props) => props.$endType === EndType.Victory ? "#81c973" : props.$endType === EndType.Tie ? "#838383" : "#c26262"}
`

enum EndType {
    Victory,
    Defeat,
    Tie
}