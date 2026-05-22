import { EventService } from "../api/services/EventService";


export async function cleanupEvent(eventService: EventService, eventId?: number) {

    if (!eventId) {
        throw new Error(`event id not created : ${eventId}`)
    }
    try {
        await eventService.deleteEvent(eventId)
    } catch (error) {
        console.error(`clean up failed for event : ${eventId}`, error);
    }


}