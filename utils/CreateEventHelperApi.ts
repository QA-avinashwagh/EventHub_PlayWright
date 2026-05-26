import test from "@playwright/test";
import { generateEventPayload } from "./factories/eventFactory";
import { EventService } from "../api/services/EventService";


export async function CreateEventByApi(eventService: EventService) {

    const createPayload = generateEventPayload();

    // Attach request payload
    await test.info().attach("Create Event Payload",
        {
            body: JSON.stringify(createPayload, null, 2),
            contentType: "application/json"
        }
    );

    const createResponse = await eventService.createEvent(createPayload);

    await test.info().attach("Create Event Response",
        {
            body: JSON.stringify(createResponse.body, null, 2),
            contentType: "application/json"
        }
    );

    return{
        eventPayload : createPayload, 
        eventResponse : createResponse
    }

}