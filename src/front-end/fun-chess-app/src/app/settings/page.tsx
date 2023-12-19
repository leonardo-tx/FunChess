"use client";

import { Button, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftElement, Select, VStack, useDisclosure } from "@chakra-ui/react";
import { ChangeEventHandler, JSX, useState } from "react";
import { FaLanguage } from "react-icons/fa6";
import useLang from "@/data/langs/hooks/useLang";
import useAuth from "@/data/auth/hooks/useAuth";
import ConfirmPasswordModal from "./components/ConfirmPasswordModal";
import { BiUser, BiLockAlt } from "react-icons/bi";
import { IoMailOutline } from "react-icons/io5";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import UpdateForm from "@/core/auth/forms/UpdateForm";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";

export default function Settings(): JSX.Element {
    const { t, setLangCode, langCode } = useLang();
    const { authenticated, deleteAccount, update } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [configurationType, setConfigurationType] = useState<ConfigurationType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register, formState: { errors }, handleSubmit, reset } = useForm<UpdateForm>();
    const router = useRouter();

    const messageErrors = getFrontMessageErrors(t, errors);

    const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setLangCode(e.target.value);
    }

    const onSubmit: SubmitHandler<UpdateForm> = async (data: UpdateForm): Promise<void> => {
        setLoading(true);
        if (configurationType === ConfigurationType.Delete) {
            const status = await deleteAccount(data)
            setLoading(false);

            if (status === StatusCodes.OK) { router.push("/"); return; }
            if (status === StatusCodes.UNAUTHORIZED) { setError(t("auth.password-incorrect")); return; }
            
            setError("Não foi possível deletar a conta");
            return;
        }
        if (configurationType === ConfigurationType.Update) {
            const status = await update(data);
            setLoading(false);

            if (status === StatusCodes.OK) { onClose(); setError(null); reset(); return; }
            if (status === StatusCodes.UNAUTHORIZED) { setError(t("auth.password-incorrect")); return; }
            if (status === StatusCodes.BAD_REQUEST) { setError(null); return; }

            setError("Não foi possível atualizar as informações da conta");
            return;
        }
    }

    return (
        <VStack alignItems="stretch" spacing={20} p={8}>
            <VStack spacing={5} as="section">
                <Heading size="lg">{t("settings.language-heading")}</Heading>
                <Select onChange={onLanguageChange} defaultValue={langCode} icon={<FaLanguage />} maxW="500px">
                    <option value="en">English</option>
                    <option value="pt-BR">Português (BR)</option>
                    <option value="ja-JP">日本語</option>
                </Select>
            </VStack>
            {authenticated && (
                <VStack spacing={10} as="section">
                    <Heading size="lg">Configurações de conta</Heading>
                    <VStack as="form">
                        <FormControl isInvalid={Object.keys(messageErrors).length > 0} display="flex" flexDir="column" gap="50px" maxW="lg">
                            <VStack alignItems="stretch" spacing={4}>
                                <Heading alignSelf="center" as="h3" size="md">Atualizar dados da conta</Heading>
                                <InputGroup display="flex" flexDir="column" size="lg">
                                    <InputLeftElement><IoMailOutline size={24} /></InputLeftElement>
                                    <Input
                                        isInvalid={messageErrors.email !== undefined} 
                                        variant="filled"
                                        placeholder={t("inputs.email-placeholder")}
                                        {...register("email", { pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i })}
                                    />
                                    <FormErrorMessage alignSelf="flex-start">{messageErrors.email}</FormErrorMessage>
                                </InputGroup>
                                <InputGroup display="flex" flexDir="column" size="lg">
                                    <InputLeftElement><BiUser size={24} /></InputLeftElement>
                                    <Input
                                        isInvalid={messageErrors.username !== undefined}
                                        variant="filled"
                                        placeholder={t("inputs.username-placeholder")}
                                        {...register("username", { minLength: 3, maxLength: 20 })}
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
                                        {...register("password", { minLength: 6, maxLength: 128 })}
                                    />
                                    <FormErrorMessage alignSelf="flex-start">{messageErrors.password}</FormErrorMessage>
                                </InputGroup>
                                <Button type="button" onClick={() => {
                                    setConfigurationType(ConfigurationType.Update)
                                    onOpen()
                                }} colorScheme="green">Atualizar</Button>
                            </VStack>
                            <VStack alignItems="stretch">
                                <Heading alignSelf="center" as="h3" size="md">Apagar meus dados</Heading>
                                <Button type="button" onClick={() => {
                                    setConfigurationType(ConfigurationType.Delete)
                                    onOpen()
                                }} colorScheme="red">Deletar minha conta</Button>
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
            )}
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