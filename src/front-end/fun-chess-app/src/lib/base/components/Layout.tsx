import { JSX, type ReactNode } from "react";
import Main from "./Main";
import styles from "../styles/Layout.module.css";
import HeaderSidebar from "./HeaderSidebar";

interface Props {
    children?: ReactNode
}

export default function Layout({ children }: Props): JSX.Element {
    return (
        <div className={styles["layout"]}>
            <HeaderSidebar />
            <Main>{children}</Main>
        </div>
    );
}