import { JSX } from "react";
import styles from "../styles/Footer.module.css";
import { HStack, Link } from "@chakra-ui/react";
import { IoLogoGithub } from "react-icons/io5";

export default function Footer(): JSX.Element {
    return (
        <footer className={styles["footer"]}>
            <HStack>
                <Link 
                    href="https://github.com/leonardo-tx" 
                    aria-label="Ícone do Github" 
                    isExternal>
                    <IoLogoGithub size={32} />
                </Link>
            </HStack>
        </footer>
    );
}