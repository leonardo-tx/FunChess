import { useAtom } from "jotai"
import langAtom from "../atoms/langAtom";
import { useEffect, useMemo } from "react";
import * as langStorage from "@/data/langs/storage/lang-storage";
import formatString from "@/lib/shared/utils/formatString";

export default function useLang(): { 
    t: (key: string, ...args: any[]) => string, 
    langCode: string, 
    setLangCode: (code: string) => void 
} {
    const [langCode, setLangCode] = useAtom(langAtom);

    const file = useMemo(() => {
        if (langCode === langStorage.defaultCode) return require(`@/lib/assets/langs/${langCode}/translations.json`);
        return {
            ...require(`@/lib/assets/langs/${langStorage.defaultCode}/translations.json`),
            ...require(`@/lib/assets/langs/${langCode}/translations.json`) 
        };
    }, [langCode]);

    useEffect(() => {
        document.documentElement.lang = langCode ?? langStorage.defaultCode;
    }, [langCode])

    const setLangCodeHook = (code: string): void => {
        if (!langStorage.setLanguageCode(code)) return;
        setLangCode(code);
    }

    const t = (key: string, ...args: any[]): string => {
        const splitedKey = key.split('.');
        
        let value = file;
        splitedKey.forEach((splitKey) => value = value[splitKey]);

        return args.length === 0 ? value : formatString(value, args);
        
    }

    return { t, langCode, setLangCode: setLangCodeHook }
}