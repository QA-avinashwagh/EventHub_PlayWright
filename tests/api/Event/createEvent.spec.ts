import { test, expect } from "../../../fixtures/ApiFixture"
import user from "../../../test_data/loginUser.json"
import event from "../../../test_data/eventData.json"
import { CreateEventRequest } from "../../../api/models/CreateEventRequest";


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
    if(resEvent.success){
        expect(resEvent.data.title).toBe(event.rockConcert.title);
    }

})

test("@api-event shold displayed error for the invalid field title", async({eventService})=>{

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
    
    if(!resEvent.success){

        expect(resEvent.error).toBe("Validation failed"); 
        expect(resEvent.details.at(0)?.message).toBe("Title is required");
    }


})