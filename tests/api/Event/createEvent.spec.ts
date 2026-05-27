import { test, expect } from "../../../fixtures/ApiFixture"
import event from "../../../test_data/eventData.json"
import { CreateEventRequest } from "../../../api/models/Event/request/CreateEventRequest";
import { generateEventPayload } from "../../../utils/factories/eventFactory";
import { cleanupEvent } from "../../../utils/CleanUpHelper";

test.describe("Event API ", () => {
    test("@api-event should be able to create event", async ({ eventService }) => {

        const createPayload = generateEventPayload();

        // Attach request payload
        await test.info().attach("Create Event Payload",
            {
                body: JSON.stringify(createPayload, null, 2),
                contentType: "application/json"
            }
        );

        let eventId: number | undefined;
        try {
            const createResponse = await eventService.createEvent(createPayload);

            await test.info().attach("Create Event Response",
                {
                    body: JSON.stringify(createResponse.body, null, 2),
                    contentType: "application/json"
                }
            );

            expect(createResponse.status).toBe(201);

            if (createResponse.status === 201) {
                eventId = createResponse.body.data.id
                expect(createResponse.body.success).toBeTruthy();
                expect(createResponse.body.data.title).toBe(createPayload.title);

            }
        } finally {
            await cleanupEvent(eventService, eventId);
        }
    })

    test("@api-event shold display error for the invalid field title", async ({ eventService }) => {

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

        await test.info().attach("Create Event Payload",
            {
                body: JSON.stringify(payload, null, 2),
                contentType: "application/json"
            }
        );

        const createResponse = await eventService.createEvent(payload);
        expect(createResponse.status).toBe(400);

        await test.info().attach("Create Event Response", {
            body: JSON.stringify(createResponse.body, null, 2),
            contentType: "application/json"
        });


        if (createResponse.status === 400) {

            expect(createResponse.body.success).toBeFalsy();

            expect(createResponse.body.error).toBe("Validation failed");
            expect(createResponse.body.details[0].message).toBe("Title is required");
        }
    });

    test("@api-event should get the event by id ", async ({ eventService }) => {

        const createPayload = generateEventPayload();

        await test.info().attach("Creat Event Payload", {
            body: JSON.stringify(createPayload, null, 2),
            contentType: "application/json"
        })

        const createResponse = await eventService.createEvent(createPayload);

        expect(createResponse.status).toBe(201);

        await test.info().attach("Create Event Response", {
            body: JSON.stringify(createResponse.body, null, 2),
            contentType: "application/json"
        })

        if (createResponse.status !== 201) {
            throw new Error("Event creation failed");
        }

        const eventId = createResponse.body.data.id;

        try {
            const getResponse = await eventService.getEvent(eventId);

            await test.info().attach("Get Event Response", {
                body: JSON.stringify(getResponse.body, null, 2),
                contentType: "application/json"
            })

            expect(getResponse.status).toBe(200);

            if (getResponse.status === 200) {
                expect(getResponse.body.success).toBeTruthy();

                expect(getResponse.body.data.title).toBe(createPayload.title);
            }
        }
        finally {
            await cleanupEvent(eventService, eventId);
        }
    });

    test("@api-event should be able to update the event", async ({ eventService }) => {

        const createPayload = generateEventPayload();

        await test.info().attach("Creat Event Payload", {
            body: JSON.stringify(createPayload, null, 2),
            contentType: "application/json"
        })

        const createResponse = await eventService.createEvent(createPayload);

        await test.info().attach("Create Event Response", {
            body: JSON.stringify(createResponse.body, null, 2),
            contentType: "application/json"
        })

        expect(createResponse.status).toBe(201);

        if (createResponse.status !== 201) {
            throw new Error("Event creation failed");
        }

        const eventId = createResponse.body.data.id;
        const updatePayload = generateEventPayload();

        await test.info().attach("Update Event Payload", {
            body: JSON.stringify(updatePayload, null, 2),
            contentType: "application/json"
        })

        try {
            const updateResponse = await eventService.updateEvent(eventId, updatePayload);

            await test.info().attach("Update Event Response", {
                body: JSON.stringify(updateResponse.body, null, 2),
                contentType: "application/json"
            })

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.success).toBeTruthy();

            if (updateResponse.status === 200) {
                expect(updateResponse.body.data.title).toBe(updatePayload.title);
            }
        } finally {
            await cleanupEvent(eventService, eventId);
        }
    });

    test("@api-event should be able to delete the event", async ({ eventService }) => {

        const createPayload = generateEventPayload();

        await test.info().attach("Creat Event Payload", {
            body: JSON.stringify(createPayload, null, 2),
            contentType: "application/json"
        })

        const createResponse = await eventService.createEvent(createPayload);

        await test.info().attach("Create Event Response", {
            body: JSON.stringify(createResponse.body, null, 2),
            contentType: "application/json"
        })

        expect(createResponse.status).toBe(201);

        if (createResponse.status !== 201) {
            throw new Error("Event creation failed");
        }

        const eventId = createResponse.body.data.id;
        const deleteResponse = await eventService.deleteEvent(eventId);

        await test.info().attach("Delete Event Response", {
            body: JSON.stringify(deleteResponse.body, null, 2),
            contentType: "application/json"
        })

        expect(deleteResponse.body.success).toBeTruthy();
        expect(deleteResponse.status).toBe(200)

        if (deleteResponse.status === 200) {
            expect(deleteResponse.body.message).toBe("Event deleted successfully");
        }
    });
})