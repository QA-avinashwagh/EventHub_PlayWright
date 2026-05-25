import { ApiErrorResponse } from "./ApiErrorResponse";
import { GetAllBookingEvent } from "./GetAllBookingEvent";

export type GetAllBookingEventApiResponse =

    | {
        status: 200;
        body: GetAllBookingEvent
    }
    | {
        status: 500;
        body: ApiErrorResponse;
    };



