import { JSX, ReactNode } from "react";
import FriendLayout from "./components/FriendLayout";

interface Props {
    children: ReactNode;
}

export default function FriendsLayout({ children }: Props): JSX.Element {
    return (
        <FriendLayout>
            {children}
        </FriendLayout>
    );
}