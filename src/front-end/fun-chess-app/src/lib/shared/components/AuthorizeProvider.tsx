"use client";

import useAuth from "@/data/auth/hooks/useAuth";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface Props {
    children: ReactNode
}

export default function AuthorizeProvider({ children }: Props): JSX.Element {
    const { authenticated } = useAuth();

    useEffect(() => {
        if (!authenticated) redirect("/login");
    }, [authenticated])

    return (
        <>
            {authenticated && children}
        </>
    );
}