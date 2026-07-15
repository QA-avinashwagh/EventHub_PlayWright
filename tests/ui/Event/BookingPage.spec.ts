    import { test, expect } from "../../../fixtures/baseFixture";
import eventData from "../../../test_data/eventData.json";
import user from "../../../test_data/bookingUserDetails.json";

test.describe('Event Booking', () => {

    test.describe('Booking creation', () => {
        test("@regression @booking should display empty booking state when no bookings exist", async ({ loginViaUi, myBookingPage }) => {

            await myBookingPage.goTo();
            await expect(myBookingPage.noBookingHeading).toBeVisible();
            await expect(myBookingPage.noBookingMessage).toBeVisible();

        });

        test("@regression @booking should booked event sucessfully", async ({ authSetup, eventPage, eventDetailPage, myBookingPage }) => {

            await eventPage.goTo();
            const diwaliEvent = eventPage.findEvent(eventData.defaulDiwali.title);
            await diwaliEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.book(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();
            const refId = await eventDetailPage.getBookingRefId();
            console.log(`refrence id genrated on booking page ${refId}`);
            await eventDetailPage.viewBooking();
            const bookingCard = myBookingPage.findBooking(refId);
            const myBookingRefId = await bookingCard.getBookingId();
            console.log(`refrence id on the Mybooking page ${myBookingRefId}`);
            expect(refId).toBe(myBookingRefId);
        });

        test("@regression @booking should display validation errors for empty booking details", async ({ authSetup, eventPage, eventDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.confirmBooking();

            await expect(bookingForm.fullNameError).toBeVisible();
            await expect(bookingForm.emailError).toBeVisible();
            await expect(bookingForm.phoneError).toBeVisible();

        });

    })

    test.describe('ticket counter', () => {
        test("@regression @booking should prevent decreasing ticket count below 1", async ({ authSetup, eventPage, eventDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);
            await moonsoonEvent.book();

            const bookingForm = eventDetailPage.bookingForm();

            const ticketCount = await bookingForm.getCurrentTicketCount();
            expect(ticketCount).toBe(1); // Checking default count of the ticket is 1.
            await expect(bookingForm.decreaseButton).toBeDisabled();
        });

        test("@regression @booking event should be able to book event more than 1 ticket", async ({ authSetup, eventPage, eventDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);
            await moonsoonEvent.book();

            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.increaseTicketCount();

            const ticketCount = await bookingForm.getCurrentTicketCount();
            expect(ticketCount).toBe(2);
            const pricePerTicket = await eventDetailPage.getPricePerTicket();
            const actualTotalPrice = pricePerTicket * (ticketCount);

            const expectedTotalPrice = await bookingForm.getTotalPrice();
            expect(actualTotalPrice).toBe(expectedTotalPrice);
        });

        test("@regression @booking should prevent increasing ticket count above 10", async ({ authSetup, eventPage, eventDetailPage }) => {

            await eventPage.goTo();

            const summitEvent = eventPage.findEvent(eventData.defaultSummit.title);

            await summitEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.setTicketCountTo(10);

            const ticketCount = await bookingForm.getCurrentTicketCount();
            expect(ticketCount).toBe(10);
            await expect(bookingForm.incraseButton).toBeDisabled();  // to check the button gets disabled 
        });

    })

    test.describe('Booking details', () => {

        test('@regression @booking My Booking should display correct event details', async ({ authSetup, eventPage, eventDetailPage, myBookingPage }) => {

            await eventPage.goTo();
            const summitEvent = eventPage.findEvent(eventData.defaultSummit.title);

            await summitEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            const eventCity = await eventDetailPage.getCity();
            const ticketCount = await bookingForm.getCurrentTicketCount();

            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();
            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking()

            const bookingCard = myBookingPage.findBooking(refId)
            const myBookingRefId = await bookingCard.getBookingId();
            expect(refId).toBe(myBookingRefId);

            const bookingCardCity = await bookingCard.getBookedEventCity()
            const bookingCardTitle = await bookingCard.getEventTitle();
            const bookingCardTicket = await bookingCard.getBookedEventTicketCount();

            expect(bookingCardCity).toBe(eventCity);
            expect(bookingCardTitle).toBe(eventData.defaultSummit.title);
            expect(bookingCardTicket).toBe(ticketCount);
        })

        test("@regression @booking On booking event should display correct event details", async ({ authSetup, eventPage, eventDetailPage, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();
            const summitEvent = eventPage.findEvent(eventData.defaultSummit.title);

            await summitEvent.book();
            const eventCity = await eventDetailPage.getCity();
            const eventDate = await eventDetailPage.getDate();
            const eventVenue = await eventDetailPage.getVenue();

            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();
            const refId = await eventDetailPage.getBookingRefId();
            console.log(`refrence id genrated on booking page ${refId}`);

            await eventDetailPage.viewBooking();

            const bookingCard = myBookingPage.findBooking(refId)
            const myBookingRefId = await bookingCard.getBookingId();
            console.log(`refrence id on the Mybooking page ${myBookingRefId}`);

            expect(refId).toBe(myBookingRefId);

            await bookingCard.viewDetails();

            const detRefId = await bookingDetailPage.getRefID();
            expect(refId).toBe(detRefId);

            const eventTitle = await bookingDetailPage.getEventTitle();
            const bookingCity = await bookingDetailPage.getEventCity();
            const bookingDate = await bookingDetailPage.getEventDate()
            const bookingVenue = await bookingDetailPage.getEventVenue();

            expect(eventTitle).toBe(eventData.defaultSummit.title);
            expect(eventCity).toBe(bookingCity);
            expect(eventVenue).toBe(bookingVenue);
            expect(bookingDate).toContain(eventDate);

        })

        test("@regression @booking on booking event should displayed correct customer details ", async ({ authSetup, eventPage, eventDetailPage, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();
            const bookingform = eventDetailPage.bookingForm();
            await bookingform.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking();
            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.viewDetails();

            const customerName = await bookingDetailPage.getCustomerName();
            const customerEmail = await bookingDetailPage.getCustomerEmail();
            const customerPhone = await bookingDetailPage.getCustomerPhone();

            expect(customerName).toBe(user.Details.emmaUser.fullName);
            expect(customerEmail).toBe(user.Details.emmaUser.email);
            expect(customerPhone).toBe(user.Details.emmaUser.phoneNumber);

        })

        test("@regression @booking should display correct payment summary for multiple tickets", async ({ authSetup, eventPage, eventDetailPage, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.increaseTicketCount()

            const ticketCount = await bookingForm.getCurrentTicketCount();
            expect(ticketCount).toBe(2);
            const pricePerTicket = await bookingDetailPage.getPricePerTicket();
            const actualTotalPrice = pricePerTicket * (ticketCount);

            const expectedTotalPrice = await bookingForm.getTotalPrice();
            expect(actualTotalPrice).toBe(expectedTotalPrice);

            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking()

            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.viewDetails();

            const ticket = await bookingDetailPage.getTickets();
            const detailPricePerTicket = await bookingDetailPage.getPricePerTicket();
            const totalPaid = await bookingDetailPage.getTotalPaid();

            expect(ticket).toBe(ticketCount);
            expect(detailPricePerTicket).toBe(pricePerTicket);
            expect(totalPaid).toBe(actualTotalPrice);

        });
    });

    test.describe('Refund Eligibility', () => {
        test("@regession @booking should mark single-ticket booking as refundable", async ({ authSetup, eventPage, eventDetailPage, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();
            const bookingform = eventDetailPage.bookingForm();
            await bookingform.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking()

            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.viewDetails();

            const status = await bookingDetailPage.getRefundStatus();

            expect(status).toBe("Eligible for refund.");

        })

        test("@regession @booking should mark multi-ticket booking as non-refundable", async ({ authSetup, eventPage, eventDetailPage, myBookingPage, bookingDetailPage }) => {
            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.increaseTicketCount();

            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking()

            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.viewDetails();

            expect(await bookingDetailPage.getTickets()).toBe(2);
            const status = await bookingDetailPage.getRefundStatus();

            expect(status).toBe("Not eligible for refund.");

        })
    });

    test.describe('Booking Managment', () => {
        test("@regession @booking should cancel booking successfully", async ({ authSetup, eventPage, eventDetailPage, myBookingPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);
            await moonsoonEvent.book();
            const bookingForm = eventDetailPage.bookingForm();
            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking();

            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.cancel();

            const dialog = myBookingPage.getCancelDialog();
            await expect(dialog.root).toBeVisible();
            await dialog.confirm();

            expect(bookingCard.root).not.toBeVisible

        })

        test("@regession @booking should cancel booking dismiss successfully", async ({ authSetup, eventPage, eventDetailPage, myBookingPage }) => {

            await eventPage.goTo();

            const moonsoonEvent = eventPage.findEvent(eventData.defaultMonsoon.title);

            await moonsoonEvent.book();

            const bookingForm = eventDetailPage.bookingForm();

            await bookingForm.book(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventDetailPage.bookingConfirmMessage).toBeVisible();

            const refId = await eventDetailPage.getBookingRefId();

            await eventDetailPage.viewBooking()

            const bookingCard = myBookingPage.findBooking(refId)
            await bookingCard.cancel();

            const dialog = myBookingPage.getCancelDialog();

            await dialog.dismiss()
            expect(bookingCard.root).toBeVisible
        })

        test('@regression @booking should clear all bookings successfully', async ({ authSetup, myBookingPage }) => {

            await myBookingPage.goTo();
            await myBookingPage.clearAllBookings();
            await expect(myBookingPage.noBookingHeading).toBeVisible();
            await expect(myBookingPage.noBookingMessage).toBeVisible();
        })

    })

})