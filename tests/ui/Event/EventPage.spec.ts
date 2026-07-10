import { test, expect } from "../../../fixtures/ApiFixture";
import eventData from "../../../test_data/eventData.json";
import { cleanupEvent } from "../../../utils/CleanUpHelper";
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
            await expect (eventPage.noEventMessage).toBeVisible();

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
                const event =  createEventPage.getEventRow(eventData.iplFinals.title); 
                expect(event.root).toBeVisible();
                expect(event.getTitle()).toBe(eventData.iplFinals.title);

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

        test("@event @regression should display correct event details on booking page", async ({ authSetup, eventService, eventPage, createEventPage, eventBookingComponent }) => {

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
                expect (event.getTitle()).toBe(eventData.diwaliCarnival.title)

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

                const bookingEventPrice = await eventBookingComponent.getBookingEventPricePerTicket();
                const bookingEventSeats = await eventBookingComponent.getBookingEventSeats()
                const bookingEventCity = await eventBookingComponent.getBookingEventCity();
                const bookingEventVenue = await eventBookingComponent.getBookingEventVenue();

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

            test('@regression @event should be able to edit event created ', async ({ authSetup, eventService, eventPage, createEventPage }) => {

                let eventId: number | undefined;
                try {

                    await eventPage.goTo();
                    await eventPage.clickOnAddNewEvent();

                    await createEventPage.createEvent(eventData.rockConcert);
                    await expect(createEventPage.successMessage).toBeVisible();
                    await createEventPage.disMissToast();

                    const event = createEventPage.getEventRow(eventData.rockConcert.title);
                    await expect(event.root).toBeVisible();
                    expect(event.getTitle()).toBe(eventData.rockConcert.title);

                    //Get event id using helper  
                    eventId = await getEventIdByTitle(eventService, eventData.rockConcert.city, eventData.rockConcert.title)

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
                    await expect(updateEvent.getTitle()).toBe("Pro Leauge kabdi");
                } finally {
                    console.log(`befor clean up : ${eventId}`)
                    await cleanupEvent(eventService, eventId)
                }

            })

            test('@regression @event updating event seat to 0 should display an error message', async ({ authSetup, eventService, eventPage, createEventPage }) => {

                let eventId: number | undefined
                try {
                    await eventPage.goTo();
                    await eventPage.clickOnAddNewEvent();

                    await createEventPage.createEvent(eventData.diwaliCarnival);
                    const event = createEventPage.getEventRow(eventData.diwaliCarnival.title);    
                    
                    await expect(event.root).toBeVisible();

                    //Get event id using helper  
                    eventId = await getEventIdByTitle(eventService, eventData.diwaliCarnival.city, eventData.diwaliCarnival.title)

                    await event.edit();

                    await expect(createEventPage.editTitle).toBeVisible();

                    await createEventPage.fillSeats("0");

                    await createEventPage.clickOnUpdateEvent();
                    await expect(createEventPage.errorOnSeats).toBeVisible();
                } finally {
                    console.log(`befor clean up : ${eventId}`)
                    await cleanupEvent(eventService, eventId)
                }

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
                expect(event.getTitle()).toBe(eventData.rockConcert.title);

                await event.delete(); 
                const dialog = createEventPage.getDeleteDialog();
                expect (dialog.root).toBeVisible();
                await dialog.delete(); 
                await expect(event.root).toHaveCount(0);
            });

            test('@regression @event should be able to dismiss the cancel popup', async ({ authSetup, eventService, eventPage, createEventPage }) => {

                let eventId: number | undefined;
                try {
                    await eventPage.goTo();
                    await eventPage.clickOnAddNewEvent();

                    await createEventPage.createEvent(eventData.diwaliCarnival);
                    const event =  createEventPage.getEventRow(eventData.diwaliCarnival.title);
                    await expect(event.root).toBeVisible();

                    //Get event id using helper  
                    eventId = await getEventIdByTitle(eventService, eventData.diwaliCarnival.city, eventData.diwaliCarnival.title)

                    await event.delete();
                    const dialog = createEventPage.getDeleteDialog();
                    await dialog.cancel();
                    await expect(event.getTitle()).toBe(eventData.diwaliCarnival.title);

                }
                finally {
                    console.log(`befor clean up : ${eventId}`)
                    await cleanupEvent(eventService, eventId)
                }

            })

        })

    })
})
