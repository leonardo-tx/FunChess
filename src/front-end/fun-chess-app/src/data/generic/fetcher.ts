import ApiResponse from "@/core/responses/ApiResponse";

const baseUrl = `${process.env.apiProtocol}://${process.env.apiUrl}/Api/`;

type Method = "GET" | "POST" | "PUT" | "DELETE"

interface Props {
    method: Method;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    form?: any
}

export default async function fetcher<T>(path: string, { method, cache, credentials, form }: Props): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(baseUrl + path, {
            method,
            headers: { 'Accept': 'application/json, text/plain', 'Content-Type': 'application/json;charset=UTF-8' },
            mode: 'cors',
            cache,
            credentials,
            body: form === undefined || form === null ? null : JSON.stringify(form)
        });
        try {
            const data = await response.json();
            return { status: response.status, result: data.result, message: data.message };
        } catch {
            return { status: response.status }
        } 
    } catch (error) {
        console.log(error)
        return { status: -1 };
    }
}