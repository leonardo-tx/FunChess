import { atom } from "jotai";
import * as settingsStorage from "@/data/settings/storage/settings-storage";
import Settings from "@/core/settings/Settings";


const settingsAtom = atom<Settings>({ 
    langCode: settingsStorage.getSupportedLanguageCode(), 
    indicateMoves: true
});

export default settingsAtom;