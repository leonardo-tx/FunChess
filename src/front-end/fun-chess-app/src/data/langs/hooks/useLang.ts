import { useAtom } from "jotai"
import langAtom from "../atoms/langAtom";
import { useEffect, useMemo } from "react";
import * as langStorage from "@/data/langs/storage/lang-storage";

export default function useLang(fileName: string): { file: any, langCode: string, setLangCode: (code: string) => void } {
    const [langCode, setLangCode] = useAtom(langAtom);

    const file = useMemo(() => {
        try {
            return require(`@/lib/assets/langs/${langCode}/${fileName}.json`);
        } catch {
            return require(`@/lib/assets/langs/${langStorage.defaultCode}/${fileName}.json`);
        }
    }, [langCode, fileName]);

    useEffect(() => {
        document.documentElement.lang = langCode ?? langStorage.defaultCode;
    }, [langCode])

    useEffect(() => {
        const title = file.title;
        if (!title) return;

        document.title = `${title} - FunChess`;
    }, [file])

    const setLangCodeHook = (code: string) => {
        if (!langStorage.setLanguageCode(code)) return;
        setLangCode(code);
    }

    return { file, langCode: langCode ?? langStorage.defaultCode, setLangCode: setLangCodeHook }
}