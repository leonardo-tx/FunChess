import Message from "@/core/friends/models/Message";
import ApiResponse from "@/core/responses/ApiResponse";
import fetcher from "@/data/generic/fetcher";

const basePath = "Messages";

export async function getAll(friendId: number): Promise<ApiResponse<Message[]>> {
    return fetcher(`${basePath}/${friendId}`, {
        method: "GET",
        credentials: "include"
    });
}