import FriendStatus from "@/core/friends/models/FriendStatus";

export default interface Account {
    id: number;
    username: string;
    creation: number;
    friendStatus: FriendStatus;
}