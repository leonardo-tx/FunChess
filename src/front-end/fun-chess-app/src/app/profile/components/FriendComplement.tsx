import Account from "@/core/auth/models/Account";
import FriendStatus from "@/core/friends/models/FriendStatus";
import useLang from "@/data/langs/hooks/useLang";
import { Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";
import { Dispatch, JSX, SetStateAction } from "react";
import { FaUser } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import * as friendshipFetcher from "@/data/friends/fetchers/friend-fetcher";

interface Props {
    account: Account
    setAccount: Dispatch<SetStateAction<Account | null>>
}

export default function FriendComplement({ account, setAccount }: Props): JSX.Element {
    const router = useRouter();
    const { t } = useLang();
    
    switch (account.friendStatus) {
        case FriendStatus.None:
            return (
                <Button 
                    onClick={() => friendshipFetcher.invite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Delivered});
                    })}>
                    {t("buttons.add-friend")}
                </Button>
            );
        case FriendStatus.Delivered:
            return <Text fontSize="sm">{t("profile.sent-request-text")}</Text>
        case FriendStatus.Received:
            return (
                <Button
                    onClick={() => friendshipFetcher.acceptInvite(account.id).then((response) => {
                        if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.Friends});
                    })}>
                    {t("buttons.accept-friend")}
                </Button>
            );
        case FriendStatus.Friends:
            return (
                <>
                    <Button onClick={() => router.push("/friends/chat")}>{t("buttons.send-message")}</Button>
                    <Accordion alignSelf="stretch" borderRadius="0.375rem" backgroundColor="#3d3c46" allowToggle>
                        <AccordionItem border="none">
                            <AccordionButton>
                                <IoIosMore />
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel padding={0} pb={4}>
                                <ButtonInsideAccordion onClick={() => friendshipFetcher.unfriend(account.id).then((response) => {
                                    if (response.status === StatusCodes.OK) setAccount({...account, friendStatus: FriendStatus.None});
                                })}>
                                    <FaUser />
                                    <Text fontSize="sm">{t("buttons.remove-friend")}</Text>
                                </ButtonInsideAccordion>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </>
            )
        default:
            return <></>
    }
}

const ButtonInsideAccordion = styled.button`
    width: 100%;
    padding: 5px 20px;
    display: flex;
    gap: 10px;
    align-items: center;

    &:hover {
        background-color: #ffffff1d;
    }
`