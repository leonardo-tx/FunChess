import UpdateForm from "@/core/auth/forms/UpdateForm";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";
import { JSX } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
    loading: boolean;
    register: UseFormRegister<UpdateForm>;
    isOpen: boolean;
    onClose: () => void;
    error: string | null;
    onSubmit: () => void;
}

export default function ConfirmPasswordModal({ loading, register, isOpen, onClose, onSubmit, error }: Props): JSX.Element {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirme a ação com sua senha atual</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {error !== null && (
                        <Alert status='error'>
                            <AlertIcon />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Input type="password" placeholder="Senha atual" {...register("currentPassword", { required: true })} />
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" onClick={onSubmit} isLoading={loading} variant='ghost'>Confirmar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}