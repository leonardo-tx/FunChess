"use client";

import { JSX } from "react";
import styles from "../styles/Friends.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
    icon: JSX.Element;
    href: string;
    text?: string;
}

export default function FriendLinkItem({ icon, href, text }: Props): JSX.Element {
    const pathname = usePathname();
    
    let itemStyles = styles["link-item"];
    if (pathname === href) itemStyles += ` ${styles["link-item-active"]}`;

    return (
        <li className={itemStyles}>
            <Link href={href}>
                {icon}
                {text && <p>{text}</p>}
            </Link>
        </li>
    );
}