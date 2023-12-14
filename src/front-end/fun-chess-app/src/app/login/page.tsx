"use client";

import { Alert, AlertDescription, AlertIcon, Button, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";
import { JSX, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import LoginForm from "@/core/auth/forms/LoginForm";
import useAuth from "@/data/auth/hooks/useAuth";
import { StatusCodes } from "http-status-codes";
import useLang from "@/data/langs/hooks/useLang";

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const { t } = useLang();
    const router = useRouter();
    const { register, formState: { errors }, handleSubmit } = useForm<LoginForm>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const messageErrors = getFrontMessageErrors(t, errors);

    const onSubmit: SubmitHandler<LoginForm> = async (data: LoginForm): Promise<void> => {
        setIsLoading(true);
        const loginResponse = await login(data);
        if (loginResponse === StatusCodes.OK) {
            router.push("/play");
            return; 
        }
        setIsLoading(false);
        if (loginResponse === StatusCodes.UNAUTHORIZED) {
            setError(t("auth.password-incorrect"));
            return;
        }
        if (loginResponse === StatusCodes.NOT_FOUND) {
            setError(t("auth.email-not-found"))
            return;
        }
        setError(t("auth.login-unknown-error"));
    }
    
    return (
        <VStack onSubmit={handleSubmit(onSubmit)} as="form" h="70%" justifyContent="center" spacing={12}>
            <Heading size="lg" as="h1">{t("titles.login")}</Heading>
                <FormControl isInvalid={Object.keys(messageErrors).length > 0} display="flex" flexDir="column" gap={8} maxW="lg">
                    {error !== null && <Alert status='error'>
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>}
                    <VStack gap={4}>
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
                            <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                            <Input
                                isInvalid={messageErrors.password !== undefined} 
                                type="password" 
                                variant="filled"
                                placeholder={t("inputs.password-placeholder")} 
                                {...register("password", { required: true, minLength: 6 })} 
                            />
                            <FormErrorMessage alignSelf="flex-start">{messageErrors.password}</FormErrorMessage>
                        </InputGroup>
                    </VStack>
                </FormControl>
            <VStack spacing={4}>
                <Button isLoading={isLoading} w="200px" type="submit" colorScheme="cyan">{t("buttons.login")}</Button>
                <Button type="button" onClick={() => router.push("/register")} colorScheme="cyan" variant="link">{t("buttons.no-account")}</Button>
            </VStack>
        </VStack>
    );
}

function getFrontMessageErrors(t: (key: string, ...args: any[]) => string, errors: FieldErrors<LoginForm>): { email?: string, password?: string } {
    const messageErrors: { email?: string, password?: string } = {};

    if (errors.email !== undefined) {
        if (errors.email.type === "required") messageErrors.email = t("auth.email-required");
        else if (errors.email.type === "pattern") messageErrors.email = t("auth.email-invalid");
    }
    if (errors.password !== undefined) {
        if (errors.password.type === "required") messageErrors.password = t("auth.password-required");
        else if (errors.password.type === "minLength") messageErrors.password = t("auth.password-min-length");
    }
    return messageErrors;
}