import { test, expect} from "../../../fixtures/baseFixture";
import eventData from "../../../test_data/eventData.json";

test.describe('Search Event', () =>{ 
test("@event @regression should be able to search with valid data ", async ({authSetup,  homePage, eventPage }) => {

    await expect(homePage.loginEmailUser).toBeVisible();

    await eventPage.goTo();
    await eventPage.searchEvent("World Tech Summit");
    await expect (eventPage.getEventCard("World Tech Summit")).toBeVisible();
});

test("@event @regression on invalid search should be ablet to show no result found", async ({authSetup, homePage, eventPage}) =>{ 

    await expect(homePage.loginEmailUser).toBeVisible();

    await eventPage.goTo();
    await eventPage.searchEvent("Tech123NonExists");
    await expect (eventPage.noEventResult).toBeVisible();
    
});
});

test.describe('Event Creation',  ()=> {
test("@event @regression should be able to create event with valid required data", async ({authSetup, homePage, eventPage, eventFormComponent }) => {

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponent.addEventTitle).toBeVisible();

    await eventFormComponent.addEventDetails(eventData.iplFinals);

    await expect(eventFormComponent.successMsg).toBeVisible();

    await expect(eventFormComponent.allEventsTitle).toBeVisible();
    await expect(eventFormComponent.getEventRow(eventData.iplFinals.title)).toBeVisible();
});

test("@event @regression should be able to delete the event after created", async ({authSetup, homePage, eventPage, eventFormComponent}) => {

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponent.addEventTitle).toBeVisible();

    await eventFormComponent.addEventDetails(eventData.rockConcert);

    await expect(eventFormComponent.successMsg).toBeVisible();

    await expect(eventFormComponent.allEventsTitle).toBeVisible();
    await expect(eventFormComponent.getEventRow(eventData.rockConcert.title)).toBeVisible();

    await eventFormComponent.deleteEvent(eventData.rockConcert.title);
    await expect(eventFormComponent.getEventRow(eventData.rockConcert.title)).not.toBeVisible();
});

test("@event @regression should be able to display an error on required field", async ({authSetup, eventPage, eventFormComponent}) => {
    
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

test("@event @regression after event creation should displayed correct details on the booking page", async({authSetup, homePage, eventPage, eventFormComponent, eventBookingComponent})=>{
    
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
})

test.describe('Event Booking', () => {
test("@regression @bookingevent should be able to booked event sucessfully", async({authSetup, homePage, eventPage, eventBookingComponent})=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");
    await eventBookingComponent.addBookingDetails("David Mathew", "david@yopamail.com", "+91 910 616 2016")
    
    await expect (eventBookingComponent.confirmBookingText).toBeVisible();

});

test("@regression @bookingevent should be able to book event more than 1 ticket", async ({authSetup, homePage, eventPage, eventBookingComponent })=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");
    await eventBookingComponent.increaseTicketCount();

    const ticketCount = await eventBookingComponent.getCurrentTicketCount();
    expect(ticketCount).toBe(2);
    const pricePerTicket = await eventBookingComponent.getBookingEventPricePerTicket();
    const actualTotalPrice = pricePerTicket * (ticketCount);

    const expectedTotalPrice = await eventBookingComponent.getTotalPrice();

    expect(actualTotalPrice).toBe(expectedTotalPrice);
});


test("@regression @booking should display error on invalid input for booking details", async({authSetup, homePage, eventPage, eventBookingComponent})=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");

    await eventBookingComponent.clickOnConfirmBooking(); 

    await expect(eventBookingComponent.errorFullname).toBeVisible();
    await expect(eventBookingComponent.errorEmail).toBeVisible();
    await expect(eventBookingComponent.errorPhoneNum).toBeVisible();
});
})