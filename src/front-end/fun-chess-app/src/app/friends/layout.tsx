import { JSX, ReactNode } from "react";
import FriendLayout from "./components/FriendLayout";
import AuthorizeProvider from "@/lib/shared/components/AuthorizeProvider";

interface Props {
    children: ReactNode;
}

export default function FriendsLayout({ children }: Props): JSX.Element {
    return (
        <AuthorizeProvider>
            <FriendLayout>
                {children}
            </FriendLayout>
        </AuthorizeProvider>
    );
}