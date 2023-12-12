"use client"

import { JSX, useEffect } from "react";
import Unauthorized from "./home/components/Unauthorized";
import useAuth from "@/data/auth/hooks/useAuth";
import Authorized from "./home/components/Authorized";
import { redirect } from "next/navigation";
import useTitle from "@/lib/shared/hooks/useTitle";

export default function Home(): JSX.Element {
    const { authenticated } = useAuth();

    useTitle("Home - FunChess");

    useEffect(() => {
        if (authenticated) redirect("/play");
    }, [authenticated])
    
    return authenticated ? <Authorized /> : <Unauthorized />
}