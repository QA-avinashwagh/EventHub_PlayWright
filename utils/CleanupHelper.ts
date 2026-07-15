import test from "@playwright/test";
import { EventService } from "../api/services/eventService";


export async function cleanupEvent(eventService: EventService, eventId?: number) {

    if (!eventId) {
        console.warn(`Clean up skipped : No event id avilable ${eventId}`);
        return;
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