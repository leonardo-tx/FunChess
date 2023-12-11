"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import * as messageFetcher from "@/data/friends/fetchers/message-fetcher";
import { Box, Input, Text, Textarea } from "@chakra-ui/react";
import Image from "next/image";
import FriendLayout from "../components/FriendLayout";
import styled from "@emotion/styled";
import Account from "@/core/auth/models/Account";
import defaultIcon from "@/lib/assets/user/default.jpg";
import Message from "@/core/friends/models/Message";
import { HubConnection, HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import useAuth from "@/data/auth/hooks/useAuth";
import { redirect } from "next/navigation";
import MessageForm from "@/core/friends/forms/MessageForm";
import { SubmitHandler, useForm } from "react-hook-form";

export default function FriendsChat(): JSX.Element {
    const { authenticated } = useAuth();
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [friends, setFriends] = useState<Account[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const { register, handleSubmit } = useForm<MessageForm>();

    const onSubmit: SubmitHandler<MessageForm> = async (data: MessageForm): Promise<void> => {
        if (selectedId === -1) return;
        
        data.friendId = selectedId;
        const createdMessage = await connection?.invoke("SendMessage", data);
        if (createdMessage !== null) {
            setMessages(messages => {
                const newMessages =  [...messages];
                newMessages.push(createdMessage);
                
                return newMessages;
            })
        }
    }

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        connection.start();
        return () => { connection.stop(); }
    }, [])

    useEffect(() => {
        if (!authenticated) redirect("/login");

        const getFriends = async () => {
            setFriends((await friendshipFetcher.getAll()).result ?? []);
        }
        getFriends();
    }, [authenticated])

    useEffect(() => {
        connection?.on("MessageReceived", (message: Message) =>  {
            if (selectedId === message.authorId) {
                setMessages(messages => {
                    const newMessages =  [...messages];
                    newMessages.push(message);
                    
                    return newMessages;
                })
            }
        })

        if (selectedId === -1) {
            setFriends([]);
            return;
        }
        const getMessages = async () => {
            setMessages((await messageFetcher.getAll(selectedId)).result ?? [])
        }
        getMessages();
    }, [connection, selectedId]);

    return (
        <FriendLayout>
            <ChatLayout>
                <FriendsSelector>
                    {friends.map((account) => (
                        <FriendSelection onClick={() => setSelectedId(account.id)} key={account.id}>
                            <Image src={defaultIcon} alt="Ícone de perfil" />
                            <FriendSelectionText>
                                <Text>{account.username}</Text>
                            </FriendSelectionText>
                        </FriendSelection>
                    ))}
                </FriendsSelector>
                <MessagesContent>
                    {messages.map((message, i) => (
                        <ChatMessage key={i} message={message} isFriend={message.authorId === selectedId} />
                    ))}
                </MessagesContent>
                <Box onSubmit={handleSubmit(onSubmit)} as="form" p="10px" backgroundColor="#333341" gridArea="chat-form">
                    <input type="submit" hidden />
                    <Input {...register("text")} />
                </Box>
            </ChatLayout>
        </FriendLayout>
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

const ChatMessage = ({ message, isFriend }: { message: Message, isFriend: boolean }): JSX.Element => {
    const Element = isFriend ? MessageFromFriend : MessageFromCurrent;

    return (
        <Element>
            <Text fontSize="sm" marginBottom={2}>
                {message.text}
            </Text>
            <Text fontSize="xs" alignSelf="flex-end">
                {new Date(message.creation).toLocaleTimeString('pt-BR')}
            </Text>
        </Element>
    );
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

const FriendSelection = styled.button`
    display: flex;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid #403e4d;

    &:hover {
        background-color: #33313d;
    }
    
    & img {
        width: 40px;
        aspect-ratio: 1 / 1;
    }
`;

const FriendSelectionText = styled.div`
    display: flex;
    width: 100%;
`

const MessagesContent = styled.div`
    grid-area: chat;
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 100%;
    overflow-y: scroll;
    background-color: #272731;
    padding: 0 20px;
`

const MessageFromCurrent = styled.div`
    display: flex;
    max-width: 50%;
    align-self: flex-start;
    background-color: #393947;
    padding: 3px 8px;
    border-radius: 8px;
    gap: 9px;
`

const MessageFromFriend = styled.div`
    display: flex;
    max-width: 50%;
    align-self: flex-end;
    background-color: #393947;
    padding: 3px 8px;
    border-radius: 8px;
    gap: 9px;
`