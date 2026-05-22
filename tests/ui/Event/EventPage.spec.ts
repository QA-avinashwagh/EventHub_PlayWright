import { test, expect } from "../../../fixtures/ApiFixture";
import eventData from "../../../test_data/eventData.json";
import { cleanupEvent } from "../../../utils/CleanUpHelper";
import { generateEventPayload } from "../../../utils/factories/eventFactory";

test.describe('Event page ', () => {

    test.describe('Event searching and filtering ', () => {
        test("@event @regression should be able to search with valid data ", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();
            await eventPage.searchEvent(eventData.defaultSummit.title);
            await expect(eventPage.getEventCard(eventData.defaultSummit.title)).toBeVisible();
        });

        test("@event @regression should display no results for invalid search", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();
            await eventPage.searchEvent("Tech123NonExists");
            await expect(eventPage.noEventResult).toBeVisible();

        });

        test("@event @regression should filter events using search, category, and city", async ({ authSetup, eventPage }) => {

            await eventPage.goTo();

            await eventPage.searchEvent(eventData.defaultSummit.title);
            await eventPage.filterCategory(eventData.defaultSummit.category);
            await eventPage.filterCity(eventData.defaultSummit.city);

            await eventPage.waitForResultToLoad();
            await expect(eventPage.getEventCard(eventData.defaultSummit.title)).toHaveCount(1);
            await expect(eventPage.getEventCard(eventData.defaultSummit.title)).toBeVisible();
        })

    });

    test.describe('Event Creation', () => {
        test("@event @regression should be able to create event with valid required data", async ({ authSetup,eventService, eventPage, eventFormComponent }) => {

            const payload = generateEventPayload()

            let eventId : number|undefined;
            try {

            await eventPage.goTo();
            await eventPage.clickOnAddNewEvent();

            await expect(eventFormComponent.addEventTitle).toBeVisible();

            await eventFormComponent.addEventDetails(eventData.iplFinals);

            await expect(eventFormComponent.successMsg).toBeVisible();
             
            const response = await eventService.getAllEvent({city:eventData.iplFinals.city, search:eventData.iplFinals.title});
            console.log(response);    

            if(response.status === 200){
                const createdEvent = response.body.data.find(event => event.title === eventData.iplFinals.title)
                eventId = createdEvent?.id;
                console.log(`Inside block : ${eventId}`)
            }

            await expect(eventFormComponent.allEventsTitle).toBeVisible();
            await expect(eventFormComponent.getEventRow(eventData.iplFinals.title)).toBeVisible();
        
            } finally {  
                console.log(`befor clean up : ${eventId}`)               
                 await cleanupEvent(eventService, eventId)
            }
        });

        test("@event @regression should be able to display an error on required field", async ({ authSetup, eventPage, eventFormComponent }) => {

            await eventPage.goTo();
            await eventPage.clickOnAddNewEvent();

            await eventFormComponent.clickOnAddEvent();

            await expect(eventFormComponent.errorTitle).toBeVisible();
            await expect(eventFormComponent.errorCity).toBeVisible();
            await expect(eventFormComponent.errorDate).toBeVisible();
            await expect(eventFormComponent.errorPrice).toBeVisible();
            await expect(eventFormComponent.errorVenue).toBeVisible();
            await expect(eventFormComponent.errorSeats).toBeVisible();
        });

        test("@event @regression should display correct event details on booking page", async ({ authSetup, eventPage, eventFormComponent, eventBookingComponent }) => {

            await eventPage.goTo();
            await eventPage.clickOnAddNewEvent();

            await expect(eventFormComponent.addEventTitle).toBeVisible();

            await eventFormComponent.addEventDetails(eventData.diwaliCarnival);

            await expect(eventFormComponent.successMsg).toBeVisible();

            await expect(eventFormComponent.allEventsTitle).toBeVisible();
            await expect(eventFormComponent.getEventRow(eventData.diwaliCarnival.title)).toBeVisible();

            await eventPage.goTo();

            const eventPrice = await eventPage.getEventPrice(eventData.diwaliCarnival.title);
            const availableEventSeats = await eventPage.getAvailableSeats(eventData.diwaliCarnival.title)

            const actualPrice = parseFloat(eventData.diwaliCarnival.price);
            const actualSeats = parseInt(eventData.diwaliCarnival.seats)

            expect(eventPrice).toBe(actualPrice);
            expect(availableEventSeats).toBe(actualSeats);

            await eventPage.clickOnBookTickets(eventData.diwaliCarnival.title);

            const bookingEventPrice = await eventBookingComponent.getBookingEventPricePerTicket();
            const bookingEventSeats = await eventBookingComponent.getBookingEventSeats()
            const bookingEventCity = await eventBookingComponent.getBookingEventCity();
            const bookingEventVenue = await eventBookingComponent.getBookingEventVenue();

            expect(bookingEventPrice).toBe(actualPrice);
            expect(bookingEventSeats).toBe(actualSeats);
            expect(bookingEventCity).toBe(eventData.diwaliCarnival.city);
            expect(bookingEventVenue).toBe(eventData.diwaliCarnival.venue);

        });

        test.describe("Edit Event", () => {

            test('@regression @event should be able to edit event created ', async ({ authSetup, eventPage, eventFormComponent }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await eventFormComponent.addEventDetails(eventData.rockConcert);
                await expect(eventFormComponent.successMsg).toBeVisible();
                await eventFormComponent.disMissToast();

                await expect(eventFormComponent.getEventRow(eventData.rockConcert.title)).toBeVisible();

                await eventFormComponent.editEvent(eventData.rockConcert.title);

                await expect(eventFormComponent.editEventTitle).toBeVisible();

                await eventFormComponent.addNewEventTitle("Pro Leauge kabdi");
                await eventFormComponent.addNewVenu("Indoor stadium pune");

                await eventFormComponent.addNewPrice("500");
                await eventFormComponent.addNewSeats("5");

                await eventFormComponent.updateCategory("Sports");

                await eventFormComponent.clickOnUpdateEvent();
                await expect(eventFormComponent.updateMsg).toBeVisible();

                await eventFormComponent.editEvent("Pro Leauge kabdi");
            })

            test('@regression @event updating event seat to 0 should display an error message', async ({ authSetup, eventPage, eventFormComponent }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await eventFormComponent.editEvent(eventData.diwaliCarnival.title);

                await expect(eventFormComponent.editEventTitle).toBeVisible();

                await eventFormComponent.addNewSeats("0");

                await eventFormComponent.clickOnUpdateEvent();
                await expect(eventFormComponent.errorSeats).toBeVisible();
            })

        })

        test.describe('Event Delete', () => {

            test("@event @regression should be able to delete the event after created", async ({ authSetup, eventPage, eventFormComponent }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await expect(eventFormComponent.addEventTitle).toBeVisible();

                await eventFormComponent.addEventDetails(eventData.rockConcert);

                await expect(eventFormComponent.successMsg).toBeVisible();

                await expect(eventFormComponent.allEventsTitle).toBeVisible();
                await expect(eventFormComponent.getEventRow(eventData.rockConcert.title)).toBeVisible();

                await eventFormComponent.deleteEvent(eventData.rockConcert.title);
                await eventFormComponent.clickOnConfirmDelete();
                await expect(eventFormComponent.getEventRow(eventData.rockConcert.title)).toHaveCount(0);
            });


            test('@regression @event should be able to dismiss the cancel popup', async ({ authSetup, eventPage, eventFormComponent }) => {

                await eventPage.goTo();
                await eventPage.clickOnAddNewEvent();

                await expect(eventFormComponent.addEventTitle).toBeVisible();

                await expect(eventFormComponent.getEventRow(eventData.diwaliCarnival.title)).toBeVisible();

                await eventFormComponent.deleteEvent(eventData.diwaliCarnival.title);

                await eventFormComponent.clickOnDismissDeleteModal();

                await expect(eventFormComponent.getEventRow(eventData.diwaliCarnival.title)).toBeVisible();

            })


        })


    })
})
