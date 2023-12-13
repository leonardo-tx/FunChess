"use client";

import Account from "@/core/auth/models/Account";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { useSearchParams } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, HStack, Text, VStack } from "@chakra-ui/react";
import useAuth from "@/data/auth/hooks/useAuth";
import FriendStatus from "@/core/friends/models/FriendStatus";
import { StatusCodes } from "http-status-codes";
import { IoIosMore } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import useTitle from "@/lib/shared/hooks/useTitle";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";
import useLang from "@/data/langs/hooks/useLang";
import formatString from "@/lib/shared/utils/formatString";


export default function Profile(): JSX.Element {
    const searchParams = useSearchParams()
    const { currentAccount } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { file } = useLang("profile");
    const [title, setTitle] = useTitle("FunChess");

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

    useEffect(() => {
        if (account === null) { setTitle(`${file["not-found-title"]} - FunChess`); return; }
        setTitle(`${formatString(file["profile-title"], account.username)} - FunChess`);
    }, [account])

    if (isLoading) return <></>

    if (account === null) {
        return (
            <div>
                <Text>{file["not-found-text"]}</Text>
            </div>
        );
    }

    return (
        <AuthorizeProvider>
            <Container>
                <ProfileInfo>
                    <Image src={defaultIcon} alt="Ícone de perfil" />
                    <TextInfo>
                        <VStack alignItems="stretch">
                            <Text fontSize="x-large">{account.username}</Text>
                            <Text fontSize="sm">
                                {formatString(file["account-created"], new Date(account.creation).toLocaleDateString(document.documentElement.lang))}
                            </Text>
                        </VStack>
                        <HStack alignItems="flex-start">
                            {getProfileComplement(file, account, setAccount)}
                        </HStack>
                    </TextInfo>
                </ProfileInfo>
            </Container>
        </AuthorizeProvider>
    );
}

const getProfileComplement = (file: any, account: Account, setAccount: Dispatch<SetStateAction<Account | null>>): JSX.Element | JSX.Element[] => {
    switch (account.friendStatus) {
        case FriendStatus.None:
            return (
                <Button 
                    onClick={() => friendshipFetcher.invite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Delivered});
                    })}>
                    {file["add-friend-button"]}
                </Button>
            );
        case FriendStatus.Delivered:
            return <Text fontSize="sm">{file["sent-request-text"]}</Text>
        case FriendStatus.Received:
            return (
                <Button
                    onClick={() => friendshipFetcher.acceptInvite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Friends});
                    })}>
                    {file["accept-friend-button"]}
                </Button>
            );
        case FriendStatus.Friends:
            return (
                <>
                    <Button>{file["send-message-button"]}</Button>
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
                                    <Text fontSize="sm">{file["remove-friend-button"]}</Text>
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