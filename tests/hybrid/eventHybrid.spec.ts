import { expect, test } from "../../fixtures/ApiFixture";
import { generateEventPayload } from "../../utils/factories/eventFactory";
import { cleanupEvent } from "../../utils/CleanUpHelper";
import user from "../../test_data/bookingUserDetails.json";

test.describe("API+UI", () => {
    test("Should display API-created event in event listing UI", async ({ eventService, authSetup, eventPage }) => {

        const payload = generateEventPayload();

        let eventID: number | undefined;

        try {
            const response = await eventService.createEvent(payload);

            expect(response.status).toBe(201);

            if (response.status !== 201) {
                throw new Error("Event creation failed")
            }

            eventID = response.body.data.id;

            await eventPage.goTo();
            expect(eventPage.getEventCard(payload.title)).toBeVisible();
            expect(await eventPage.getEventPrice(payload.title)).toBe(payload.price);

        } finally {
            await cleanupEvent(eventService, eventID);
        }
    });

    test("Should display updated event in event listing created and updated by API", async ({ eventService, authSetup, eventPage }) => {

        const payload = generateEventPayload();
        let eventID: number | undefined;
        try {
            const response = await eventService.createEvent(payload);

            expect(response.status).toBe(201);

            if (response.status !== 201) {
                throw new Error("Event creation failed")
            }
            eventID = response.body.data.id;

            const updatePayload = generateEventPayload();
            await eventService.updateEvent(eventID, updatePayload)

            await eventPage.goTo();
            expect(eventPage.getEventCard(updatePayload.title)).toBeVisible();
            expect(await eventPage.getEventPrice(updatePayload.title)).toBe(payload.price);
        } finally {
            await cleanupEvent(eventService, eventID);
        }
    })

    test('Should display correct detials on booking page created by API ', async ({ eventService, authSetup, eventPage, eventBookingComponent }) => {

        const payload = generateEventPayload();

        let eventId: number | undefined;

        try {
            const response = await eventService.createEvent(payload);

            expect(response.status).toBe(201);

            if (response.status !== 201) {
                throw new Error("Event creation failed")
            }

            eventId = response.body.data.id;

            await eventPage.goTo();
            await expect(eventPage.getEventCard(payload.title)).toBeVisible();
            await eventPage.clickOnBookTickets(payload.title);
            expect(await eventBookingComponent.getBookingEventVenue()).toBe(payload.venue);
            expect(await eventBookingComponent.getBookingEventCity()).toBe(payload.city);
            expect(await eventBookingComponent.getPricePerTicket()).toBe(payload.price);
            expect(await eventBookingComponent.getBookingEventSeats()).toBe(payload.totalSeats);

        } finally {
            await cleanupEvent(eventService, eventId)
        }
    })

    test("should be able to delete the event created by APi", async ({ eventService, authSetup, eventPage, eventFormComponent }) => {

        const payload = generateEventPayload();

        let eventID: number | undefined;

        const response = await eventService.createEvent(payload);

        expect(response.status).toBe(201);

        if (response.status !== 201) {
            throw new Error("Event creation failed")
        }

        eventID = response.body.data.id;

        await eventPage.goTo();
        expect(eventPage.getEventCard(payload.title)).toBeVisible();
        await eventPage.clickOnAddNewEvent();

        await expect(eventFormComponent.getEventRow(payload.title)).toBeVisible();

        await eventFormComponent.deleteEvent(payload.title);
        await eventFormComponent.clickOnConfirmDelete();
        await expect(eventFormComponent.getEventRow(payload.title)).toHaveCount(0);

    })

    test("should be able to book event created by API", async({eventService,authSetup, eventPage, eventBookingComponent, myBookingPage})=>{

        const payload = generateEventPayload();

        let eventId: number | undefined;

        try {
            const response = await eventService.createEvent(payload);

            expect(response.status).toBe(201);

            if (response.status !== 201) {
                throw new Error("Event creation failed")
            }

            eventId = response.body.data.id;

            await eventPage.goTo();
            await expect(eventPage.getEventCard(payload.title)).toBeVisible();
            await eventPage.clickOnBookTickets(payload.title);
            
            await eventBookingComponent.addBookingDetails(user.Details.sarahUser.fullName, user.Details.sarahUser.email, user.Details.sarahUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();
            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            const myBookingRefId = await myBookingPage.getRefernceId(refId);
            expect(refId).toBe(myBookingRefId);

        } finally {
            await cleanupEvent(eventService, eventId)
        }
    })

        test("should be able to search and filter event created by API", async({eventService,authSetup, eventPage})=>{

            const payload = generateEventPayload();

            let eventId: number | undefined;

            try {
                const response = await eventService.createEvent(payload);

                expect(response.status).toBe(201);

                if (response.status !== 201) {
                    throw new Error("Event creation failed")
                }

                eventId = response.body.data.id;

                await eventPage.goTo();
                await eventPage.searchEvent(payload.title);
                await eventPage.filterCategory(payload.category);
                await eventPage.filterCity(payload.city);

                await eventPage.waitForResultToLoad();
                await expect(eventPage.getEventCard(payload.title)).toHaveCount(1);
                await expect(eventPage.getEventCard(payload.title)).toBeVisible();
            
            } finally {
                await cleanupEvent(eventService, eventId)
            }
        })






})