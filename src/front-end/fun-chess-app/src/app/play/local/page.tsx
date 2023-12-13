"use client";

import Board from "@/core/chess/Board";
import styled from "@emotion/styled";
import { JSX, useState } from "react";
import LocalChessBoard from "../components/LocalChessBoard";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";
import useLang from "@/data/langs/hooks/useLang";

export default function LocalPlay(): JSX.Element {
    const [board, setBoard] = useState(new Board());

    useLang("play/local")
    
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