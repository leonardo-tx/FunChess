import { atom } from "jotai";
import CurrentAccount from "@/core/auth/models/CurrentAccount";

const accountAtom = atom<CurrentAccount | null>(null);

export default accountAtom;