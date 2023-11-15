export default interface ApiResponse<TResult> {
    status: number;
    result?: TResult;
    message?: string;
}