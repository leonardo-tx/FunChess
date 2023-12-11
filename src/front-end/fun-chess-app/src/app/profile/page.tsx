"use client";

import Account from "@/core/auth/models/Account";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { useSearchParams } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import useAuth from "@/data/auth/hooks/useAuth";
import FriendStatus from "@/core/friends/models/FriendStatus";
import { StatusCodes } from "http-status-codes";
import { IoIosMore } from "react-icons/io";
import { FaUser } from "react-icons/fa6";


export default function Profile(): JSX.Element {
    const searchParams = useSearchParams()
    const { currentAccount } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const id = searchParams?.get("id") ?? null;
        if (id === null) { setIsLoading(false); return; }
        
        const idNumber = parseInt(id);
        if (currentAccount !== null && idNumber === currentAccount.id) {
            setAccount(currentAccount);
            setIsLoading(false);
            return;
        }

        getSimpleAccount(idNumber)
            .then((response) => {
                setAccount(response.result ?? null);
            })
            .finally(() => setIsLoading(false));
    }, [searchParams])

    if (isLoading) return <></>

    if (account === null) {
        return (
            <div>
                <Text>Não foi possível encontrar o perfil.</Text>
            </div>
        );
    }

    return (
        <Container>
            <ProfileInfo>
                <Image src={defaultIcon} alt="Ícone de perfil" />
                <TextInfo>
                    <VStack alignItems="stretch">
                        <Text fontSize="x-large">{account.username}</Text>
                        <Text fontSize="sm">
                            Conta criada: {new Date(account.creation).toLocaleDateString(document.documentElement.lang)}
                        </Text>
                    </VStack>
                    <HStack alignItems="flex-start">
                        {getProfileComplement(account, setAccount)}
                    </HStack>
                </TextInfo>
            </ProfileInfo>
        </Container>
    );
}

const getProfileComplement = (account: Account, setAccount: Dispatch<SetStateAction<Account | null>>): JSX.Element | JSX.Element[] => {
    switch (account.friendStatus) {
        case FriendStatus.None:
            return (
                <Button 
                    onClick={() => friendshipFetcher.invite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Delivered});
                    })}>
                    Adicionar aos amigos
                </Button>
            );
        case FriendStatus.Delivered:
            return <Text fontSize="sm">Pedido de amizade enviado</Text>
        case FriendStatus.Received:
            return (
                <Button
                    onClick={() => friendshipFetcher.acceptInvite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Friends});
                    })}>
                    Aceitar pedido de amizade
                </Button>
            );
        case FriendStatus.Friends:
            return (
                <>
                    <Button>Enviar mensagem</Button>
                    <Accordion alignSelf="stretch" borderRadius="0.375rem" backgroundColor="#3d3c46" allowToggle>
                        <AccordionItem border="none">
                            <AccordionButton>
                                <IoIosMore />
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel padding={0} pb={4}>
                                <ButtonInsideAccordion onClick={() => friendshipFetcher.unfriend(account.id).then((response) => {
                                    if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.None});
                                })}>
                                    <FaUser />
                                    <Text fontSize="sm">Desfazer amizade</Text>
                                </ButtonInsideAccordion>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </>
            )
        default:
            return <></>
    }
}

const Container = styled.div`
    display: flex;
    padding: 30px;
    flex-direction: column;
    gap: 20px;
    min-height: 100%;
    align-self: center;
    min-width: 680px;
    background-color: #2d2b36;
    border-radius: 4px;

    @media only screen and (max-width: 768px) {
        min-width: 0px;
        width: 100%;
    }
`;

const ProfileInfo = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 20px;

    & img {
        width: 164px;
        aspect-ratio: 1 / 1;
    }
`;

const TextInfo = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 10px;
    padding: 20px;
`;

const ButtonInsideAccordion = styled.button`
    width: 100%;
    padding: 5px 20px;
    display: flex;
    gap: 10px;
    align-items: center;

    &:hover {
        background-color: #ffffff1d;
    }
`