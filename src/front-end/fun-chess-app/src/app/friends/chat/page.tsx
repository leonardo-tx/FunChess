"use client";

import { JSX, useEffect, useState } from "react";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";
import * as messageFetcher from "@/data/friends/fetchers/message-fetcher";
import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
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
import useTitle from "@/lib/shared/hooks/useTitle";

export default function FriendsChat(): JSX.Element {
    const { authenticated } = useAuth();
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [friends, setFriends] = useState<Account[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { register, handleSubmit, reset } = useForm<MessageForm>();
    useTitle("Chat online - FunChess");

    const onSubmit: SubmitHandler<MessageForm> = async (data: MessageForm): Promise<void> => {
        if (selectedId === -1) return;
        
        data.friendId = selectedId;
        const createdMessage: Message | null | undefined = await connection?.invoke("SendMessage", data);
        if (createdMessage != null) {
            const fixedDate = new Date(createdMessage.creation);
            fixedDate.setMinutes(fixedDate.getMinutes() - -fixedDate.getTimezoneOffset());
            createdMessage.creation = fixedDate.getTime();
            setMessages(messages => {
                const newMessages =  [...messages];
                newMessages.push(createdMessage);
                
                return newMessages;
            });
            reset();
        }
    }

    useEffect(() => {
        const connection = getHubConnection();
        setConnection(connection);

        connection.start();
        connection.on("Disconnected", () => {
            connection.stop();
            onOpen();
        });
        return () => { connection.stop(); }
    }, [])

    useEffect(() => {
        if (!authenticated) redirect("/login");

        const getFriends = async () => {
            setFriends((await friendshipFetcher.getAll()).result ?? []);
        }
        getFriends();
    }, [authenticated]);

    useEffect(() => {
        connection?.on("MessageReceived", (message: Message) =>  {
            if (selectedId === message.authorId) {
                const fixedDate = new Date(message.creation);
                fixedDate.setMinutes(fixedDate.getMinutes() - -fixedDate.getTimezoneOffset());
                message.creation = fixedDate.getTime();
                setMessages(messages => {
                    const newMessages =  [...messages];
                    newMessages.push(message);
                    
                    return newMessages;
                });
            }
        })

        if (selectedId === -1) { setFriends([]); return; }
        const getMessages = async () => {
            setMessages((await messageFetcher.getAll(selectedId)).result ?? [])
        }
        getMessages();

        return () => { connection?.off("MessageReceived"); }
    }, [connection, selectedId]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Você foi desconectado</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Para se reconectar ao chat online, clique em reconectar
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => {
                            connection?.start();
                            onClose();
                            if (selectedId === -1) { setFriends([]); return; }
                            const getMessages = async () => {
                                setMessages((await messageFetcher.getAll(selectedId)).result ?? [])
                            }
                            getMessages();
                        }} variant='ghost'>Reconectar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <FriendLayout>
            <ChatLayout>
                <FriendsSelector>
                    {friends.map((account) => (
                        <FriendSelection $selected={account.id === selectedId} onClick={() => setSelectedId(account.id)} key={account.id}>
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
                    <Input autoComplete="off" {...register("text")} />
                </Box>
            </ChatLayout>
        </FriendLayout>
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

const ChatMessage = ({ message, isFriend }: { message: Message, isFriend: boolean }): JSX.Element => {
    const Element = isFriend ? MessageFromFriend : MessageFromCurrent;
    const date = new Date(message.creation);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

    return (
        <Element>
            <Text wordBreak="break-word" fontSize="sm" marginBottom={2}>
                {message.text}
            </Text>
            <Text fontSize="xs" alignSelf="flex-end">
                {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
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
    max-height: 100%;
    @media only screen and (max-width: 1280px) {
        grid-template-columns: 1fr;
        grid-template-rows: 80px 1fr 60px;
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
    flex-direction: column;
    gap: 4px;
    max-height: 100%;
    overflow-y: scroll;
    background-color: #272731;
    padding: 10px 20px;
`;

const MessageFromCurrent = styled.div`
    display: grid;
    max-width: 50%;
    grid-template-columns: 1fr auto;
    align-self: flex-start;
    background-color: #393947;
    padding: 3px 8px;
    border-radius: 8px;
    gap: 9px;
`;

const MessageFromFriend = styled.div`
    display: flex;
    max-width: 50%;
    align-self: flex-end;
    background-color: #393947;
    padding: 3px 8px;
    border-radius: 8px;
    gap: 9px;
`;