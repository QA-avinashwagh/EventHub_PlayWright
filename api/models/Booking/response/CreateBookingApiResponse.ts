import { ApiErrorResponse } from "../../Common/ApiErrorResponse";
import { BookingValidationErrorRsponse } from "./BookingValidationErrorResponse";
import { CreateBookingResponse } from "./CreateBookingResponse";

export type CreateBookingApiResponse =

    | {
        status: 201;
        body: CreateBookingResponse;
    }

    | {
        status: 400;
        body: BookingValidationErrorRsponse;
    }

    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };