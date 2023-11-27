import { JSX, RefObject, useEffect, useRef } from "react";
import pawn from "../../assets/pieces/pawn.png";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Sidebar.module.css";
import { IoExitOutline, IoGameController, IoHome, IoInformationCircle } from "react-icons/io5";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import MenuLinkItem from "./MenuLinkItem";
import useAuth from "@/data/auth/hooks/useAuth";
import MenuListItem from "./MenuListItem";
import MenuButtonItem from "./MenuButtonItem";

interface Props {
    closed: boolean;
    onClose: () => void;
}

export default function Sidebar({ closed, onClose }: Props): JSX.Element {
    const { authenticated, currentAccount, logout } = useAuth();

    const ref = useRef<HTMLElement>(null);
    useHandleMouseDownEvent(ref, closed, onClose);

    let sidebarStyles = styles["sidebar"];
    if (closed) sidebarStyles += ` ${styles["sidebar-closed"]}`;

    return (
        <nav className={sidebarStyles} ref={ref}>
            <div className={styles["sidebar-header"]}>
                <Link href="/">
                    <Image alt="Logo do site" height={45} src={pawn} />
                </Link>
            </div>
            <ul className={styles["sidebar-menu"]}>
                {authenticated ? 
                    <>
                        <MenuLinkItem icon={<IoGameController />} href="/play" />
                        <MenuLinkItem icon={<FaUserGroup />} href="/friends" />
                        <MenuLinkItem icon={<FaUser />} href={`/profile?id=${currentAccount!.id}`} />
                        <MenuListItem closed={closed} icon={<BsThreeDots />}>
                            <MenuButtonItem 
                                icon={<IoExitOutline />} 
                                onClick={logout}
                            />
                        </MenuListItem>
                    </> :
                    <>
                        <MenuLinkItem icon={<IoHome />} href="/" />
                        <MenuLinkItem icon={<IoInformationCircle />} href="/about" />
                    </>
                }
            </ul>
        </nav>
    );
}

function useHandleMouseDownEvent(
    ref: RefObject<HTMLElement>,
    closed: boolean,
    onClose: () => void
): void {
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
    }, [closed])
}