import { ApiErrorResponse } from "../../Common/ApiErrorResponse";
import { GetBookingByRefIdSuccess } from "./GetBookingByRefIdSuccess";

export type GetBookingByRefIdApiResponse =

    | {
        status: 200;
        body: GetBookingByRefIdSuccess;
    }

    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };