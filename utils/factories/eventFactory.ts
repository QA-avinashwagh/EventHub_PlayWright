import { CreateEventRequest } from "../../api/models/request/CreateEventRequest";

export function generateEventPayload():

    CreateEventRequest {

    const uniqueId = Date.now();

    return {

        title: `Rock Concert ${uniqueId}`,

        description: "Music festival event",

        category: "Concert",

        venue: "Madison Square Garden",

        city: "Mumbai",

        eventDate: "2026-12-10",

        price: 2500,

        totalSeats: 500,

        imageUrl:
            "https://example.com/image.jpg"

    };

}