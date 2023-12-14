import langAtom from "@/data/langs/atoms/langAtom";
import { useAtom } from "jotai";
import { JSX, ReactNode, useEffect, useState } from "react";
import * as langStorage from "@/data/langs/storage/lang-storage";
import { usePathname } from "next/navigation";
import useLang from "@/data/langs/hooks/useLang";
import useTitle from "@/lib/shared/hooks/useTitle";

interface Props {
    children: ReactNode;
}

export default function LangProvider({ children }: Props): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [langCode, setLangCode] = useAtom(langAtom);
    const { t } = useLang();
    const [, setTitle] = useTitle("");
    const pathname = usePathname();

    useEffect(() => {
        const formattedPathName = pathname === '/' ? "home" : pathname.slice(1).replace('/', '-');
        setTitle(t(`titles.${formattedPathName}`));
    }, [langCode, pathname]);

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