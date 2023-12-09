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

export async function getAllInvites(): Promise<ApiResponse<Account[]>> {
    return fetcher(`${basePath}/Invites`, {
        method: "GET",
        credentials: "include"
    });
}

export async function invite(id: number): Promise<ApiResponse<undefined>> {
    return fetcher(`${basePath}/Invite/${id}`, {
        method: "POST",
        credentials: "include"
    });
}

export async function acceptInvite(id: number): Promise<ApiResponse<undefined>> {
    return fetcher(`${basePath}/Accept/${id}`, {
        method: "POST",
        credentials: "include"
    });
}

export async function declineInvite(id: number): Promise<ApiResponse<undefined>> {
    return fetcher(`${basePath}/Decline/${id}`, {
        method: "POST",
        credentials: "include"
    });
}

export async function unfriend(id: number): Promise<ApiResponse<undefined>> {
    return fetcher(`${basePath}/Unfriend/${id}`, {
        method: "POST",
        credentials: "include"
    });
}