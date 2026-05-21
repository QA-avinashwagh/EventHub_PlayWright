import { CreateEventSuccessResponse } from "./CreateEventSuccessResponse";
import { EventValidationErrorResponse } from "./EventValidationErrorResponse";
import { ApiErrorResponse } from "./ApiErrorResponse";

export type updateEventApiResponse =

    | {
        status: 200;
        body: CreateEventSuccessResponse;
      }

    | {
        status: 400;
        body: EventValidationErrorResponse;
      }

    | {
        status: 401 | 404 | 500;
        body: ApiErrorResponse;
      };




