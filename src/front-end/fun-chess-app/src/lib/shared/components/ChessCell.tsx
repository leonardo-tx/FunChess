"use client";

import Cell from "@/core/chess/Cell";
import Piece from "@/core/chess/Piece";
import styled from "@emotion/styled";
import { useMemo, useRef } from "react";
import { BOARD_LENGTH } from "@/core/chess/constants/board-constants";
import Team from "@/core/chess/enums/Team";
import { IconType } from "react-icons";
import { FaChessBishop, FaChessKing, FaChessKnight, FaChessPawn, FaChessQueen, FaChessRook } from "react-icons/fa6";
import Draggable, { DraggableBounds, DraggableEventHandler } from "react-draggable";
import Pawn from "@/core/chess/pieces/Pawn";
import Rook from "@/core/chess/pieces/Rook";
import Bishop from "@/core/chess/pieces/Bishop";
import King from "@/core/chess/pieces/King";
import Knight from "@/core/chess/pieces/Knight";
import Queen from "@/core/chess/pieces/Queen";
import { useAtomValue } from "jotai";
import settingsAtom from "@/data/settings/atoms/settingsAtom";

interface ChessBoardInfo {
    inverse: boolean;
    sizeBoard: number;
    disable: boolean;
    pressed: boolean;
    selectedCell: number | null;
    targetCell: number | null;
    removeOnMouseUp: boolean;
}

interface Props {
    index: number;
    chessBoard: ChessBoardInfo
    cell: Cell;
    canBeReplaced: boolean;
    onStart: (index: number) => void;
    onDrag: DraggableEventHandler;
    onStop: () => void;
    onClick: (index: number) => void;
}

export default function ChessCell({ index, chessBoard, cell, canBeReplaced, onStart, onDrag, onStop, onClick }: Props) {
    const ref = useRef<Draggable>(null);
    const settings = useAtomValue(settingsAtom);
    
    const { inverse, sizeBoard, disable, selectedCell, targetCell, pressed } = chessBoard;
    const active = selectedCell !== null && index === selectedCell;
    const dragSelected = targetCell !== null && index === targetCell;
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
            <Container $disable={disable} $active={active} $index={index} $dragSelected={dragSelected}>
                {settings.indicateMoves && PieceIcon === undefined && canBeReplaced && <PossibleTarget />}
                <Draggable
                    ref={ref} 
                    disabled={disable || cell.isEmpty() || !(!pressed || active)} 
                    onStart={() => onStart(index)} 
                    onStop={onStop} 
                    onDrag={onDrag} 
                    position={{ y: 0, x: 0 }}
                    bounds={bounds}
                >
                    <DraggableDiv onClick={() => onClick(index)} $isEmpty={cell.isEmpty()} $active={active} $disable={disable} $dragSelected={dragSelected}>
                        {PieceIcon !== undefined && <PieceIcon 
                            strokeWidth="8px" 
                            stroke={settings.indicateMoves && canBeReplaced ? '#b44589' : 'black'} 
                            color={cell.team === Team.White ? '#d1d1d1' : '#242424'}
                        />}
                    </DraggableDiv>
                </Draggable>
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
    $disable: boolean;
}>`
    background-color: ${props => props.$active ? "#9545b4" : (props.$index + Math.floor(props.$index / 8)) % 2 === 0 ? "#5d45b4" : "#c5bbcc"};
    height: 100%;
    width: 100%;
    position: relative;
`;

const DraggableDiv = styled("button", { shouldForwardProp: (propName) => propName !== 'theme' && !propName.startsWith("$")})<{
    $active: boolean;
    $dragSelected: boolean;
    $disable: boolean;
    $isEmpty: boolean;
}>`
    height: 100%;
    width: 100%;
    position: relative;
    cursor: ${(props) => props.$disable || props.$isEmpty ? "default" : "grab"};
    padding: ${(props) => props.$dragSelected ? 4.8 : 10}%;
    ${props => props.$active && "z-index: 1;"}

    & svg {
        height: 100%;
        width: 100%;
    }
`;

const PossibleTarget = styled.div`
    border-radius: 50%;
    background-color: #d87fa9;
    position: absolute;
    height: 20%;
    width: 20%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
`

const piecesVariants = new Map<number, IconType>();

piecesVariants.set(Piece.toByte(Pawn.instance), FaChessPawn);
piecesVariants.set(Piece.toByte(Rook.instance), FaChessRook);
piecesVariants.set(Piece.toByte(Knight.instance), FaChessKnight);
piecesVariants.set(Piece.toByte(Bishop.instance), FaChessBishop);
piecesVariants.set(Piece.toByte(Queen.instance), FaChessQueen);
piecesVariants.set(Piece.toByte(King.instance), FaChessKing);