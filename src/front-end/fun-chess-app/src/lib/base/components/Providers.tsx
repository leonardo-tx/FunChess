"use client";

import { Provider } from "jotai";
import { JSX, ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../settings/theme";
import SettingsProvider from "./SettingsProvider";

interface Props {
    children: ReactNode
}

export default function Providers({ children }: Props): JSX.Element {
    return (
        <Provider>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    <AuthProvider>
                        <SettingsProvider>
                            {children}
                        </SettingsProvider>
                    </AuthProvider>
                </ChakraProvider>
            </CacheProvider>
        </Provider>
    );
}