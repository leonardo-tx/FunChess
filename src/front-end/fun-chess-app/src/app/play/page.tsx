"use client"

import useAuth from "@/data/auth/hooks/useAuth";
import styled from "@emotion/styled";
import { JSX } from "react";
import DummyChessBoard from "./components/DummyChessBoard";
import GameSelection from "./components/GameSelection";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";

export default function Play(): JSX.Element {
    return (
        <AuthorizeProvider>
            <Container>
                <DummyChessBoard />
                <GameSelection />
            </Container>
        </AuthorizeProvider>
    );
}

const Container = styled.div`
    display: flex;
    padding: 0px 3%;
    gap: 4em;
    height: 100%;
    align-items: center;

    @media only screen and (max-width: 1024px) {
        flex-direction: column-reverse;
        padding: 2px 5px;
    }
`;