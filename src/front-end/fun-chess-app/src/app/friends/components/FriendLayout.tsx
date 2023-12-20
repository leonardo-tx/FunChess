"use client";

import styles from "../styles/Friends.module.css";
import { JSX, ReactNode } from "react";
import { FaMessage, FaUserGroup } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import FriendLinkItem from "./FriendLinkItem";
import useLang from "@/data/settings/hooks/useLang";

interface Props {
    children: ReactNode
}

export default function FriendLayout({ children }: Props): JSX.Element {
    const { t } = useLang();

    return (
        <div className={styles["layout"]}>
            <nav className={styles["friend-navigation"]}>
                <ul>
                    <FriendLinkItem icon={<FaUserGroup />} href="/friends" text={t("friends.friends-link")} />
                    <FriendLinkItem icon={<IoMail />} href="/friends/invites" text={t("friends.invites-link")} />
                    <FriendLinkItem icon={<FaMessage />} href="/friends/chat" text={t("friends.chat-link")} />
                </ul>       
            </nav>
            <section className={styles["friend-content"]}>
                {children}
            </section>
        </div>
    );
}