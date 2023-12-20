import Settings from "@/core/settings/Settings";

const storageKey = "settings";
export const defaultCode = "en";

const validCodes = new Set<string>();
validCodes.add("pt-BR");
validCodes.add("en");
validCodes.add("ja-JP");

export function getSupportedLanguageCode(): string {
    const navigatorLanguage = navigator.language;
    const languageCode = navigatorLanguage.slice(0, 2);

    switch (languageCode) {
        case "pt":
            return "pt-BR";
        default:
            return defaultCode;
    }
}

export function setLanguageCode(code: string): boolean {
    if (!validCodes.has(code)) return false;

    localStorage.setItem(storageKey, JSON.stringify({...getSettings(), langCode: code}));
    return true;
}


export function getSettings(): Settings {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
}

export function setSettings(settings: Settings): void {
    localStorage.setItem(storageKey, JSON.stringify(settings));
}