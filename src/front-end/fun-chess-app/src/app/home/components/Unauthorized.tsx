import { JSX } from "react";
import pawn from "../../../lib/assets/pieces/pawn.png";
import Image from "next/image";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import styles from "../styles/Unauthorized.module.css";

export default function Unauthorized(): JSX.Element {
    const router = useRouter();

    return (
        <section className={styles["home-main"]}>
            <VStack textAlign="center">
                <Image alt="Imagem de um peão sorridente" src={pawn} />
                <Heading as="h1" size="xl">Jogue xadrez de forma simples e fácil!</Heading>
            </VStack>
            <div className={styles["button-group"]}>
                <Button colorScheme="purple" onClick={() => router.push("/register")}>Cadastrar-se</Button>
                <Button colorScheme="purple" variant="outline" onClick={() => router.push("/login")}>Login</Button>
            </div>
        </section>
    );
}