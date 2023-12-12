import Message from "@/core/friends/models/Message";
import styled from "@emotion/styled";
import { JSX } from "react";
import { Text } from "@chakra-ui/react";

interface Props {
    message: Message;
    isFriend: boolean;
}

export default function MessageItem({ message, isFriend }: Props): JSX.Element {
    const date = new Date(message.creation);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    return (
        <Container $isFriend={isFriend}>
            <Text wordBreak="break-word" fontSize="sm" marginBottom={2}>
                {message.text}
            </Text>
            <Text fontSize="xs" alignSelf="flex-end">
                {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
            </Text>
        </Container>
    );
}

const Container = styled("div", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $isFriend: boolean
}>`
    display: grid;
    max-width: 50%;
    grid-template-columns: 1fr auto;
    align-self: ${props => props.$isFriend ? "flex-start" : "flex-end"};
    background-color: ${props => props.$isFriend ? "#393947" : "#255685"};
    padding: 3px 8px;
    border-radius: 8px;
    gap: 9px;
`;