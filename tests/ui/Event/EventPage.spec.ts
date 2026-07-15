import { test, expect } from "../../../fixtures/ApiFixture";
import eventData from "../../../test_data/eventData.json";
import { cleanupEvent } from "../../../utils/CleanupHelper";
import { getEventIdByTitle } from "../../../utils/factories/getEventHelper";

test.describe('Event page ', () => {

    test.describe('Event searching and filtering ', () => {
        test("@event @regression should be able to search with valid data ", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();
            await eventPage.searchEvent(eventData.defaultSummit.title);
            const event = eventPage.findEvent(eventData.defaultSummit.title);
            await expect(event.root).toBeVisible();
        });

        test("@event @regression should display no results for invalid search", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();
            await eventPage.searchEvent("Tech123NonExists");
            await expect(eventPage.noEventMessage).toBeVisible();

        });

        test("@event @regression should filter events using search, category, and city", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();

            await eventPage.searchEvent(eventData.defaultSummit.title);
            await eventPage.filterCategory(eventData.defaultSummit.category);
            await eventPage.filterCity(eventData.defaultSummit.city);

            await eventPage.waitForResultToLoad();
            const event = eventPage.findEvent(eventData.defaultSummit.title)
            await expect(event.root).toHaveCount(1);
            await expect(event.root).toBeVisible();
        })

    });

    test.describe('Event Creation', () => {
        test("@event @regression should be able to create event with valid required data", async ({ authSetup, eventService, eventPage, createEventPage }) => {

            let eventId: number | undefined;
            try {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await expect(createEventPage.title).toBeVisible();

                await createEventPage.createEvent(eventData.iplFinals);

                await expect(createEventPage.successMessage).toBeVisible();

                //Get event id using helper  
                eventId = await getEventIdByTitle(eventService, eventData.iplFinals.city, eventData.iplFinals.title)

                await expect(createEventPage.allEventTitles).toBeVisible();
                const event = createEventPage.getEventRow(eventData.iplFinals.title);
                await expect(event.root).toBeVisible();
                expect(await event.getTitle()).toBe(eventData.iplFinals.title);

            } finally {
                console.log(`before clean up : ${eventId}`)
                await cleanupEvent(eventService, eventId)
            }
        });

        test("@event @regression should be able to display an error on required field", async ({ authSetup, eventPage, createEventPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnAddNewEvent();

            await createEventPage.clickOnAddEvent();

            await expect(createEventPage.errorOnTitle).toBeVisible();
            await expect(createEventPage.errorOnCity).toBeVisible();
            await expect(createEventPage.errorOnDate).toBeVisible();
            await expect(createEventPage.errorOnPrice).toBeVisible();
            await expect(createEventPage.errorOnVenue).toBeVisible();
            await expect(createEventPage.errorOnSeats).toBeVisible();
        });

        test("@event @regression should display correct event details on booking page", async ({ authSetup, eventService, eventPage, createEventPage, eventDetailPage }) => {

            let eventId: number | undefined;
            try {
                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await expect(createEventPage.title).toBeVisible();

                await createEventPage.createEvent(eventData.diwaliCarnival);

                await expect(createEventPage.successMessage).toBeVisible();

                await expect(createEventPage.allEventTitles).toBeVisible();
                const event = createEventPage.getEventRow(eventData.diwaliCarnival.title);
                await expect(event.root).toBeVisible();
                expect(await event.getTitle()).toBe(eventData.diwaliCarnival.title)

                //Get event id using helper  
                eventId = await getEventIdByTitle(eventService, eventData.diwaliCarnival.city, eventData.diwaliCarnival.title);

                await eventPage.goTo();
                const diwaliEvent = eventPage.findEvent(eventData.diwaliCarnival.title)
                 
                const eventPrice = await diwaliEvent.getPrice();
                const availableEventSeats = await diwaliEvent.getAvailableSeats()

                const actualPrice = parseFloat(eventData.diwaliCarnival.price);
                const actualSeats = parseInt(eventData.diwaliCarnival.seats)

                expect(eventPrice).toBe(actualPrice);
                expect(availableEventSeats).toBe(actualSeats);

                await diwaliEvent.book();

                const bookingEventPrice = await eventDetailPage.getPricePerTicket();
                const bookingEventSeats = await eventDetailPage.getTotalSeats();
                const bookingEventCity = await eventDetailPage.getCity();
                const bookingEventVenue = await eventDetailPage.getVenue();

                expect(bookingEventPrice).toBe(actualPrice);
                expect(bookingEventSeats).toBe(actualSeats);
                expect(bookingEventCity).toBe(eventData.diwaliCarnival.city);
                expect(bookingEventVenue).toBe(eventData.diwaliCarnival.venue);
            } finally {
                console.log(`befor clean up : ${eventId}`)
                await cleanupEvent(eventService, eventId)
            }
        });

        test.describe("Edit Event", () => {

            test('@regression @event should be able to edit event created ', async ({ authSetup, eventResource, eventService, eventPage, createEventPage }) => {

                //Navigetting to create page 
                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                const event = createEventPage.getEventRow(eventResource.title);
                await expect(event.root).toBeVisible();
                expect(await event.getTitle()).toBe(eventResource.title);

                await event.edit();

                await expect(createEventPage.editTitle).toBeVisible();

                await createEventPage.fillTitle("Pro Leauge kabdi");
                await createEventPage.fillVenu("Indoor stadium pune");

                await createEventPage.fillPrice("500");
                await createEventPage.fillSeats("5");

                await createEventPage.updateCategory("Sports");

                await createEventPage.clickOnUpdateEvent();
                await expect(createEventPage.updateMessage).toBeVisible();

                const updateEvent = createEventPage.getEventRow("Pro Leauge kabdi");
                await expect(updateEvent.root).toBeVisible();
                expect(await updateEvent.getTitle()).toBe("Pro Leauge kabdi");
            })

            test('@regression @event updating event seat to 0 should display an error message', async ({ authSetup, eventResource, eventService, eventPage, createEventPage }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();


                const event = createEventPage.getEventRow(eventResource.title);

                await expect(event.root).toBeVisible();
                expect(await event.getTitle()).toBe(eventResource.title);

                await event.edit();

                await expect(createEventPage.editTitle).toBeVisible();

                await createEventPage.fillSeats("0");

                await createEventPage.clickOnUpdateEvent();
                await expect(createEventPage.errorOnSeats).toBeVisible();

            })

        })

        test.describe('Event Delete', () => {

            test("@event @regression should be able to delete the event after created", async ({ authSetup, eventPage, createEventPage }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await createEventPage.createEvent(eventData.rockConcert);
                const event = createEventPage.getEventRow(eventData.rockConcert.title);
                await expect(event.root).toBeVisible();

                await expect(createEventPage.successMessage).toBeVisible();
                await createEventPage.disMissToast();

                await expect(createEventPage.allEventTitles).toBeVisible();
                expect(await event.getTitle()).toBe(eventData.rockConcert.title);

                await event.delete();
                const dialog = createEventPage.getDeleteDialog();
                await expect( dialog.root).toBeVisible();
                await dialog.delete();
                await expect(event.root).toHaveCount(0);
            });

            test('@regression @event should be able to dismiss the cancel popup', async ({ authSetup, eventService, eventPage, createEventPage }) => {

                let eventId: number | undefined;
                try {
                    await eventPage.goTo();
                    await eventPage.clickOnAddNewEvent();

                    await createEventPage.createEvent(eventData.diwaliCarnival);
                    const event = createEventPage.getEventRow(eventData.diwaliCarnival.title);
                    await expect(event.root).toBeVisible();

                    //Get event id using helper  
                    eventId = await getEventIdByTitle(eventService, eventData.diwaliCarnival.city, eventData.diwaliCarnival.title)

                    await event.delete();
                    const dialog = createEventPage.getDeleteDialog();
                    await dialog.cancel();
                    expect(await event.getTitle()).toBe(eventData.diwaliCarnival.title);
                }
                finally {
                    console.log(`befor clean up : ${eventId}`)
                    await cleanupEvent(eventService, eventId)
                }

            })

        })

    })
})
