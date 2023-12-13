"use client";

import { JSX, useEffect, useState } from "react";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import Account from "@/core/auth/models/Account";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import defaultIcon from "@/lib/assets/user/default.jpg";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import FriendStatus from "@/core/friends/models/FriendStatus";
import { StatusCodes } from "http-status-codes";
import useTitle from "@/lib/shared/hooks/useTitle";
import formatString from "@/lib/shared/utils/formatString";
import useLang from "@/data/langs/hooks/useLang";

export default function FriendsInvites(): JSX.Element {
    const [invites, setInvites] = useState<Account[]>([]);
    const [receivedInvites, setReceivedInvites] = useState<Account[]>([]);
    const [deliveredInvites, setDeliveredInvites] = useState<Account[]>([]);

    const { file } = useLang("friends/invites")

    useEffect(() => {
        const getInvites = async () => {
            setInvites((await friendshipFetcher.getAllInvites()).result ?? []);
        }
        getInvites();
    }, []);

    useEffect(() => {
        setReceivedInvites(invites.filter((invite) => invite.friendStatus === FriendStatus.Received));
        setDeliveredInvites(invites.filter((invite) => invite.friendStatus === FriendStatus.Delivered));
    }, [invites])
    
    return (
        <>
            {receivedInvites.length > 0 && <>
                <Text>{formatString(file["received-quantity"], receivedInvites.length)}</Text>
                <VStack alignItems="stretch">
                    {receivedInvites.map(((invite, i) => (
                        <InviteBox key={invite.id}>
                            <ProfileLink href={`/profile?id=${invite.id}`}>
                                <Image src={defaultIcon} alt={formatString(file["icon-profile-alt"], invite.username)} />
                                <Text>{invite.username}</Text>
                            </ProfileLink>
                            <HStack spacing={4} justifyContent="flex-end">
                                <Button onClick={() => friendshipFetcher.acceptInvite(invite.id).then((response) => {
                                    if (response.status !== StatusCodes.OK) return;
                                    const newInvites = [...receivedInvites];
                                    
                                    newInvites.splice(i, 1);
                                    setReceivedInvites(newInvites);
                                })}>
                                    {file["accept-button"]}
                                </Button>
                                <Button onClick={() => friendshipFetcher.declineInvite(invite.id).then((response) => {
                                    if (response.status !== StatusCodes.OK) return;
                                    const newInvites = [...receivedInvites];
                                    
                                    newInvites.splice(i, 1);
                                    setReceivedInvites(newInvites);
                                })}>
                                    {file["ignore-button"]}
                                </Button>
                            </HStack>
                        </InviteBox>
                    )))}
                </VStack>
            </>}
            {deliveredInvites.length > 0 && <>
                <Text>{formatString(file["sent-quantity"], deliveredInvites.length)}</Text>
                <VStack alignItems="stretch">
                    {deliveredInvites.map(((invite, i) => (
                        <InviteBox key={invite.id}>
                            <ProfileLink href={`/profile?id=${invite.id}`}>
                                <Image src={defaultIcon} alt={formatString(file["icon-profile-alt"], invite.username)} />
                                <Text>{invite.username}</Text>
                            </ProfileLink>
                            <HStack justifyContent="flex-end">
                                <Button onClick={() => friendshipFetcher.declineInvite(invite.id).then((response) => {
                                    if (response.status !== StatusCodes.OK) return;
                                    const newInvites = [...deliveredInvites];
                                    
                                    newInvites.splice(i, 1);
                                    setDeliveredInvites(newInvites);
                                })}>
                                    {file["cancel-button"]}
                                </Button>
                            </HStack>
                        </InviteBox>
                    )))}
                </VStack>
            </>}
        </>
    );
}

const InviteBox = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    background-color: #2d2b36;
    padding: 15px 10px;
    border-radius: 8px;

    & img {
        width: 40px;
        aspect-ratio: 1 / 1;
    }
`;

const ProfileLink = styled(Link)`
    display: flex;
    gap: 20px;
    align-items: center;
`