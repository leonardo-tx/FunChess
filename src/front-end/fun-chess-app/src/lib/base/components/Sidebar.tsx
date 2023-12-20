import { JSX, useEffect, useRef } from "react";
import pawn from "../../assets/pieces/pawn.png";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { IoExitOutline, IoGameController, IoHome, IoInformationCircle, IoSettings } from "react-icons/io5";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import MenuLinkItem from "./MenuLinkItem";
import useAuth from "@/data/auth/hooks/useAuth";
import MenuListItem from "./MenuListItem";
import MenuButtonItem from "./MenuButtonItem";
import useLang from "@/data/settings/hooks/useLang";

interface Props {
    closed: boolean;
    onClose: () => void;
}

export default function Sidebar({ closed, onClose }: Props): JSX.Element {
    const { authenticated, currentAccount, logout } = useAuth();
    const { t } = useLang();

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (closed) return;

        const mouseHandler = (e: MouseEvent): void => {
            const menuElement = ref.current;
            if (innerWidth <= 768 && menuElement != null && !menuElement.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', mouseHandler);
        return () => {
            document.removeEventListener('mousedown', mouseHandler);
        };
    }, [closed, onClose])

    let sidebarStyles = styles["sidebar"];
    if (closed) sidebarStyles += ` ${styles["sidebar-closed"]}`;

    return (
        <nav className={sidebarStyles} ref={ref}>
            <div className={styles["sidebar-header"]}>
                <Link href="/">
                    <Image alt={t("alt.brand-pawn")} height={45} src={pawn} />
                </Link>
            </div>
            <ul className={styles["sidebar-menu"]}>
                {authenticated ? 
                    <>
                        <MenuLinkItem icon={<IoGameController aria-label={t("alt.nav-icon-play")} />} href="/play" />
                        <MenuLinkItem icon={<FaUserGroup aria-label={t("alt.nav-icon-friends")} />} href="/friends" />
                        <MenuLinkItem icon={<FaUser aria-label={t("alt.nav-icon-profile")} />} href={`/profile?id=${currentAccount!.id}`} />
                        <MenuListItem closed={closed} icon={<BsThreeDots aria-label={t("alt.nav-icon-more")} />}>
                            <MenuButtonItem 
                                icon={<IoExitOutline aria-label={t("alt.nav-icon-logout")} />} 
                                onClick={logout}
                            />
                        </MenuListItem>
                    </> :
                    <>
                        <MenuLinkItem icon={<IoHome aria-label={t("alt.nav-icon-home")} />} href="/" />
                        <MenuLinkItem icon={<IoInformationCircle aria-label={t("alt.nav-icon-about")} />} href="/about" />
                    </>
                }
            </ul>
            <ul className={styles["sidebar-menu"]}>
                <MenuLinkItem icon={<IoSettings aria-label={t("alt.nav-icon-settings")} />} href="/settings" />
            </ul>
        </nav>
    );
}