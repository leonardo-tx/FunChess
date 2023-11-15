import { extendTheme, type StyleFunctionProps, type ThemeConfig } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const styles = {
    global: (props: StyleFunctionProps) => ({
        body: {
            bg: mode("#ffffff", "#1c1d24")(props),
            color: mode("#111111", "#eeeeee")(props),
            fontFamily: "inherit"
        }
    })
};

const theme = extendTheme({ config, styles });

export default theme;