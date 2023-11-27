"use client";

import Account from "@/core/auth/models/Account";
import { getSimpleAccount } from "@/data/auth/fetchers/account-fetchers";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";


export default function Profile(): JSX.Element {
    const searchParams = useSearchParams()
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const id = searchParams?.get("id") ?? null;
        if (id === null) { setIsLoading(false); return; }

        getSimpleAccount(parseInt(id))
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
                    <Text fontSize="x-large">{account.username}</Text>
                    <Text fontSize="sm">
                        Conta criada: {new Date(account.creation).toLocaleDateString(document.documentElement.lang)}
                    </Text>
                </TextInfo>
            </ProfileInfo>
        </Container>
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
    background-color: #222029;
    border-radius: 4px;

    @media only screen and (max-width: 768px) {
        min-width: 0px;
        width: 100%;
    }
`;

const ProfileInfo = styled.div`
    display: flex;
    gap: 20px;

    & img {
        width: 164px;
        aspect-ratio: 1 / 1;
    }
`;

const TextInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
`;