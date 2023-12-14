"use client";

import { Alert, AlertDescription, AlertIcon, Button, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";
import { JSX, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt, BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";
import useAuth from "@/data/auth/hooks/useAuth";
import RegisterForm from "@/core/auth/forms/RegisterForm";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import RegisterInitialForm from "@/core/auth/forms/RegisterInitialForm";
import LoginForm from "@/core/auth/forms/LoginForm";
import { StatusCodes } from "http-status-codes";
import useLang from "@/data/langs/hooks/useLang";

export default function Register(): JSX.Element {
    const auth = useAuth();
    const { t } = useLang();
    const router = useRouter();
    const { register, formState: { errors }, handleSubmit } = useForm<RegisterInitialForm>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const messageErrors = getFrontMessageErrors(t, errors);

    const onSubmit: SubmitHandler<RegisterInitialForm> = async (data: RegisterInitialForm): Promise<void> => {
        if (data.password !== data.checkPassword) {
            setError(t("auth.password-conflict"));
            return;
        }
        setIsLoading(true);
        const registerForm: RegisterForm = { email: data.email, username: data.username, password: data.password };
        const registerResponse = await auth.register(registerForm);
        if (registerResponse === StatusCodes.CREATED) {
            const loginForm: LoginForm = { email: data.email, password: data.password };
            await auth.login(loginForm);
            
            router.push("/play"); 
            return; 
        }
        setIsLoading(false);
        if (registerResponse === StatusCodes.CONFLICT) {
            setError(t("auth.email-conflict"))
            return;
        }
        setError(t("auth.register-unknown-error"));
    }
    
    return (
        <VStack onSubmit={handleSubmit(onSubmit)} as="form" h="70%" justifyContent="center" spacing={12}>
            <Heading size="lg" as="h1">{t("titles.register")}</Heading>
            <FormControl isInvalid={Object.keys(messageErrors).length > 0} display="flex" flexDir="column" gap={4} maxW="lg">
                {error !== null && <Alert status='error'>
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>}
                <InputGroup display="flex" flexDir="column" size="lg">
                    <InputLeftElement><IoMailOutline size={24} /></InputLeftElement>
                    <Input
                        isInvalid={messageErrors.email !== undefined} 
                        variant="filled"
                        placeholder={t("inputs.email-placeholder")}
                        {...register("email", { required: true, pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i })}
                    />
                    <FormErrorMessage alignSelf="flex-start">{messageErrors.email}</FormErrorMessage>
                </InputGroup>
                <InputGroup display="flex" flexDir="column" size="lg">
                    <InputLeftElement><BiUser size={24} /></InputLeftElement>
                    <Input
                        isInvalid={messageErrors.username !== undefined}
                        variant="filled"
                        placeholder={t("inputs.username-placeholder")}
                        {...register("username", { required: true, minLength: 3, maxLength: 20 })}
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
                        {...register("password", { required: true, minLength: 6, maxLength: 128 })}
                    />
                    <FormErrorMessage alignSelf="flex-start">{messageErrors.password}</FormErrorMessage>
                </InputGroup>
                <InputGroup display="flex" flexDir="column" size="lg">
                    <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                    <Input
                        isInvalid={messageErrors.checkPassword !== undefined}
                        type="password" 
                        variant="filled" 
                        placeholder={t("inputs.confirm-password-placeholder")}
                        {...register("checkPassword", { required: true })}
                    />
                    <FormErrorMessage alignSelf="flex-start">{messageErrors.checkPassword}</FormErrorMessage>
                </InputGroup>
            </FormControl>
            <VStack spacing={4}>
                <Button isLoading={isLoading} w="200px" type="submit" colorScheme="cyan">{t("buttons.register")}</Button>
                <Button onClick={() => router.push("/login")} colorScheme="cyan" variant="link">{t("buttons.with-account")}</Button>
            </VStack>
        </VStack>
    );
}

function getFrontMessageErrors(t: (key: string, ...args: any[]) => string, errors: FieldErrors<RegisterInitialForm>): { email?: string, password?: string, username?: string, checkPassword?: string } {
    const messageErrors: { email?: string, password?: string, username?: string, checkPassword?: string; } = { };
    
    if (errors.email !== undefined) {
        if (errors.email.type === "required") messageErrors.email = t("auth.email-required");
        else if (errors.email.type === "pattern") messageErrors.email = t("auth.email-invalid");
    }
    if (errors.password !== undefined) {
        if (errors.password.type === "required") messageErrors.password = t("auth.password-required");
        else if (errors.password.type === "minLength") messageErrors.password = t("auth.password-min-length");
    }
    if (errors.username !== undefined) {
        if (errors.username.type === "required") messageErrors.username = t("auth.username-required");
        else if (errors.username.type === "minLength") messageErrors.username = t("auth.username-min-length");
        else if (errors.username.type === "maxLength") messageErrors.username = t("auth.username-max-length");
    }
    if (errors.checkPassword !== undefined) {
        if (errors.checkPassword.type === "required") messageErrors.checkPassword = t("auth.confirm-password-required");
    }
    return messageErrors;
}