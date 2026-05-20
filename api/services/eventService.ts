import { EventClient } from "../clients/EventClient";
import { EventValidationError } from "../models/response/EventValidationErrorResponse";
import { CreateEventRequest } from "../models/request/CreateEventRequest";
import { CreateEventSuccessResponse } from "../models/response/CreateEventSuccessResponse";
import { DeleteEventSuccessResponse } from "../models/response/DeleteEventSucessResponse";
import { ApiErrorResponse } from "../models/response/ApiErrorResponse ";
import { GetEventSuccess } from "../models/response/GetEventSuccessResponse";

export class EventService {

    private eventClient: EventClient

    constructor(eventClient: EventClient) {
        this.eventClient = eventClient
    }

    async createEvent(eventData: CreateEventRequest) {

        const response = await this.eventClient.createEvent(eventData);

        console.log(response.status());

        const status = response.status();

        if (status === 201) {

            return await response.json() as CreateEventSuccessResponse;
        }

        if (status === 400) {

            return await response.json() as EventValidationError;
        }

        if (status === 401 || status === 404 || status === 500) {
            return await response.json() as ApiErrorResponse;
        }

        throw new Error(`Unexpected status code: ${status}`);
    }

    async getEvent(id: number) {

        const response = await this.eventClient.getEvent(id);

        const status = response.status();

        if (status === 200) {
            return await response.json() as GetEventSuccess;
        }
        if (status === 401 || status === 404 || status === 500) {
            return await response.json() as ApiErrorResponse;
        }

        throw new Error(`Unexpected status code: ${status}`);

    }

    async updateEvent(id: number, eventData: CreateEventRequest) {


        const response = await this.eventClient.updateEvent(id, eventData);

        console.log(response.status());

        const status = response.status();

        if (status === 200) {

            return await response.json() as CreateEventSuccessResponse;
        }

        if (status === 400) {

            return await response.json() as EventValidationError;
        }

        if (status === 401 || status === 404 || status === 500) {
            return await response.json() as ApiErrorResponse;
        }

        throw new Error(`Unexpected status code: ${status}`);

    }

    async deleteEvent(id: number) {

        const response = await this.eventClient.deleteEvent(id);

        console.log(response.url());

        const data = await response.json() as DeleteEventSuccessResponse | ApiErrorResponse

        console.log(response.status());

        const status = response.status();

        if (status === 200) {

            return await response.json() as DeleteEventSuccessResponse;
        }
        if (status === 404 || status === 500) {
            return await response.json() as ApiErrorResponse;
        }

        throw new Error(`Unexpected status code: ${status}`);
    }



}