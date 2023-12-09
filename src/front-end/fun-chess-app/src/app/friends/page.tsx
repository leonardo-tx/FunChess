"use client";

import Account from "@/core/auth/models/Account";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import { Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Image from "next/image";
import defaultIcon from "@/lib/assets/user/default.jpg";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import FriendLayout from "./components/FriendLayout";

export default function Friends(): JSX.Element {
    const [friends, setFriends] = useState<Account[]>([]);

    useEffect(() => {
        const getFriends = async () => {
            setFriends((await friendshipFetcher.getAll()).result ?? []);
        }
        getFriends();
    }, [])

    return (
        <FriendLayout>
            <Text>Amigos ({friends.length})</Text>
            <FriendsList>
                {friends.map(((friend, i) => (
                    <FriendBox href={`/profile?id=${friend.id}`} key={i}>
                        <Image src={defaultIcon} alt="Ícone de perfil" />
                        <Text>{friend.username}</Text>
                    </FriendBox>
                )))}
            </FriendsList>    
        </FriendLayout>
    );
}

const FriendsList = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
`;

const FriendBox = styled(Link)`
    display: flex;
    align-items: center;
    gap: 20px;
    background-color: #2d2b36;
    padding: 15px 10px;
    border-radius: 8px;

    & img {
        width: 40px;
        aspect-ratio: 1 / 1;
    }
`;