import { atom } from "jotai";
import * as langStorage from "@/data/langs/storage/lang-storage";

const langAtom = atom<string>(langStorage.defaultCode);

export default langAtom;