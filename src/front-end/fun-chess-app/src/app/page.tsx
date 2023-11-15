"use client"

import { JSX } from "react";
import Unauthorized from "./home/components/Unauthorized";
import useAuth from "@/data/auth/hooks/useAuth";
import Authorized from "./home/components/Authorized";

export default function Home(): JSX.Element {
    const { authenticated } = useAuth();
    
    return authenticated ? <Authorized /> : <Unauthorized />
}