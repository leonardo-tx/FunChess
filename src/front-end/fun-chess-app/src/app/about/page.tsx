"use client";

import { JSX } from "react";
import { IoLogoGithub, IoMail } from "react-icons/io5";
import { SiReact, SiCsharp } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import styles from "./styles/About.module.css";
import { Heading, Text } from "@chakra-ui/react";
import useLang from "@/data/langs/hooks/useLang";

export default function About(): JSX.Element {
    const { file } = useLang("about");

    return (
        <section className={styles["about-main"]}>
            <section className={styles["about-section"]}>
                <Heading as="h2" size='lg'>{file["project-heading"]}</Heading>
                <Text>{file["project-text"]}</Text>
                <Text>{file["developed-by"]}</Text>
            </section>
            <section className={styles["about-section"]}>
                <Heading as="h2" size='lg'>{file["used-tecnology-heading"]}</Heading>
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
                <Heading as="h2" size='lg'>{file["contacts-heading"]}</Heading>
                <div className={styles["button-group"]}>
                    <a href="https://github.com/leonardo-tx" target="_blank">
                        <IoLogoGithub size={32} />
                        Github
                    </a>
                    <a href="mailto:leonardoregoteixeira@gmail.com">
                        <IoMail size={32} />
                        {file["email-anchor"]}
                    </a>
                </div>
            </section>
        </section>
    );
}