import { ApiErrorResponse } from "../../Common/ApiErrorResponse";
import { DeleteEventSuccessResponse } from "./DeleteEventSucessResponse";

export type DeleteBookingApiResponse =
    | {
        status: 200;
        body: DeleteEventSuccessResponse
    }
    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };