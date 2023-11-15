"use client";

import { ButtonHTMLAttributes, HTMLAttributes, JSX } from "react";
import styles from "../styles/Button.module.css";
import styled from "@emotion/styled";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    variant?: "solid" | "outline" | "ghost" | "link";
    colorScheme?: "gray" | "purple" | "cyan";
    as?: "button" | "a"
}

export default function Button({ variant = "solid", colorScheme = "gray", as, ...attributes }: Props): JSX.Element {
    const ButtonToUse = buttonMapper[variant];

    return (
        <ButtonToUse
            as={as}
            className={styles[colorScheme + '-' + variant]}
            {...attributes}
        />
    )
}

const InternalButton = styled("button")`
    cursor: pointer;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 1rem;
    min-width: 2.5rem;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    line-height: normal;
`;

const SolidButton = styled(InternalButton)`
    border: none;
`;

const OutlineButton = styled(InternalButton)`
    background-color: transparent;
`;

const GhostButton = styled(InternalButton)`
    border: none;
    background-color: transparent;
`;

const LinkButton = styled(InternalButton)`
    border: none;
    background-color: transparent;

    &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
    }
`;

const buttonMapper = { solid: SolidButton, outline: OutlineButton, ghost: GhostButton, link: LinkButton };