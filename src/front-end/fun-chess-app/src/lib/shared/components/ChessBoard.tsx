"use client";

import { BOARD_LENGTH, MAX_INDEX, MIN_INDEX } from "@/core/chess/constants/board-constants";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import ChessCell from "./ChessCell";
import styled from "@emotion/styled";
import { DraggableEventHandler } from "react-draggable";
import Move from "@/core/chess/structs/Move";
import Position from "@/core/chess/structs/Position";
import Board from "@/core/chess/Board";

interface Props {
    board: Board;
    onMove: (move: Move) => boolean;
    inverse?: boolean;
    disable?: boolean;
}

interface ChessBoardInfo {
    inverse: boolean;
    sizeBoard: number;
    disable: boolean;
    pressed: boolean;
    selectedCell: number | null;
    targetCell: number | null;
    removeOnMouseUp: boolean;
    cancelOnClick: boolean
}

export default function ChessBoard({ board, onMove, inverse = false, disable = false }: Props): JSX.Element {
    const [chessBoard, setChessBoard] = useState<ChessBoardInfo>({ 
        inverse: false, 
        sizeBoard: 0, 
        disable: false, 
        pressed: false, 
        selectedCell: null,
        targetCell: null,
        removeOnMouseUp: false,
        cancelOnClick: false
    });
    const { sizeBoard, selectedCell, targetCell, cancelOnClick } = chessBoard;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChessBoard((oldChessBoard) => ({...oldChessBoard, inverse, disable }));
    }, [inverse, disable])

    useEffect(() => {
        if (ref.current === null) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setChessBoard((oldChessBoard) => ({...oldChessBoard, sizeBoard: entry.contentRect.height}));
            }
        });
        resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, [])

    const onStart = useCallback((index: number): void => {
        setChessBoard((oldChessBoard) => {
            const { selectedCell } = oldChessBoard;
            const newInfo = {...oldChessBoard, pressed: true, cancelOnClick: false};
            if (selectedCell === index) {
                newInfo.removeOnMouseUp = true;
                return newInfo;
            }
            newInfo.selectedCell = index;
            return newInfo;
        });
    }, []);

    const onDrag: DraggableEventHandler = useCallback((_e, data) => {
        if (selectedCell === null) return;

        const sizePerCell = sizeBoard / BOARD_LENGTH;
        const halfSizeCell = sizePerCell / 2;

        const targetY = Math.floor(((inverse ? data.lastY : -data.lastY) + halfSizeCell) / sizePerCell) * BOARD_LENGTH;
        const targetX = Math.floor((data.lastX + halfSizeCell) / sizePerCell);

        const targetIndex = targetY + targetX + selectedCell;
        setChessBoard((oldChessBoard) => ({...oldChessBoard, targetCell: targetIndex }));
    }, [inverse, selectedCell, sizeBoard])

    const onStop = useCallback((): void => {
        let moveIsValid = false;
        if (selectedCell !== null && targetCell !== null) {
            const move = new Move(new Position(selectedCell), new Position(targetCell));
            moveIsValid = onMove(move);
        }
        if (moveIsValid) playAudio("move-self");
        
        setChessBoard((oldChessBoard) => {
            const { selectedCell, targetCell, removeOnMouseUp } = oldChessBoard;
            const newInfo = {...oldChessBoard, pressed: false, targetCell: null, cancelOnClick: true }
            if (moveIsValid || (removeOnMouseUp && targetCell === selectedCell)) {
                newInfo.selectedCell = null;
                newInfo.removeOnMouseUp = false;
            }
            return newInfo;
        });
        new Promise(r => {
            setTimeout(r, 1);
        }).then(() => setChessBoard((oldChessBoard) => ({...oldChessBoard, cancelOnClick: false})))
    }, [targetCell, selectedCell, onMove]);

    const onClick = useCallback((index: number): void => {
        if (cancelOnClick) {
            setChessBoard((oldChessBoard) => ({...oldChessBoard, cancelOnClick: !oldChessBoard.cancelOnClick}));
            return;
        }

        let moveIsValid = false;
        const cellIsEmpty = board.internalBoard[index].isEmpty();

        if (selectedCell !== null) {
            const move = new Move(new Position(selectedCell), new Position(targetCell !== null ? targetCell : index));
            moveIsValid = onMove(move);
        }
        if (moveIsValid) playAudio("move-self");

        setChessBoard((oldChessBoard) => {
            const { pressed, selectedCell, targetCell, removeOnMouseUp } = oldChessBoard;
            const newInfo = {...oldChessBoard, pressed: false, targetCell: null };
            
            if (selectedCell === null) {
                if (cellIsEmpty) return newInfo;

                newInfo.selectedCell = index;
                return newInfo;
            }
            if (targetCell !== null) {
                if (targetCell === selectedCell && removeOnMouseUp) {
                    newInfo.selectedCell = null;
                    newInfo.removeOnMouseUp = false;

                    return newInfo;
                }
                if (moveIsValid) newInfo.selectedCell = null;
                return newInfo;
            }
            
            if (moveIsValid || (pressed ? (removeOnMouseUp && index === selectedCell) : index === selectedCell)) {
                newInfo.selectedCell = null;
                newInfo.removeOnMouseUp = false;
            }
            return newInfo;
        });
    }, [onMove, selectedCell, targetCell, board, cancelOnClick])

    const elements: JSX.Element[] = [];

    for (let y = inverse ? MIN_INDEX : MAX_INDEX; inverse ? y < BOARD_LENGTH : y >= MIN_INDEX; inverse ? y++ : y--) {
        for (let x = 0; x < BOARD_LENGTH; x++) {
            const index = y * BOARD_LENGTH + x;
            elements.push(
                <ChessCell
                    canBeReplaced={selectedCell !== null && board.pieceCanMove(new Move(new Position(selectedCell), new Position(index)))}
                    onStart={onStart}
                    onStop={onStop}
                    onDrag={onDrag}
                    onClick={onClick}
                    chessBoard={chessBoard} 
                    index={index} 
                    key={index}
                    cell={board.internalBoard[index]}
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