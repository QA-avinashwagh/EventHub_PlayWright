import { test, expect } from "@playwright/test";
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
    const found = await eventPage.isEventVisible("World Tech Summit");
    expect(found).toBe(true);

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

    await eventFormComponents.addEventDetails(eventData[4]);

    await expect(eventFormComponents.successMsg).toBeVisible();

    await expect(eventFormComponents.allEventsTitle).toBeVisible();
    await expect(eventFormComponents.getEventRow(eventData[4].title)).toBeVisible();

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

    await eventFormComponents.addEventDetails(eventData[1]);

    await expect(eventFormComponents.successMsg).toBeVisible();

    await expect(eventFormComponents.allEventsTitle).toBeVisible();
    await expect(eventFormComponents.getEventRow("Grand Diwali Carnival")).toBeVisible();

    await eventFormComponents.deleteEvent("Grand Diwali Carnival");

    await expect(eventFormComponents.getEventRow("Grand Diwali Carnival")).not.toBeVisible();

})

test("@event @regression should display an error on required field ", async ({ page, request }) => {

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

test("@event @regression should displayed correct event price and available seats on detail page", async({page , request})=>{

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

    const eventPrice = await eventPage.getEventPrice("World Tech Summit"); 

    await eventPage.clickOnBookTickets("World Tech Summit");

    const bookEventPrice = await eventBookingComponent.getBookingEventPrice();

    expect(eventPrice).toBe(bookEventPrice);

})






