import { expect, test } from "../../fixtures/ApiFixture";
import user from "../../test_data/bookingUserDetails.json";
import { generateBookingPayload } from "../../utils/factories/bookingFactory";


test("should be able to book event created by API", async ({ authSetup, eventResource, eventPage, eventDetailPage, myBookingPage }) => {

    const title = eventResource.title;
    await eventPage.goTo();
    const bookEvent = eventPage.findEvent(title);
    await bookEvent.book();
    const bookingForm = eventDetailPage.bookingForm();
    await bookingForm.book(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber)

    await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();
    const refId = await eventDetailPage.getBookingRefId();

    await eventDetailPage.viewBooking();
    const bookingCard  = myBookingPage.findBooking(refId);
    const myBookingRefId = bookingCard.getBookingId();

    expect(refId).toBe(myBookingRefId);
    await expect(bookingCard.root).toBeVisible();
})


test("Should be displayed booking created and booked by API", async ({ authSetup , eventResource, bookingService, myBookingPage }) => {

    const eventId = eventResource.id;
    let refID: string;

    const bookingPayload = generateBookingPayload(eventId, 1);
    await test.info().attach("Create booking payload",
        {
            body: JSON.stringify(bookingPayload, null, 2),
            contentType: "application/json"
        }
    );

    const bookingResponse = await bookingService.createBooking(bookingPayload);
    await test.info().attach("Create booking Response",
        {
            body: JSON.stringify(bookingResponse.body, null, 2),
            contentType: "application/json"
        }
    );

    expect(bookingResponse.status).toBe(201);
    if (bookingResponse.status === 201) {
        expect(bookingResponse.body.success).toBeTruthy();
        expect(bookingResponse.body.message).toBe("Booking confirmed!");
    }

    if (bookingResponse.status !== 201) {
        throw new Error("Faild to create the booking ...");
    }
    refID = bookingResponse.body.data.bookingRef

    await myBookingPage.goTo();
    const bookingCard = myBookingPage.findBooking(refID);
    expect (await bookingCard.getBookingId()).toBe(refID);
    await expect(bookingCard.root).toBeVisible();

})


test("should be able to update seat count after UI booking", async ({ authSetup, eventResource, eventPage, eventDetailPage, eventService }) => {

    const title = eventResource.title;
    const eventId = eventResource.id;
    const intialSeatsCount = eventResource.totalSeats;

    await eventPage.goTo();
    const eventCard = eventPage.findEvent(title);
    await eventCard.book();

    const bookingForm = eventDetailPage.bookingForm();
    await bookingForm.increaseTicketCount();

    await bookingForm.book(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber);
    await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

    const getResponse = await eventService.getEvent(eventId);
    if (getResponse.status !== 200) {
        throw new Error("Failed get update seat count from get API");
    }

    const updatedCount = getResponse.body.data.availableSeats;

    expect(updatedCount).toBe(intialSeatsCount - 2);
})


test("should be able to cancel the booking created by API ", async ({authSetup, eventResource, eventPage, eventDetailPage, myBookingPage, eventService }) => {

    const title = eventResource.title;
    const seatsCount = eventResource.totalSeats;
    const eventId = eventResource.id;

    // Booking
    await eventPage.goTo();
    const eventCard = eventPage.findEvent(title);
    await eventCard.book();

    const bookingForm = eventDetailPage.bookingForm();
    await bookingForm.book(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber)

    await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();
    const refId = await eventDetailPage.getBookingRefId();

    await eventDetailPage.viewBooking();

    // Checking count when Event is booked
    const getResponse = await eventService.getEvent(eventId);
    if (getResponse.status !== 200) {
        throw new Error("Failed get update seat count from get API");
    }
    const updatedBookCount = getResponse.body.data.availableSeats;

    expect(updatedBookCount).toBe(seatsCount - 1);

    const bookedCard = myBookingPage.findBooking(refId);
    await bookedCard.cancel();
     
    const dialog = myBookingPage.getCancelDialog();
    await dialog.confirm();
    await expect (myBookingPage.sucessCancelToast).toBeVisible();

    const card = myBookingPage.findBooking(refId);
    await expect(card.root).not.toBeVisible();
    
    // Checking count when Event is cancelled 
    const getResponse2 = await eventService.getEvent(eventId);
    if (getResponse2.status !== 200) {
        throw new Error("Failed get update seat count from get API");
    }
    const updatedCountAfterCancel = getResponse2.body.data.availableSeats;
    expect(updatedCountAfterCancel).toBe(seatsCount);

})