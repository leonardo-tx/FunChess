"use client";

import Board from "@/core/chess/Board";
import styled from "@emotion/styled";
import { JSX, useEffect, useState } from "react";
import LocalChessBoard from "../components/LocalChessBoard";
import useAuth from "@/data/auth/hooks/useAuth";
import { redirect } from "next/navigation";
import useTitle from "@/lib/shared/hooks/useTitle";

export default function LocalPlay(): JSX.Element {
    const { authenticated } = useAuth();
    const [board, setBoard] = useState(new Board());

    useTitle("Modo local - FunChess");

    useEffect(() => {
        if (!authenticated) redirect("/login");
    }, [authenticated]);
    
    return (
        <Container>
            <LocalChessBoard board={board} />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0px 3%;

    @media only screen and (max-width: 1024px) {
        padding: 2px 5px;
        flex-direction: column;
    }
`;