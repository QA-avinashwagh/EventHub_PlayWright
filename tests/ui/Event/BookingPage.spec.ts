import {test, expect} from "../../../fixtures/baseFixture";
import eventData from "../../../test_data/eventData.json";
import user from "../../../test_data/bookingUserDetails.json";

test.describe('Event Booking', () => {
test("@regression @booking should display error on invalid input for booking details", async({authSetup, eventPage, eventBookingComponent})=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");

    await eventBookingComponent.clickOnConfirmBooking(); 

    await expect(eventBookingComponent.errorFullname).toBeVisible();
    await expect(eventBookingComponent.errorEmail).toBeVisible();
    await expect(eventBookingComponent.errorPhoneNum).toBeVisible();
});

test("@regression @booking event should be able to booked sucessfully", async({authSetup, eventPage, eventBookingComponent})=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets(eventData.defaulDiwali.title);
    await eventBookingComponent.addBookingDetails(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber)
    
    await expect (eventBookingComponent.confirmBookingText).toBeVisible();

});

test("@regression @booking event should be able to book event more than 1 ticket", async ({authSetup, eventPage, eventBookingComponent })=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
    await eventBookingComponent.increaseTicketCount();

    const ticketCount = await eventBookingComponent.getCurrentTicketCount();
    expect(ticketCount).toBe(2);
    const pricePerTicket = await eventBookingComponent.getBookingEventPricePerTicket();
    const actualTotalPrice = pricePerTicket * (ticketCount);

    const expectedTotalPrice = await eventBookingComponent.getTotalPrice();

    expect(actualTotalPrice).toBe(expectedTotalPrice);
});

test ("@regression @booking On booking event should display correct refid on my booking and details page", async({authSetup, eventPage, eventBookingComponent, bookingPage, bookingDetailPage})=>{

    await eventPage.goTo();
    await eventPage.clickOnBookTickets(eventData.defaultSummit.title);
    await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber)
    
    await expect (eventBookingComponent.confirmBookingText).toBeVisible();
    const refId = await eventBookingComponent.getBookingRefId();
    console.log(`refrence id genrated on booking page ${refId}`);
    await eventBookingComponent.clickOnViewBooking()
    const myBookingRefId = await bookingPage.getRefernceId(eventData.defaultSummit.title);
    console.log(`refrence id on the Mybooking page ${myBookingRefId}`); 
    expect(refId).toBe(myBookingRefId);

    await bookingPage.clickOnViewDetails(eventData.defaultSummit.title);
    const detRefId = await bookingDetailPage.getRefID();
    expect (refId).toBe(detRefId);

})



})