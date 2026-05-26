import { ApiErrorResponse } from "./ApiErrorResponse";
import { CreateBookingResponse } from "./CreateBookingResponse";

export type GetBookingByRefIdApiResponse =

    | {
        status: 200;
        body: CreateBookingResponse;
    }

    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };