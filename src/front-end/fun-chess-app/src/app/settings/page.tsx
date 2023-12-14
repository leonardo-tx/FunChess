"use client";

import { Heading, Select, VStack } from "@chakra-ui/react";
import { ChangeEventHandler, JSX } from "react";
import { FaLanguage } from "react-icons/fa6";
import useLang from "@/data/langs/hooks/useLang";

export default function Settings(): JSX.Element {
    const { t, setLangCode, langCode } = useLang();

    const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setLangCode(e.target.value);
    }

    return (
        <VStack alignItems="stretch" spacing={4} p={8}>
            <VStack as="section">
                <Heading size="lg">{t("settings.language-heading")}</Heading>
                <Select onChange={onLanguageChange} defaultValue={langCode} icon={<FaLanguage />} maxW="500px">
                    <option value="en">English</option>
                    <option value="pt-BR">Português (BR)</option>
                    <option value="ja-JP">日本語</option>
                </Select>
            </VStack>
        </VStack>
    );
}