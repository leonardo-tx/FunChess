import { JSX } from "react";
import { usePathname } from "next/navigation";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";

interface Props {
    icon?: JSX.Element;
    href: string;
    text?: string;
}

export default function MenuLinkItem({ icon, href, text }: Props): JSX.Element {
    const pathname = usePathname();
    
    let itemStyles = styles["sidebar-menu-item"];
    if (pathname === href) itemStyles += ` ${styles["active"]}`;

    return (
        <li className={itemStyles}>
            <Link href={href}>
                {icon}
                {text && <p>{text}</p>}
            </Link>
        </li>
    );
}