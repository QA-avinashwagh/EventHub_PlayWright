import { test, expect } from "@playwright/test";
import testData from "../../../test_data/loginUser.json";
import { EventPage } from "../../../pages/EventPage";
import { AuthHelper } from "../../../utils/authHelper";
import { HomePage } from "../../../pages/HomePage";
import { EventFormComponents } from "../../../pages/EventFormComponent";
import eventData from "../../../test_data/eventData.json";
import { EventBookingComponents } from "../../../pages/EventBookingComponents";

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


test("@event @regression should able to create event with valid data", async ({ page, request }) => {

    const authHelper = new AuthHelper()
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request, page,
        testData.validUser1.email,
        testData.validUser1.password
    )

    await expect(homePage.loginEmailUser).toBeVisible();

    const eventPage = new EventPage(page);
    const eventFormComponents = new EventFormComponents(page);

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponents.addEventTitle).toBeVisible();

    await eventFormComponents.addEventDetails(eventData[0]);

    await expect(eventFormComponents.getToastDisplayed()).toBeVisible();

    await expect(eventFormComponents.getAllEventTitle()).toBeVisible();
    await expect(eventFormComponents.getEventRow("Sonu Nigam Night")).toBeVisible();

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
    const eventFormComponents = new EventFormComponents(page);

    await eventPage.goTo();
    await eventPage.clickOnAddNewEvent();

    await expect(eventFormComponents.addEventTitle).toBeVisible();

    await eventFormComponents.addEventDetails(eventData[1]);

    await expect(eventFormComponents.getToastDisplayed()).toBeVisible();

    await expect(eventFormComponents.getAllEventTitle()).toBeVisible();
    await expect(eventFormComponents.getEventRow("Ed Shreen Night")).toBeVisible();

    await expect(eventFormComponents.getEventRow("Ed Shreen Night")).not.toBeVisible();

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
    const eventFormComponents = new EventFormComponents(page)

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
    const eventBookingComponent = new EventBookingComponents(page)

    await eventPage.goTo();

    const eventPrice = await eventPage.getEventPrice("World Tech Summit"); 

    await eventPage.clickOnBookTickets("World Tech Summit");

    const bookEventPrice = await eventBookingComponent.getBookEventPrice();;

    expect(eventPrice).toBe(bookEventPrice);





})
