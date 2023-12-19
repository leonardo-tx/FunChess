import UpdateForm from "@/core/auth/forms/UpdateForm";
import useLang from "@/data/langs/hooks/useLang";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Alert, AlertDescription, AlertIcon, VStack } from "@chakra-ui/react";
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
    const { t } = useLang();

    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t("settings.confirmation-heading")}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6}>
                        {error !== null && (
                            <Alert status='error'>
                                <AlertIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Input type="password" placeholder={t("inputs.current-password-placeholder")} {...register("currentPassword", { required: true })} />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        type="submit" 
                        onClick={onSubmit} 
                        isLoading={loading}
                        variant="ghost">
                            {t("buttons.confirm")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}