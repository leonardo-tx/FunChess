import { getCurrentAccount } from "@/data/auth/fetchers/account-fetchers";
import accountAtom from "@/data/auth/atoms/accountAtom";
import { useSetAtom } from "jotai";
import { JSX, ReactNode, useEffect, useState } from "react";

interface Props {
    children: ReactNode
}

export function AuthProvider({ children }: Props): JSX.Element {
    const [complete, setComplete] = useState(false);
    const setCurrentAccount = useSetAtom(accountAtom);

    useEffect(() => {
        getCurrentAccount().then(data => {
            setCurrentAccount(data.result ?? null);
            setComplete(true);
        })
    }, [setCurrentAccount]);

    return (
        <>
            {complete && children}
        </>
    );
}