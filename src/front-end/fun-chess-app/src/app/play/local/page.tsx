"use client";

import Board from "@/core/chess/Board";
import styled from "@emotion/styled";
import { JSX, useState } from "react";
import LocalChessBoard from "../components/LocalChessBoard";
import useTitle from "@/lib/shared/hooks/useTitle";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";

export default function LocalPlay(): JSX.Element {
    const [board, setBoard] = useState(new Board());

    useTitle("Modo local - FunChess");
    
    return (
        <AuthorizeProvider>
            <Container>
                <LocalChessBoard board={board} />
            </Container>
        </AuthorizeProvider>
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