import MenuLinkItem from "@/lib/base/components/MenuLinkItem";
import styled from "@emotion/styled";
import { JSX, ReactNode } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

interface Props {
    children: ReactNode
}

export default function FriendLayout({ children }: Props): JSX.Element {
    return (
        <Container>
            <FriendNav>
                <ul>
                    <MenuLinkItem icon={<FaUserGroup />} href="/friends" text="Amigos" />
                    <MenuLinkItem icon={<IoMail />} href="/friends/invites" text="Pedidos pendentes" />
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
    grid-template-columns: 280px 1fr;
    gap: 30px;
    padding: 10px;

    @media only screen and (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-rows: auto 1fr;
    }
`

const FriendNav = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 0 20px;

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