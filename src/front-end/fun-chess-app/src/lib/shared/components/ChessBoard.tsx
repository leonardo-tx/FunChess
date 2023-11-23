"use client";

import { BOARD_LENGTH, MAX_INDEX, MIN_INDEX } from "@/core/chess/constants/board-constants";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import ChessCell from "./ChessCell";
import styled from "@emotion/styled";
import Cell from "@/core/chess/Cell";
import { DraggableEventHandler } from "react-draggable";
import Move from "@/core/chess/structs/Move";
import Position from "@/core/chess/structs/Position";

interface Props {
    board: Cell[];
    onMove: (move: Move) => boolean;
    inverse?: boolean;
    disable?: boolean;
}

export default function ChessBoard({ board, onMove, inverse = false, disable = false }: Props): JSX.Element {
    const [chessBoard, setChessBoard] = useState({ inverse: false, sizeBoard: 0, disable: false });
    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [targetCell, setTargetCell] = useState<number | null>(null);
    const [pressed, setPressed] = useState(false);
    const [removeOnMouseUp, setRemoveOnMouseUp] = useState(false);
    const [sizeBoard, setSizeBoard] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChessBoard({ inverse, sizeBoard, disable });
    }, [inverse, sizeBoard, disable, setChessBoard])

    useEffect(() => {
        if (ref.current === null) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setSizeBoard(entry.contentRect.height);
            }
        });
        resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, [])

    const onStart = useCallback((index: number): void => {
        setPressed(true);
        if (selectedCell === index) {
            setRemoveOnMouseUp(true);
            return;
        }
        setSelectedCell(index);
    }, [selectedCell]);

    const onDrag: DraggableEventHandler = useCallback((_e, data) => {
        if (selectedCell === null) return;

        const sizePerCell = sizeBoard / BOARD_LENGTH;
        const halfSizeCell = sizePerCell / 2;

        const targetY = Math.floor(((inverse ? data.lastY : -data.lastY) + halfSizeCell) / sizePerCell) * BOARD_LENGTH;
        const targetX = Math.floor((data.lastX + halfSizeCell) / sizePerCell);

        const targetIndex = targetY + targetX + selectedCell;
        setTargetCell(targetIndex);
    }, [selectedCell, inverse, sizeBoard])

    const onStop = useCallback((): void => {
        let moveIsValid = false;
        if (selectedCell !== null && targetCell !== null) {
            const move = new Move(new Position(selectedCell), new Position(targetCell));
            moveIsValid = onMove(move);
        }
        if (moveIsValid || (removeOnMouseUp && targetCell === selectedCell)) {
            setSelectedCell(null);
            setRemoveOnMouseUp(false);
        }
        if (moveIsValid) playAudio("move-self");
        
        setPressed(false);
        setTargetCell(null);
    }, [removeOnMouseUp, selectedCell, targetCell, onMove]);

    const onClick = useCallback((index: number): void => {
        let moveIsValid = false;
        if (selectedCell !== null) {
            const move = new Move(new Position(selectedCell), new Position(index));
            moveIsValid = onMove(move);
        }
        if (moveIsValid || (removeOnMouseUp && index === selectedCell)) {
            setSelectedCell(null);
            setRemoveOnMouseUp(false);
        }
        if (moveIsValid) playAudio("move-self");
    }, [selectedCell, removeOnMouseUp, onMove])

    const elements: JSX.Element[] = [];

    for (let y = inverse ? MIN_INDEX : MAX_INDEX; inverse ? y < BOARD_LENGTH : y >= MIN_INDEX; inverse ? y++ : y--) {
        for (let x = 0; x < BOARD_LENGTH; x++) {
            const index = y * BOARD_LENGTH + x;
            elements.push(
                <ChessCell
                    onStart={onStart}
                    onStop={onStop}
                    onDrag={onDrag}
                    onClick={onClick}
                    chessBoard={chessBoard} 
                    index={index} 
                    key={index}
                    cell={board[index]}
                    active={selectedCell !== null && index === selectedCell}
                    dragSelected={targetCell !== null && index === targetCell}
                    pressed={pressed}
                />
            );
        }
    }

    return (
        <GridBoard ref={ref}>
            {elements}
        </GridBoard>
    )
}

async function playAudio(sound: string): Promise<void> {
    const audioContext = new (window.AudioContext)();
    const response = await fetch(`/sounds/${sound}.webm`);
    const data = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    source.connect(audioContext.destination);
    source.start();
    setTimeout(() => source.disconnect(), 2000);
}

const GridBoard = styled("div")`
    display: grid;
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: repeat(8, 1fr);
    grid-area: board;
    width: clamp(0px, min(100%, 85vh), 790px);
    position: relative;
    aspect-ratio: 1 / 1;
    user-select: none;
`;