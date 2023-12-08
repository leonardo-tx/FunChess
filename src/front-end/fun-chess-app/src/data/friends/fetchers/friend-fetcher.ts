import Account from "@/core/auth/models/Account";
import ApiResponse from "@/core/responses/ApiResponse";
import fetcher from "@/data/generic/fetcher";

const basePath = "Friendships";

export async function getAll(): Promise<ApiResponse<Account[]>> {
    return fetcher(basePath, {
        method: "GET",
        credentials: "include"
    });
}