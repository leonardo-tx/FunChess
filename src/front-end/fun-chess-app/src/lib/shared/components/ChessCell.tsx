"use client";

import Cell from "@/core/chess/Cell";
import Piece from "@/core/chess/Piece";
import styled from "@emotion/styled";
import { useMemo, useRef } from "react";
import { BOARD_LENGTH, BishopPiece, KingPiece, KnightPiece, PawnPiece, QueenPiece, RookPiece } from "@/core/chess/constants/board-constants";
import Team from "@/core/chess/enums/Team";
import { IconType } from "react-icons";
import { FaChessBishop, FaChessKing, FaChessKnight, FaChessPawn, FaChessQueen, FaChessRook } from "react-icons/fa6";
import Draggable, { DraggableBounds, DraggableEventHandler } from "react-draggable";

interface Props {
    index: number;
    active: boolean;
    pressed: boolean;
    dragSelected: boolean;
    chessBoard: { inverse: boolean, sizeBoard: number };
    cell: Cell
    onStart: (index: number) => void;
    onDrag: DraggableEventHandler;
    onStop: () => void;
    onClick: (index: number) => void;
}

export default function ChessCell({ index, active, pressed, dragSelected, chessBoard, cell, onStart, onDrag, onStop, onClick }: Props) {
    const ref = useRef<Draggable>(null);
    
    const { inverse, sizeBoard } = chessBoard;
    const PieceIcon = piecesVariants.get(Piece.toByte(cell.piece));

    const bounds: DraggableBounds = useMemo(() => {
        const sizePerCell = sizeBoard / BOARD_LENGTH;
        const halfSizeCell = sizePerCell / 2;

        const y = Math.floor(index / BOARD_LENGTH);
        const x = index % BOARD_LENGTH;

        return {
            top: (inverse ? BOARD_LENGTH - y : y + 1) * sizePerCell - sizeBoard - halfSizeCell / 2, 
            right: sizeBoard - (x + 1) * sizePerCell + halfSizeCell / 1.1, 
            left: (BOARD_LENGTH - x) * sizePerCell - sizeBoard - halfSizeCell,
            bottom: sizeBoard - (inverse ? y + 1 : BOARD_LENGTH - y) * sizePerCell + halfSizeCell / 2
        };
    }, [sizeBoard, index, inverse]);

    return (
        <Border $dragSelected={dragSelected}>
            <Container onClick={() => onClick(index)} $active={active} $index={index} $dragSelected={dragSelected}>
                {PieceIcon !== undefined && 
                    <Draggable 
                        ref={ref} 
                        disabled={!(!pressed || active)} 
                        onStart={() => onStart(index)} 
                        onStop={onStop} 
                        onDrag={onDrag} 
                        position={{ y: 0, x: 0 }}
                        bounds={bounds}
                    >
                        <PieceIcon 
                            strokeWidth="8px" 
                            stroke="black" 
                            color={cell.team === Team.White ? '#d1d1d1' : '#242424'}
                        />
                    </Draggable>}
            </Container>
        </Border>
    )
}

const Border = styled("div", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $dragSelected: boolean;
}>`
    aspect-ratio: 1 / 1;
    background-color: #ca4aa0;
    ${(props) => props.$dragSelected && "padding: 6%;"}
`;

const Container = styled("div", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $index: number;
    $active: boolean;
    $dragSelected: boolean;
}>`
    background-color: ${props => props.$active ? "#9545b4" : (props.$index + Math.floor(props.$index / 8)) % 2 === 0 ? "#5d45b4" : "#c5bbcc"};
    height: 100%;
    width: 100%;

    & svg {
        height: 100%;
        width: 100%;
        cursor: grab;
        padding: ${(props) => props.$dragSelected ? 4 : 10}%;
        ${props => props.$active && "z-index: 1;"}
        position: relative;
    }
`;

const piecesVariants = new Map<number, IconType>();

piecesVariants.set(Piece.toByte(PawnPiece), FaChessPawn);
piecesVariants.set(Piece.toByte(RookPiece), FaChessRook);
piecesVariants.set(Piece.toByte(KnightPiece), FaChessKnight);
piecesVariants.set(Piece.toByte(BishopPiece), FaChessBishop);
piecesVariants.set(Piece.toByte(QueenPiece), FaChessQueen);
piecesVariants.set(Piece.toByte(KingPiece), FaChessKing);