import { EventClient } from "../clients/EventClient";
import { EventValidationErrorResponse } from "../models/response/EventValidationErrorResponse";
import { CreateEventRequest } from "../models/request/CreateEventRequest";
import { CreateEventSuccessResponse } from "../models/response/CreateEventSuccessResponse";
import { DeleteEventSuccessResponse } from "../models/response/DeleteEventSucessResponse";
import { ApiErrorResponse } from "../models/response/ApiErrorResponse";
import { GetEventSuccess } from "../models/response/GetEventSuccessResponse";
import { CreateEventApiResponse } from "../models/response/CreateEventApiResponse";
import { GetEventApiResponse } from "../models/response/GetEventApiResponse";
import { DeleteEventApiResponse } from "../models/response/DeleteEventApiResponse";
import { updateEventApiResponse } from "../models/response/updateEventApiResponse";

export class EventService {

    private eventClient: EventClient

    constructor(eventClient: EventClient) {
        this.eventClient = eventClient
    }

    async createEvent(eventData: CreateEventRequest): Promise<CreateEventApiResponse> {

        const response = await this.eventClient.createEvent(eventData);

        console.log(response.status());

        const status = response.status();

        if (status === 201) {
            return {
                status,
                body: await response.json() as CreateEventSuccessResponse
            }
        }
        else if (status === 400) {
            return {
                status,
                body: await response.json() as EventValidationErrorResponse
            }
        } else if (status === 401 || status === 404 || status === 500) {

            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }

    async getEvent(id: number): Promise<GetEventApiResponse> {

        const response = await this.eventClient.getEvent(id);

        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as GetEventSuccess
            }
        } else if (status === 401 || status === 404 || status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }

    async updateEvent(id: number, eventData: CreateEventRequest): Promise<updateEventApiResponse> {

        const response = await this.eventClient.updateEvent(id, eventData);

        console.log(response.status());
        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as CreateEventSuccessResponse
            }
        }
        else if (status === 400) {
            return {
                status,
                body: await response.json() as EventValidationErrorResponse
            }
        } else if (status === 401 || status === 404 || status === 500) {

            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }

    async deleteEvent(id: number): Promise<DeleteEventApiResponse> {

        const response = await this.eventClient.deleteEvent(id);
        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as DeleteEventSuccessResponse
            }
        } else if (status === 404 || status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }

    }

}