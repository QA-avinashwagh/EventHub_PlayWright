import test from "@playwright/test";
import { EventService } from "../api/services/EventService";


export async function cleanupEvent(eventService: EventService, eventId?: number) {

    if (!eventId) {
        throw new Error(`event id not created : ${eventId}`)
    }
    try {
        const reseponse = await eventService.deleteEvent(eventId);

        test.info().attach("Event clean up response", {
            body: JSON.stringify(reseponse.body, null, 2),
            contentType: "application/json"
        }
        );

    } catch (error) {
        console.error(`clean up failed for event : ${eventId}`, error);
    }

}