import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { HubConnection } from "@microsoft/signalr";
import { JSX, useEffect, useState } from "react";

interface Props {
    connection: HubConnection;
    onReconnect: () => void;
}

export default function DisconnectedModal({ connection, onReconnect }: Props): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        connection.on("Disconnected", () => {
            connection.stop();
            onOpen();
        });

        connection.onclose(() => {
            onOpen();
        });
        
        return () => connection.off("Disconnected");
    }, [connection, onOpen])

    const onReconnectClick = async () => {
        setLoading(true);
        try {
            await connection.start();
        } catch {
            setLoading(false);
            return;
        }
        onReconnect();
        onClose();
        setLoading(false);
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Você foi desconectado</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Para se reconectar clique em reconectar
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={loading} onClick={() => onReconnectClick()} variant='ghost'>Reconectar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}