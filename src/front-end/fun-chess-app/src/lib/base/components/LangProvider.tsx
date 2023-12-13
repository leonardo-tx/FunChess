import langAtom from "@/data/langs/atoms/langAtom";
import { useSetAtom } from "jotai";
import { JSX, ReactNode, useEffect, useState } from "react";
import * as langStorage from "@/data/langs/storage/lang-storage";

interface Props {
    children: ReactNode;
}

export default function LangProvider({ children }: Props): JSX.Element {
    const [loading, setLoading] = useState(true);
    const setLangCode = useSetAtom(langAtom);

    useEffect(() => {
        setLangCode(() => {
            setLoading(false);
            return langStorage.getLanguageCode();
        })
    }, [setLangCode])
    
    return (
        <>{!loading && children}</>
    );
}