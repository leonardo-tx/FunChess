"use client";

import { Button, FormControl, Heading, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";
import { JSX } from "react";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import LoginForm from "@/core/auth/forms/LoginForm";
import useAuth from "@/data/auth/hooks/useAuth";

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const router = useRouter();
    const { register, handleSubmit } = useForm<LoginForm>();

    const onSubmit: SubmitHandler<LoginForm> = async (data: LoginForm): Promise<void> => {
        const loginResponse = await login(data);
        if (loginResponse === 200) {
            router.push("/play"); 
            return; 
        }
    }
    
    return (
        <VStack onSubmit={handleSubmit(onSubmit)} as="form" h="70%" justifyContent="center" spacing={12}>
            <Heading size="lg" as="h1">Login</Heading>
            <FormControl display="flex" flexDir="column" gap={4} maxW="lg">
                <InputGroup size="lg">
                    <InputLeftElement><IoMailOutline size={24} /></InputLeftElement>
                    <Input 
                        variant="filled" 
                        placeholder="E-mail" 
                        {...register("email", { required: true })} 
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                    <Input 
                        type="password" 
                        variant="filled"
                        placeholder="Senha" 
                        {...register("password", { required: true })} 
                    />
                </InputGroup>
            </FormControl>
            <VStack spacing={4}>
                <Button w="200px" type="submit" colorScheme="cyan">Login</Button>
                <Button type="button" onClick={() => router.push("/register")} colorScheme="cyan" variant="link">Não possui uma conta? Registre-se</Button>
            </VStack>
        </VStack>
    );
}