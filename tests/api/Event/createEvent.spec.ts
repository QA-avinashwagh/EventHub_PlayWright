import { test, expect } from "../../../fixtures/ApiFixture"
import event from "../../../test_data/eventData.json"
import { CreateEventRequest } from "../../../api/models/request/CreateEventRequest";


test("@api-event should be able to create event", async ({ eventService }) => {

    const payload: CreateEventRequest = {

        title: event.rockConcert.title,
        description: event.rockConcert.description,
        category: event.rockConcert.category,
        city: event.rockConcert.city,
        venue: event.rockConcert.venue,

        eventDate: event.rockConcert.dateAndTime,

        price: parseFloat(event.rockConcert.price),

        totalSeats: parseInt(event.rockConcert.seats),

        imageUrl: event.rockConcert.imageUrl
    };

    const resEvent = await eventService.createEvent(payload);

    expect(resEvent.success).toBeTruthy();
    if (resEvent.success) {
        expect(resEvent.data.title).toBe(event.rockConcert.title);
    }

})

test("@api-event shold displayed error for the invalid field title", async ({ eventService }) => {

    const payload: CreateEventRequest = {

        title: "",
        description: event.rockConcert.description,
        category: event.rockConcert.category,
        city: event.rockConcert.city,
        venue: event.rockConcert.venue,

        eventDate: event.rockConcert.dateAndTime,

        price: parseFloat(event.rockConcert.price),

        totalSeats: parseInt(event.rockConcert.seats),

        imageUrl: event.rockConcert.imageUrl
    };

    const resEvent = await eventService.createEvent(payload);

    expect(resEvent.success).toBeFalsy();

    if (!resEvent.success) {

        expect(resEvent.error).toBe("Validation failed");
        expect(resEvent.details.at(0)?.message).toBe("Title is required");
    }

})

test("@api-event should get the event by id ", async ({ eventService }) => {

    const response = await eventService.getEvent(2);

    expect(response.success).toBeTruthy();

    if (response.success) {
        expect(response.data.title).toBe("Hollywood Monsoon Night — Los Angeles");
    }
})


test("@api-event should be able to update the event", async ({ eventService }) => {

    const payload: CreateEventRequest = {

        title: "Startup Connect 2026",
        description: event.rockConcert.description,
        category: event.rockConcert.category,
        city: event.rockConcert.city,
        venue: event.rockConcert.venue,

        eventDate: event.rockConcert.dateAndTime,

        price: parseFloat(event.rockConcert.price),

        totalSeats: parseInt(event.rockConcert.seats),

        imageUrl: event.rockConcert.imageUrl
    };


    const response = await eventService.updateEvent(37851, payload);

    expect(response.success).toBeTruthy();

    if (response.success) {
        expect(response.data.title).toBe("Startup Connect 2026");
    }
}); 



test("@api-event should be able to delete the event", async({eventService})=>{

    const response = await eventService.deleteEvent(37849);

    expect(response.success).toBeTruthy();

    if (response.success) {
        expect(response.message).toBe("Event deleted successfully");
    }
});