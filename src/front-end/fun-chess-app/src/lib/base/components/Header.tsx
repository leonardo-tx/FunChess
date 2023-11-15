import { JSX } from "react";
import { FaBars } from "react-icons/fa6";
import styles from "../styles/Header.module.css";

interface Props {
    onOpen: () => void
}

export default function Header({ onOpen }: Props): JSX.Element {
    return (
        <header className={styles["header"]}>
            <button
                className={styles["sidebar-open-button"]} 
                onClick={onOpen}>
                <FaBars />
            </button> 
        </header>
    );
}