import Account from "@/core/auth/models/Account";
import CurrentAccount from "@/core/auth/models/CurrentAccount";
import ApiResponse from "@/core/responses/ApiResponse";
import fetcher from "@/data/generic/fetcher";

const basePath = "Account";

export async function getSimpleAccount(id: number): Promise<ApiResponse<Account>> {
    return await fetcher(`${basePath}/${id}`, {
        method: "GET",
        credentials: "include"
    });
}

export async function getCurrentAccount(): Promise<ApiResponse<CurrentAccount>> {
    return await fetcher(basePath, {
        method: "GET",
        credentials: "include"
    });
}