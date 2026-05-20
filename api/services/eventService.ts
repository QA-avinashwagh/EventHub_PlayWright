import { EventClient } from "../clients/EventClient";
import { CreateEventFailure } from "../models/CreateEventFailure";
import { CreateEventRequest } from "../models/CreateEventRequest";
import { CreateEventSuccessResponse } from "../models/CreateEventSuccessResponse";

export class EventService {

    private eventClient: EventClient

    constructor(eventClient: EventClient) {
        this.eventClient = eventClient
    }

    async createEvent(eventData : CreateEventRequest) {

        const response = await this.eventClient.createEvent(eventData);

        console.log(response.status()); 
        console.log(response.url());

        const data = await response.json() as CreateEventSuccessResponse | CreateEventFailure;

        return data; 

    }

}