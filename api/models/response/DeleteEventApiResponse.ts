import { ApiErrorResponse } from "./ApiErrorResponse";
import { DeleteEventSuccessResponse } from "./DeleteEventSucessResponse";

export type DeleteEventApiResponse =

    | {
        status: 200;
        body: DeleteEventSuccessResponse
    }
    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
    };