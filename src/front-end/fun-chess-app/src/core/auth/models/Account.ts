import FriendStatus from "@/core/friends/FriendStatus";

export default interface Account {
    id: number;
    username: string;
    creation: number;
    friendStatus: FriendStatus;
}