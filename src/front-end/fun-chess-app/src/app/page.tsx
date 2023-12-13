"use client"

import { JSX, useEffect } from "react";
import Unauthorized from "./home/components/Unauthorized";
import useAuth from "@/data/auth/hooks/useAuth";
import Authorized from "./home/components/Authorized";
import { redirect } from "next/navigation";

export default function Home(): JSX.Element {
    const { authenticated } = useAuth();

    useEffect(() => {
        if (authenticated) redirect("/play");
    }, [authenticated])
    
    return authenticated ? <Authorized /> : <Unauthorized />
}