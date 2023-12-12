import styles from "../styles/Friends.module.css";
import { JSX, ReactNode } from "react";
import { FaMessage, FaUserGroup } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";
import FriendLinkItem from "./FriendLinkItem";

interface Props {
    children: ReactNode
}

export default function FriendLayout({ children }: Props): JSX.Element {
    return (
        <AuthorizeProvider>
            <div className={styles["layout"]}>
                <nav className={styles["friend-navigation"]}>
                    <ul>
                        <FriendLinkItem icon={<FaUserGroup />} href="/friends" text="Amigos" />
                        <FriendLinkItem icon={<IoMail />} href="/friends/invites" text="Pedidos pendentes" />
                        <FriendLinkItem icon={<FaMessage />} href="/friends/chat" text="Chat" />
                    </ul>       
                </nav>
                <section className={styles["friend-content"]}>
                    {children}
                </section>
            </div>
        </AuthorizeProvider>
    );
}