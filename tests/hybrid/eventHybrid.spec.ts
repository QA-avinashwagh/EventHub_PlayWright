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
            const eventCard = eventPage.findEvent(payload.title);
            await expect(eventCard.root).toBeVisible();
             expect(eventCard.getPrice()).toBe(payload.price);

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
            const eventCard = eventPage.findEvent(updatePayload.title);
            await expect(eventCard.root).toBeVisible();
            expect(eventCard.getPrice).toBe(payload.price);
        } finally {
            await cleanupEvent(eventService, eventID);
        }
    })

    test('Should display correct detials on booking page created by API ', async ({ eventService, authSetup, eventPage, eventDetailPage }) => {

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
            const eventCard = eventPage.findEvent(response.body.data.title);
            await expect(eventCard.root).toBeVisible();
            await eventCard.book();
            expect(await eventDetailPage.getVenue()).toBe(payload.venue);
            expect(await eventDetailPage.getCity()).toBe(payload.city);
            expect(await eventDetailPage.getPricePerTicket()).toBe(payload.price);
            expect(await eventDetailPage.getTotalSeats()).toBe(payload.totalSeats);

        } finally {
            await cleanupEvent(eventService, eventId)
        }
    })

    test("should be able to delete the event created by API", async ({ eventService, authSetup, eventPage, createEventPage }) => {

        const payload = generateEventPayload();

        let eventID: number | undefined;

        const response = await eventService.createEvent(payload);

        expect(response.status).toBe(201);

        if (response.status !== 201) {
            throw new Error("Event creation failed")
        }

        eventID = response.body.data.id;

        await eventPage.goTo();
        expect(eventPage.findEvent(payload.title).root).toBeVisible();
        await eventPage.clickOnAddNewEvent();

        const eventRow = createEventPage.getEventRow(payload.title);
        await expect(eventRow.root).toBeVisible();

        await eventRow.delete();
        const dialog = createEventPage.getDeleteDialog();
        await dialog.delete();
        await expect(eventPage.findEvent(payload.title).root).toHaveCount(0);

    })

    test("should be able to book event created by API", async({eventService,authSetup, eventPage, eventDetailPage, myBookingPage})=>{

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
            const eventCard = eventPage.findEvent(payload.title);
            await expect(eventCard.root).toBeVisible();
            await eventCard.book();
            
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.book(user.Details.sarahUser.fullName, user.Details.sarahUser.email, user.Details.sarahUser.phoneNumber);

            await expect(bookingForm.bookingConfirmMessage).toBeVisible();
            const refId = await bookingForm.getBookingRefId();

            await bookingForm.viewBooking()

            const myBooking =  myBookingPage.findBooking(refId);
            const myBookingRefId = await myBooking.getBookingId();
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
                await expect(eventPage.findEvent(payload.title).root).toHaveCount(1);
                await expect(eventPage.findEvent(payload.title).root).toBeVisible();
            
            } finally {
                await cleanupEvent(eventService, eventId)
            }
        })






})