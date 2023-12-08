"use client";

import Account from "@/core/auth/models/Account";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import { Heading, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";

export default function Friends(): JSX.Element {
    const [friends, setFriends] = useState<Account[]>([]);

    useEffect(() => {
        const getFriends = async () => {
            setFriends((await friendshipFetcher.getAll()).result ?? []);
        }
        getFriends();
    }, [])

    return (
        <VStack align-items="center" gap={2}>
            <Heading as="h2" size="lg">Amigos</Heading>
            {friends.map(((friend, i) => (
                <FriendBox href={`/profile?id=${friend.id}`} key={i}>
                    <Image src={defaultIcon} alt="Ícone de perfil" />
                    <Text fontSize="x-large">{friend.username}</Text>
                </FriendBox>
            )))}
        </VStack>       
    );
}

const FriendBox = styled(Link)`
    display: flex;
    align-items: center;
    gap: 20px;
    background-color: #222029;
    padding: 10px;
    border-radius: 8px;
    max-width: 700px;
    width: 100%;

    & img {
        width: 120px;
        aspect-ratio: 1 / 1;
    }
`;