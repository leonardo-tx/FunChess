import settingsAtom from "@/data/settings/atoms/settingsAtom";
import { useSetAtom } from "jotai";
import { JSX, ReactNode, useEffect, useState } from "react";
import * as settingsStorage from "@/data/settings/storage/settings-storage";
import { usePathname } from "next/navigation";
import useLang from "@/data/settings/hooks/useLang";
import useTitle from "@/lib/shared/hooks/useTitle";

interface Props {
    children: ReactNode;
}

export default function SettingsProvider({ children }: Props): JSX.Element {
    const [loading, setLoading] = useState(true);
    const setSettings = useSetAtom(settingsAtom);
    const { t } = useLang();
    const [, setTitle] = useTitle("");
    const pathname = usePathname();

    useEffect(() => {
        const formattedPathName = pathname === '/' ? "home" : pathname.slice(1).replace('/', '-');
        setTitle(t(`titles.${formattedPathName}`));
    }, [t, pathname, setTitle]);

    useEffect(() => {
        setSettings((defaultSettings) => {
            setLoading(false);
            return {...defaultSettings, ...settingsStorage.getSettings()};
        })
    }, [setSettings])
    
    return (
        <>{!loading && children}</>
    );
}