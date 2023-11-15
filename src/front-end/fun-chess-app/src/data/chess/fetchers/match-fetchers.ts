import ApiResponse from "@/core/responses/ApiResponse";
import fetcher from "@/data/generic/fetcher";

const basePath = "Match";

export async function atMatch(): Promise<ApiResponse<boolean>> {
    return fetcher(`${basePath}/AtMatch`, { 
        method: "GET", 
        credentials: "include" 
    });
}