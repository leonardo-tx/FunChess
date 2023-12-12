import useAuth from "@/data/auth/hooks/useAuth";
import MenuLinkItem from "@/lib/base/components/MenuLinkItem";
import styled from "@emotion/styled";
import { redirect } from "next/navigation";
import { JSX, ReactNode, useEffect } from "react";
import { FaMessage, FaUserGroup } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

interface Props {
    children: ReactNode
}

export default function FriendLayout({ children }: Props): JSX.Element {
    const { authenticated } = useAuth();

    useEffect(() => {
        if (!authenticated) redirect("/login");
    }, [authenticated]);


    return (
        <Container>
            <FriendNav>
                <ul>
                    <MenuLinkItem icon={<FaUserGroup />} href="/friends" text="Amigos" />
                    <MenuLinkItem icon={<IoMail />} href="/friends/invites" text="Pedidos pendentes" />
                    <MenuLinkItem icon={<FaMessage />} href="/friends/chat" text="Chat" />
                </ul>       
            </FriendNav>
            <Content>
                {children}
            </Content>
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: calc(100vh - 32px - 20px);
    grid-template-columns: auto 1fr;
    gap: 30px;
    padding: 10px;
    max-height: calc(100vh - 32px);

    @media only screen and (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-rows: auto 1fr;
    }
`

const FriendNav = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    max-height: 100%;

    & ul {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    @media only screen and (max-width: 768px) {
        flex-direction: row;
        
        & ul {
            flex-direction: row;
        }
    }
`

const Content = styled.section`
    display: flex;
    flex-direction: column;
    padding-right: 20%;
    gap: 12px;

    @media only screen and (max-width: 768px) {
        padding-right: 0;
    }
`;