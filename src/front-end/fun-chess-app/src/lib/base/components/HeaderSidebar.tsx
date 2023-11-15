"use client";

import { JSX, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function HeaderSidebar(): JSX.Element {
    const [closed, setClosed] = useState(true);

    return (
        <>
            <Header onOpen={() => setClosed(false)} />
            <Sidebar onClose={() => setClosed(true)} closed={closed} />
        </>
    );
}