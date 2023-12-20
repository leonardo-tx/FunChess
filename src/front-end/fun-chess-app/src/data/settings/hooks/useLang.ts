import { useAtom } from "jotai"
import settingsAtom from "../atoms/settingsAtom";
import { useCallback, useEffect, useMemo } from "react";
import * as settingsStorage from "@/data/settings/storage/settings-storage";
import formatString from "@/lib/shared/utils/formatString";

export default function useLang(): { 
    t: (key: string, ...args: any[]) => string, 
    langCode: string, 
    setLangCode: (code: string) => void 
} {
    const [settings, setSettings] = useAtom(settingsAtom);

    const file = useMemo(() => {
        if (settings.langCode === settingsStorage.defaultCode) return require(`@/lib/assets/langs/${settings.langCode}/translations.json`);
        return {
            ...require(`@/lib/assets/langs/${settingsStorage.defaultCode}/translations.json`),
            ...require(`@/lib/assets/langs/${settings.langCode}/translations.json`) 
        };
    }, [settings]);

    useEffect(() => {
        document.documentElement.lang = settings.langCode ?? settingsStorage.defaultCode;
    }, [settings])

    const setLangCodeHook = (code: string): void => {
        if (!settingsStorage.setLanguageCode(code)) return;
        setSettings(settings => ({...settings, langCode: code}));
    }

    const t = useCallback((key: string, ...args: any[]): string => {
        const splitedKey = key.split('.');
        
        let value = file;
        splitedKey.forEach((splitKey) => value = value[splitKey]);

        return args.length === 0 ? value : formatString(value, args);
        
    }, [file])

    return { t, langCode: settings.langCode, setLangCode: setLangCodeHook }
}