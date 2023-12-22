"use client";

import { JSX, useCallback, useEffect, useState } from "react";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import * as messageFetcher from "@/data/friends/fetchers/message-fetcher";
import { Box, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import styled from "@emotion/styled";
import Account from "@/core/auth/models/Account";
import defaultIcon from "@/lib/assets/user/default.jpg";
import Message from "@/core/friends/models/Message";
import { HubConnection, HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import MessageForm from "@/core/friends/forms/MessageForm";
import { SubmitHandler, useForm } from "react-hook-form";
import DisconnectedModal from "@/lib/shared/components/DisconnectedModal";
import MessageItem from "./components/MessageItem";
import useLang from "@/data/settings/hooks/useLang";

export default function FriendsChat(): JSX.Element {
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [friends, setFriends] = useState<Account[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const { register, handleSubmit, reset } = useForm<MessageForm>();
    const { t } = useLang();

    const setMessageReceivedFromHub = useCallback((message: Message | null | undefined): boolean => {
        if (!message) return false;

        const fixedDate = new Date(message.creation);
        fixedDate.setMinutes(fixedDate.getMinutes() - -fixedDate.getTimezoneOffset());
        
        message.creation = fixedDate.getTime();
        setMessages(messages => [message, ...messages]);
        return true;
    }, [])

    const onSubmit: SubmitHandler<MessageForm> = async (data: MessageForm): Promise<void> => {
        if (selectedId === -1) return;
        
        data.friendId = selectedId;
        const createdMessage: Message | null | undefined = await connection?.invoke("SendMessage", data);
        
        if (setMessageReceivedFromHub(createdMessage)) reset();
    }

    const refreshAllMessages = useCallback(async () => {
        if (selectedId === -1) { setMessages([]); return; }

        const fetchedMessages = (await messageFetcher.getAll(selectedId)).result?.reverse() ?? [];
        setMessages(fetchedMessages)
    }, [selectedId])

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        connection.start();
        const refreshFriends = async () => {
            const fetchedFriends = (await friendshipFetcher.getAll()).result ?? [];
            setFriends(fetchedFriends);
        }
        refreshFriends();
        return () => { connection.stop(); }
    }, [])

    useEffect(() => {
        refreshAllMessages();
    }, [refreshAllMessages]);

    useEffect(() => {
        connection?.on("MessageReceived", (message: Message) =>  {
            if (selectedId === message.authorId) setMessageReceivedFromHub(message);
        })
        return () => { connection?.off("MessageReceived"); }
    }, [connection, selectedId, setMessageReceivedFromHub]);

    return (
        <>
            <ChatLayout>
                <FriendsSelector>
                    {friends.map((account) => (
                        <FriendSelection $selected={account.id === selectedId} onClick={() => setSelectedId(account.id)} key={account.id}>
                            <Image src={defaultIcon} alt={t("alt.icon-profile", account.username)} />
                            <FriendSelectionText>
                                <Text>{account.username}</Text>
                            </FriendSelectionText>
                        </FriendSelection>
                    ))}
                </FriendsSelector>
                <MessagesContent>
                    {messages.map((message, i) => (
                        <MessageItem 
                            key={i} 
                            message={message} 
                            isFriend={message.authorId === selectedId} 
                        />
                    ))}
                </MessagesContent>
                <Box onSubmit={handleSubmit(onSubmit)} as="form" p="10px" backgroundColor="#333341" gridArea="chat-form">
                    <input type="submit" hidden />
                    <Input type="text" placeholder={t("inputs.message-placeholder")} autoComplete="off" {...register("text")} />
                </Box>
            </ChatLayout>
            {connection !== null && 
                <DisconnectedModal connection={connection} onReconnect={() => refreshAllMessages()} />
            }
        </>
    );
}

function getHubConnection(): HubConnection {
    return new HubConnectionBuilder()
        .withUrl(`ws://${process.env.apiUrl}/Hub/FriendChat`, { 
            withCredentials: true, 
            skipNegotiation: true, 
            transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
}

const ChatLayout = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr 60px;
    grid-template-areas:
        "selector chat"
        "selector chat-form"
    ;
    height: 100%;
    width: 100%;
    max-height: 100%;
    @media only screen and (max-width: 1280px) {
        grid-template-columns: 1fr;
        grid-template-rows: 100px 1fr 60px;
        grid-template-areas:
            "selector"
            "chat"
            "chat-form"
        ;
    }
`;

const FriendsSelector = styled.div`
    grid-area: selector;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow-y: scroll;
    background-color: #2d2b36;
    border-right: 1px solid #403e4d;
`;

const FriendSelection = styled("button", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $selected: boolean
}>`
    display: flex;
    gap: 10px;
    padding: 8px;
    ${props => props.$selected && "background-color: #403e4d;"}
    border-bottom: 1px solid #403e4d;

    &:hover {
        ${props => !props.$selected && "background-color: #33313d;"}
    }
    
    & img {
        width: 40px;
        aspect-ratio: 1 / 1;
    }
`;

const FriendSelectionText = styled.div`
    display: flex;
    width: 100%;
`;

const MessagesContent = styled.div`
    grid-area: chat;
    display: flex;
    flex-direction: column-reverse;
    gap: 4px;
    max-height: 100%;
    overflow-y: scroll;
    background-color: #272731;
    padding: 10px 20px;
`;