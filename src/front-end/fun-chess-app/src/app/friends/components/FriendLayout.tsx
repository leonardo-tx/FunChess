"use client";

import styles from "../styles/Friends.module.css";
import { JSX, ReactNode } from "react";
import { FaMessage, FaUserGroup } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import FriendLinkItem from "./FriendLinkItem";
import useLang from "@/data/langs/hooks/useLang";

interface Props {
    children: ReactNode
}

export default function FriendLayout({ children }: Props): JSX.Element {
    const { file } = useLang("friends/layout");

    return (
        <div className={styles["layout"]}>
            <nav className={styles["friend-navigation"]}>
                <ul>
                    <FriendLinkItem icon={<FaUserGroup />} href="/friends" text={file["friends-link"]} />
                    <FriendLinkItem icon={<IoMail />} href="/friends/invites" text={file["invites-link"]} />
                    <FriendLinkItem icon={<FaMessage />} href="/friends/chat" text={file["chat-link"]} />
                </ul>       
            </nav>
            <section className={styles["friend-content"]}>
                {children}
            </section>
        </div>
    );
}