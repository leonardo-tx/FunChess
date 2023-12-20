"use client";

import { Checkbox, Heading, Select, VStack } from "@chakra-ui/react";
import { ChangeEventHandler, JSX } from "react";
import { FaLanguage } from "react-icons/fa6";
import useLang from "@/data/settings/hooks/useLang";
import useAuth from "@/data/auth/hooks/useAuth";
import AccountSettingsSection from "./components/AccountSettingsSection";
import { useAtom } from "jotai";
import settingsAtom from "@/data/settings/atoms/settingsAtom";
import Settings from "@/core/settings/Settings";
import * as settingsStorage from "@/data/settings/storage/settings-storage";

export default function Settings(): JSX.Element {
    const { t, setLangCode, langCode } = useLang();
    const { authenticated } = useAuth();
    const [settings, setSettings] = useAtom(settingsAtom);

    const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setLangCode(e.target.value);
    }

    return (
        <VStack alignItems="stretch" spacing={20} p={8}>
            <VStack spacing={5} as="section">
                <Heading size="lg">{t("settings.language-heading")}</Heading>
                <Select onChange={onLanguageChange} defaultValue={langCode} icon={<FaLanguage />} maxW="500px">
                    <option value="en">English</option>
                    <option value="pt-BR">Português (BR)</option>
                    <option value="ja-JP">日本語</option>
                </Select>
            </VStack>
            <VStack spacing={5} as="section">
                <Heading size="lg">{t("settings.accessibility-heading")}</Heading>
                <Checkbox isChecked={settings.indicateMoves} onChange={() => setSettings((oldSettings) => {
                    const newSettings: Settings = {...oldSettings, indicateMoves: !oldSettings.indicateMoves };
                    settingsStorage.setSettings(newSettings);

                    return newSettings;
                })}>{t("inputs.indicate-piece-movement")}</Checkbox>
            </VStack>
            {authenticated && <AccountSettingsSection />}
        </VStack>
    );
}