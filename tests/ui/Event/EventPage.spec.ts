import { test, expect, request } from "@playwright/test";
import testData from "../../../test_data/loginUser.json";
import { EventPage } from "../../../pages/EventPage";
import { AuthHelper } from "../../../utils/authHelper";
import { HomePage } from "../../../pages/HomePage";
import { EventFormComponent } from "../../../pages/components/EventFormComponent";
import eventData from "../../../test_data/eventData.json";
import { EventBookingComponent } from "../../../pages/components/EventBookingComponent";

test("@event @regression should search with valid data ", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);

    await eventPage.goTo();
    await eventPage.searchEvent("World Tech Summit");
    await expect (eventPage.getEventCard("World Tech Summit")).toBeVisible();
})

test("@event @regression on invalid search should show no result found", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);

    await eventPage.goTo();
    await eventPage.searchEvent("Tech123NonExists");
    await expect (eventPage.noEventResult).toBeVisible();
    
})

test("@event @regression should able to create event with valid required data", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventFormComponents = new EventFormComponent(page);

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponents.addEventTitle).toBeVisible();

    await eventFormComponents.addEventDetails(eventData.iplFinals);

    await expect(eventFormComponents.successMsg).toBeVisible();

    await expect(eventFormComponents.allEventsTitle).toBeVisible();
    await expect(eventFormComponents.getEventRow(eventData.iplFinals.title)).toBeVisible();

})

test("@event @regression should able to delete the event after created", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventFormComponents = new EventFormComponent(page);

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponents.addEventTitle).toBeVisible();

    await eventFormComponents.addEventDetails(eventData.rockConcert);

    await expect(eventFormComponents.successMsg).toBeVisible();

    await expect(eventFormComponents.allEventsTitle).toBeVisible();
    await expect(eventFormComponents.getEventRow(eventData.rockConcert.title)).toBeVisible();

    await eventFormComponents.deleteEvent(eventData.rockConcert.title);

    await expect(eventFormComponents.getEventRow(eventData.rockConcert.title)).not.toBeVisible();

})

test("@event @regression should be able to display an error on required field", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventFormComponents = new EventFormComponent(page)

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await eventFormComponents.clickOnAddEvent();

    await expect(eventFormComponents.errorTitle).toBeVisible();
    await expect(eventFormComponents.errorCity).toBeVisible();
    await expect(eventFormComponents.errorDate).toBeVisible();
    await expect(eventFormComponents.errorPrice).toBeVisible();
    await expect(eventFormComponents.errorVenue).toBeVisible();
    await expect(eventFormComponents.errorSeats).toBeVisible();

})

test("@event @regression after event creation should displayed correct details on the booking page", async({page , request})=>{

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventFormComponents = new EventFormComponent(page);
    const eventBookingComponent = new EventBookingComponent(page)

    await eventPage.goTo();

    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponents.addEventTitle).toBeVisible();

    await eventFormComponents.addEventDetails(eventData.diwaliCarnival);

    await expect(eventFormComponents.successMsg).toBeVisible();

    await expect(eventFormComponents.allEventsTitle).toBeVisible();
    await expect(eventFormComponents.getEventRow(eventData.diwaliCarnival.title)).toBeVisible();

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


test("@regression @bookingevent should be able to booked event sucessfully", async({page, request})=>{

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventBookingComponent = new EventBookingComponent(page)

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");
    await eventBookingComponent.addBookingDetails("David Mathew", "david@yopamail.com", "+91 910 616 2016")
    await expect (eventBookingComponent.confirmBookingText).toBeVisible();

});

test("@regression @bookingevent should be able to book event more than 1 ticket", async ({page, request})=>{


    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventBookingComponent = new EventBookingComponent(page)

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


test("@regression @booking should display error on invalid input for booking details", async({page, request})=>{

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventBookingComponent = new EventBookingComponent(page)

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");

    await eventBookingComponent.clickOnConfirmBooking(); 

    await expect(eventBookingComponent.errorFullname).toBeVisible();
    await expect(eventBookingComponent.errorEmail).toBeVisible();
    await expect(eventBookingComponent.errorPhoneNum).toBeVisible();
});


