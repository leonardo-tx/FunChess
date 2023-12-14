"use client";

import Account from "@/core/auth/models/Account";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import useAuth from "@/data/auth/hooks/useAuth";
import useTitle from "@/lib/shared/hooks/useTitle";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";
import useLang from "@/data/langs/hooks/useLang";
import formatString from "@/lib/shared/utils/formatString";
import FriendComplement from "./components/FriendComplement";


export default function Profile(): JSX.Element {
    const searchParams = useSearchParams()
    const { currentAccount } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useLang();
    const [title, setTitle] = useTitle();

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
        if (account === null) { setTitle(t("profile.not-found-title")); return; }
        setTitle(t("profile.found-title", account.username));
    }, [account])

    if (isLoading) return <></>

    if (account === null) {
        return (
            <div>
                <Text>{t("profile.not-found-text")}</Text>
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
                                {formatString(t("profile.account-created"), new Date(account.creation).toLocaleDateString(document.documentElement.lang))}
                            </Text>
                        </VStack>
                        <HStack alignItems="flex-start">
                            <FriendComplement account={account} setAccount={setAccount} />
                        </HStack>
                    </TextInfo>
                </ProfileInfo>
            </Container>
        </AuthorizeProvider>
    );
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