import { ApiErrorResponse } from "../../Common/ApiErrorResponse";
import { DeleteEventSuccessResponse } from "../../Booking/response/DeleteEventSucessResponse";

export type DeleteEventApiResponse =

    | {
        status: 200;
        body: DeleteEventSuccessResponse
    }
    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };