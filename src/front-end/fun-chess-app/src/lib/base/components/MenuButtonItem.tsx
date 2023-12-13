import { JSX } from "react";
import styles from "../styles/Sidebar.module.css";

interface Props {
    icon?: JSX.Element;
    onClick: () => void;
    text?: string
}

export default function MenuButtonItem({ icon, onClick, text }: Props): JSX.Element {
    return (
        <li className={styles["sidebar-menu-item"]}>
            <button onClick={onClick}>
                {icon}
                {text && <p>{text}</p>}
            </button>
        </li>
    );
}