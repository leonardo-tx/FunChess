import { JSX } from "react";
import pawn from "../../../lib/assets/pieces/pawn.png";
import Image from "next/image";
import { Button, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import styles from "../styles/Unauthorized.module.css";
import useLang from "@/data/langs/hooks/useLang";

export default function Unauthorized(): JSX.Element {
    const router = useRouter();
    const { t } = useLang();

    return (
        <section className={styles["home-main"]}>
            <VStack textAlign="center">
                <Image alt={t("alt.brand-pawn")} src={pawn} />
                <Heading as="h1" size="xl">{t("home.unauthorized-heading")}</Heading>
            </VStack>
            <div className={styles["button-group"]}>
                <Button colorScheme="purple" onClick={() => router.push("/register")}>
                    {t("buttons.register")}
                </Button>
                <Button colorScheme="purple" variant="outline" onClick={() => router.push("/login")}>
                    {t("buttons.login")}
                </Button>
            </div>
        </section>
    );
}