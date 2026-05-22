import { ApiErrorResponse } from "./ApiErrorResponse";
import { GetAllEventsSuccessResponse } from "./GetAllEventSuccessResponse";

export type GetAllEventApiResponse =

    | {
        status: 200;
        body: GetAllEventsSuccessResponse
    }
    | {
        status: 500;
        body: ApiErrorResponse;
    };