import { StatusCodes } from "http-status-codes";

export default interface ApiResponse<TResult> {
    status: StatusCodes;
    result?: TResult;
    message?: string;
}