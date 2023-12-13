const storageKey = "lang-code";
export const defaultCode = "en";

const validCodes = new Set<string>();
validCodes.add("pt-BR");
validCodes.add("en");
validCodes.add("ja-JP");

export function getLanguageCode(): string {
    const storedCode = localStorage.getItem(storageKey);
    if (storedCode === null || !validCodes.has(storedCode)) return getSupportedLanguageCode();

    return storedCode;
}

function getSupportedLanguageCode(): string {
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

    localStorage.setItem(storageKey, code);
    return true;
}