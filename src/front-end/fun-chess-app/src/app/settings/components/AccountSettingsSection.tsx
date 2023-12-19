import { VStack, Heading, FormControl, InputGroup, InputLeftElement, Input, FormErrorMessage, Button, useDisclosure } from "@chakra-ui/react";
import { JSX, useState } from "react";
import { BiUser, BiLockAlt } from "react-icons/bi";
import { IoMailOutline } from "react-icons/io5";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import UpdateForm from "@/core/auth/forms/UpdateForm";
import useLang from "@/data/langs/hooks/useLang";
import { StatusCodes } from "http-status-codes";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import useAuth from "@/data/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AccountSettingsSection(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useLang();
    const [configurationType, setConfigurationType] = useState<ConfigurationType | null>(null);
    const { deleteAccount, update } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, trigger, formState: { errors }, handleSubmit, reset } = useForm<UpdateForm>();
    const router = useRouter();

    const messageErrors = getFrontMessageErrors(t, errors);

    const onSubmit: SubmitHandler<UpdateForm> = async (data: UpdateForm): Promise<void> => {
        setLoading(true);
        if (configurationType === ConfigurationType.Delete) {
            const status = await deleteAccount(data)
            setLoading(false);

            if (status === StatusCodes.OK) { router.push("/"); return; }
            if (status === StatusCodes.UNAUTHORIZED) { setError(t("auth.password-incorrect")); return; }
            
            setError(t("settings.delete-unknown-error"));
            return;
        }
        if (configurationType === ConfigurationType.Update) {
            const status = await update(data);
            setLoading(false);

            if (status === StatusCodes.OK) { onClose(); setError(null); reset(); return; }
            if (status === StatusCodes.UNAUTHORIZED) { setError(t("auth.password-incorrect")); return; }
            if (status === StatusCodes.BAD_REQUEST) { setError(t("auth.email-conflict")); return; }

            setError(t("settings.update-unknown-error"));
            return;
        }
    }

    return (
        <VStack alignItems="stretch" spacing={10} as="section">
            <Heading alignSelf="center" size="lg">{t("settings.account-heading")}</Heading>
            <VStack as="form">
                <FormControl isInvalid={Object.keys(messageErrors).length > 0} display="flex" flexDir="column" gap="50px" maxW="lg">
                    <VStack alignItems="stretch" spacing={4}>
                        <Heading alignSelf="center" as="h3" size="md">{t("settings.account-update-heading")}</Heading>
                        <InputGroup display="flex" flexDir="column" size="lg">
                            <InputLeftElement><IoMailOutline size={24} /></InputLeftElement>
                            <Input
                                isInvalid={messageErrors.email !== undefined} 
                                variant="filled"
                                placeholder={t("inputs.email-placeholder")}
                                {...register("email", { required: false, pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i })}
                            />
                            <FormErrorMessage alignSelf="flex-start">{messageErrors.email}</FormErrorMessage>
                        </InputGroup>
                        <InputGroup display="flex" flexDir="column" size="lg">
                            <InputLeftElement><BiUser size={24} /></InputLeftElement>
                            <Input
                                isInvalid={messageErrors.username !== undefined}
                                variant="filled"
                                placeholder={t("inputs.username-placeholder")}
                                {...register("username", { required: false, minLength: 3, maxLength: 20 })}
                            />
                            <FormErrorMessage alignSelf="flex-start">{messageErrors.username}</FormErrorMessage>
                        </InputGroup>
                        <InputGroup display="flex" flexDir="column" size="lg">
                            <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                            <Input
                                isInvalid={messageErrors.password !== undefined}
                                type="password" 
                                variant="filled"
                                placeholder={t("inputs.password-placeholder")}
                                {...register("password", { required: false, minLength: 6, maxLength: 128 })}
                            />
                            <FormErrorMessage alignSelf="flex-start">{messageErrors.password}</FormErrorMessage>
                        </InputGroup>
                        <Button type="button" onClick={async () => {
                            const result = await trigger(["email", "username", "password"])
                            if (!result) return;
                            
                            setConfigurationType(ConfigurationType.Update)
                            onOpen()
                        }} colorScheme="green">{t("buttons.update")}</Button>
                    </VStack>
                    <VStack alignItems="stretch">
                        <Heading alignSelf="center" as="h3" size="md">{t("settings.account-delete-heading")}</Heading>
                        <Button type="button" onClick={() => {
                            reset();
                            setConfigurationType(ConfigurationType.Delete);
                            onOpen()
                        }} colorScheme="red">{t("buttons.delete-account")}</Button>
                    </VStack>
                    <ConfirmPasswordModal 
                        onSubmit={handleSubmit(onSubmit)} 
                        error={error} 
                        register={register} 
                        isOpen={isOpen} 
                        onClose={onClose} 
                        loading={loading} 
                    />
                </FormControl>
            </VStack> 
        </VStack>
    );
}

function getFrontMessageErrors(t: (key: string, ...args: any[]) => string, errors: FieldErrors<UpdateForm>): { email?: string, password?: string, username?: string, currentPassword?: string } {
    const messageErrors: { email?: string, password?: string, username?: string, checkPassword?: string; } = { };
    
    if (errors.email !== undefined) {
        if (errors.email.type === "pattern") messageErrors.email = t("auth.email-invalid");
    }
    if (errors.password !== undefined) {
        if (errors.password.type === "minLength") messageErrors.password = t("auth.password-min-length");
    }
    if (errors.username !== undefined) {
        if (errors.username.type === "minLength") messageErrors.username = t("auth.username-min-length");
        else if (errors.username.type === "maxLength") messageErrors.username = t("auth.username-max-length");
    }
    if (errors.currentPassword !== undefined) {
        if (errors.currentPassword.type === "required") messageErrors.checkPassword = t("auth.password-required");
    }
    return messageErrors;
}

enum ConfigurationType {
    Update,
    Delete
}