import { JSX, ReactNode, useState } from "react";
import styles from "../styles/Sidebar.module.css";

interface Props {
    icon: JSX.Element;
    children: ReactNode;
    closed: boolean
}

export default function MenuListItem({ icon, closed, children }: Props): JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <li className={styles["sidebar-menu-list"]}>
            <div className={styles["sidebar-menu-item"]}>
                <button onClick={() => setOpen(!open)}>
                    {icon}
                </button>
            </div>
            <ul className={`${styles["sidebar-menu-list-box"]} ${!open ? styles["sidebar-menu-list-box-closed"] : ""} ${closed ? styles["sidebar-menu-list-box-closed-mobile"] : ""}`}>
                {children}
            </ul>
        </li>
    );
}