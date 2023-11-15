import { JSX } from "react";
import styles from "../styles/Sidebar.module.css";

interface Props {
    icon: JSX.Element;
    onClick: () => void;
}

export default function MenuButtonItem({ icon, onClick }: Props): JSX.Element {
    return (
        <li className={styles["sidebar-menu-item"]}>
            <button onClick={onClick}>
                {icon}
            </button>
        </li>
    );
}