import ApiResponse from "@/core/responses/ApiResponse";
import LoginForm from "../../../core/auth/forms/LoginForm";
import RegisterForm from "../../../core/auth/forms/RegisterForm";
import fetcher from "@/data/generic/fetcher";
import UpdateForm from "@/core/auth/forms/UpdateForm";

const basePath = "Auth";

export async function loginAccount(form: LoginForm): Promise<ApiResponse<undefined>> {
    return await fetcher(`${basePath}/Login`, { 
        method: "POST",
        form,
        credentials: "include"
    });
}

export async function registerAccount(form: RegisterForm): Promise<ApiResponse<undefined>> {
    return await fetcher(`${basePath}/Register`, {
        method: "POST",
        form
    });
}

export async function logoutAccount(): Promise<ApiResponse<undefined>> {
    return await fetcher(`${basePath}/Logout`, {
        method: "POST",
        credentials: "include"
    });
}

export async function updateAccount(form: UpdateForm): Promise<ApiResponse<undefined>> {
    return await fetcher(`${basePath}/Update`, {
        method: "PUT",
        form,
        credentials: "include"
    });
}

export async function deleteAccount(form: UpdateForm): Promise<ApiResponse<undefined>> {
    return await fetcher(`${basePath}/Delete`, {
        method: "DELETE",
        form,
        credentials: "include"
    });
}