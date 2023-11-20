"use client"

import useAuth from "@/data/auth/hooks/useAuth";
import styled from "@emotion/styled";
import { redirect } from "next/navigation";
import { JSX, useEffect } from "react";
import DummyChessBoard from "./components/DummyChessBoard";
import GameSelection from "./components/GameSelection";
import useTitle from "@/lib/shared/hooks/useTitle";

export default function Play(): JSX.Element {
    const { authenticated } = useAuth();
    useTitle("Jogue Xadrez - FunChess");

    useEffect(() => {
        if (!authenticated) redirect("/login");
    }, [authenticated]);

    return (
        <Container>
            <DummyChessBoard />
            <GameSelection />
        </Container>
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