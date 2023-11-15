"use client";

import { Button, FormControl, Heading, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";
import { JSX } from "react";
import { IoMailOutline } from "react-icons/io5";
import { BiLockAlt, BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";
import useAuth from "@/data/auth/hooks/useAuth";
import RegisterForm from "@/core/auth/forms/RegisterForm";
import { SubmitHandler, useForm } from "react-hook-form";
import RegisterInitialForm from "@/core/auth/forms/RegisterInitialForm";
import LoginForm from "@/core/auth/forms/LoginForm";

export default function Register(): JSX.Element {
    const auth = useAuth();
    const router = useRouter();
    const { register, handleSubmit } = useForm<RegisterInitialForm>();

    const onSubmit: SubmitHandler<RegisterInitialForm> = async (data: RegisterInitialForm): Promise<void> => {
        if (data.password !== data.checkPassword) return;

        const registerForm: RegisterForm = { email: data.email, username: data.username, password: data.password };
        const registerResponse = await auth.register(registerForm);
        if (registerResponse === 201) {
            const loginForm: LoginForm = { email: data.email, password: data.password };
            await auth.login(loginForm);
            
            router.push("/play"); 
            return; 
        }
    }
    
    return (
        <VStack onSubmit={handleSubmit(onSubmit)} as="form" h="70%" justifyContent="center" spacing={12}>
            <Heading size="lg" as="h1">Cadastro</Heading>
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
                    <InputLeftElement><BiUser size={24} /></InputLeftElement>
                    <Input 
                        variant="filled"
                        placeholder="Nome de usuário"
                        {...register("username", { required: true, minLength: 3, maxLength: 64 })}
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                    <Input 
                        type="password" 
                        variant="filled"
                        placeholder="Senha"
                        {...register("password", { required: true, minLength: 6, maxLength: 128 })}
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputLeftElement><BiLockAlt size={24} /></InputLeftElement>
                    <Input 
                        type="password" 
                        variant="filled" 
                        placeholder="Confirmar senha"
                        {...register("checkPassword", { required: true })}
                    />
                </InputGroup>
            </FormControl>
            <VStack spacing={4}>
                <Button w="200px" type="submit" colorScheme="cyan">Cadastrar-se</Button>
                <Button onClick={() => router.push("/login")} colorScheme="cyan" variant="link">Já possui uma conta? Entre aqui</Button>
            </VStack>
        </VStack>
    );
}