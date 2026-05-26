import { GetEventSuccess } from "./GetEventSuccessResponse";
import { ApiErrorResponse } from "../../Common/ApiErrorResponse";

export type GetEventApiResponse =

  | {
    status: 200;
    body: GetEventSuccess;

  }
  | {
    status: 404 | 500;
    body: ApiErrorResponse;
  };

