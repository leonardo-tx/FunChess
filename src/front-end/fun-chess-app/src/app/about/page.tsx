"use client";

import { JSX } from "react";
import { IoLogoGithub, IoMail } from "react-icons/io5";
import { SiReact, SiCsharp } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import styles from "./styles/About.module.css";
import { Heading, Text } from "@chakra-ui/react";
import useLang from "@/data/langs/hooks/useLang";

export default function About(): JSX.Element {
    const { t } = useLang();

    return (
        <section className={styles["about-main"]}>
            <section className={styles["about-section"]}>
                <Heading as="h2" size='lg'>{t("about.project-heading")}</Heading>
                <Text>{t("about.project-text")}</Text>
                <Text>{t("about.project-developed-by")}</Text>
            </section>
            <section className={styles["about-section"]}>
                <Heading as="h2" size='lg'>{t("about.used-tecnology-heading")}</Heading>
                <div className={styles["icon-row"]}>
                    <SiReact size={55} color="#43ced8" />
                    <Text>React</Text>
                </div>
                <div className={styles["icon-row"]}>
                    <SiCsharp size={55} color="#3cc24e" />
                    <Text>C#</Text>
                </div>
                <div className={styles["icon-row"]}>
                    <BiLogoTypescript size={55} color="#2f90ff" />
                    <Text>Typescript</Text>
                </div>
            </section>
            <section className={styles["about-section"]}>
                <Heading as="h2" size='lg'>{t("about.contacts-heading")}</Heading>
                <div className={styles["button-group"]}>
                    <a href="https://github.com/leonardo-tx" target="_blank">
                        <IoLogoGithub size={32} />
                        Github
                    </a>
                    <a href="mailto:leonardoregoteixeira@gmail.com">
                        <IoMail size={32} />
                        {t("inputs.email-placeholder")}
                    </a>
                </div>
            </section>
        </section>
    );
}