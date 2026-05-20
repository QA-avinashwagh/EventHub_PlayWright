import { test, expect } from "@playwright/test"
import { AuthClient } from "../../../api/clients/AuthClient"
import { AuthService } from "../../../api/services/loginService";
import user from "../../../test_data/loginUser.json"
import { EventClient } from "../../../api/clients/EventClient";
import { EventService } from "../../../api/services/eventService";
import event from "../../../test_data/eventData.json"
import { CreateEventRequest } from "../../../api/models/CreateEventRequest";


test("@api-event should be able to create event", async ({ request }) => {

    const authClient = new AuthClient(request);
    const authService = new AuthService(authClient);

    const response = await authService.login(user.validUser1.email, user.validUser1.password)

    const token = response.token;

    const eventClient = new EventClient(request, token);

    const eventService = new EventService(eventClient);

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

test("@api-event shold displayed error for the invalid field title", async({request})=>{

    const authClient = new AuthClient(request);
    const authService = new AuthService(authClient);

    const response = await authService.login(user.validUser1.email, user.validUser1.password)

    const token = response.token;

    const eventClient = new EventClient(request, token);

    const eventService = new EventService(eventClient);

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