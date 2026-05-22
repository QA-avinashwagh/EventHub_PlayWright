import { test, expect } from "../../../fixtures/baseFixture";
import eventData from "../../../test_data/eventData.json";
import user from "../../../test_data/bookingUserDetails.json";

test.describe('Event Booking', () => {

    test.describe('Booking creation', () => {
        test("@regression @booking should display empty booking state when no bookings exist", async ({ loginViaUi, myBookingPage }) => {

            await myBookingPage.goTo();
            await expect(myBookingPage.noBookingsTitle).toBeVisible();
            await expect(myBookingPage.noBookingMsg).toBeVisible();

        });

        test("@regression @booking should booked event sucessfully", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaulDiwali.title);
            await eventBookingComponent.addBookingDetails(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber)

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();
            const refId = await eventBookingComponent.getBookingRefId();
            console.log(`refrence id genrated on booking page ${refId}`);
            await eventBookingComponent.clickOnViewBooking()
            const myBookingRefId = await myBookingPage.getRefernceId(refId);
            console.log(`refrence id on the Mybooking page ${myBookingRefId}`);
            expect(refId).toBe(myBookingRefId);
        });

        test("@regression @booking should display validation errors for empty booking details", async ({ authSetup, eventPage, eventBookingComponent }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");

            await eventBookingComponent.clickOnConfirmBooking();

            await expect(eventBookingComponent.errorFullname).toBeVisible();
            await expect(eventBookingComponent.errorEmail).toBeVisible();
            await expect(eventBookingComponent.errorPhoneNum).toBeVisible();

        });

    })

    test.describe('ticket counter', () => {
        test("@regression @booking should prevent decreasing ticket count below 1", async ({ authSetup, eventPage, eventBookingComponent }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);

            const ticketCount = await eventBookingComponent.getCurrentTicketCount();
            expect(ticketCount).toBe(1); // Checking default count of the ticket is 1.
            await expect(eventBookingComponent.reduceTicket).toBeDisabled();
        });

        test("@regression @booking event should be able to book event more than 1 ticket", async ({ authSetup, eventPage, eventBookingComponent }) => {

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

        test("@regression @booking should prevent increasing ticket count above 10", async ({ authSetup, eventPage, eventBookingComponent }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultSummit.title);
            await eventBookingComponent.setTicketCountTo(10);

            const ticketCount = await eventBookingComponent.getCurrentTicketCount();
            expect(ticketCount).toBe(10);
            await expect(eventBookingComponent.addTicket).toBeDisabled();  // to check the button gets disabled 
        });

    })

    test.describe('Booking details', () => {

        test('@regression @booking My Booking should display correct event details', async({authSetup, eventPage,eventBookingComponent, myBookingPage})=> {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultSummit.title);

            const eventCity = await eventBookingComponent.getBookingEventCity();
            const ticketCount = await eventBookingComponent.getCurrentTicketCount();

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();
            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            const myBookingRefId = await myBookingPage.getRefernceId(refId);
            expect(refId).toBe(myBookingRefId);

            const bookingCardCity = await myBookingPage.getBookedEventCity(refId);
            const bookingCardTitle = await myBookingPage.getEventTitle(refId);
            const bookingCardTicket = await myBookingPage.getBookedEventTicketCount(refId);
        
            expect(bookingCardCity).toBe(eventCity);
            expect(bookingCardTitle).toBe(eventData.defaultSummit.title);
            expect(bookingCardTicket).toBe(ticketCount);
        })

        test("@regression @booking On booking event should display correct event details", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultSummit.title);

            const eventCity = await eventBookingComponent.getBookingEventCity();
            const eventDate = await eventBookingComponent.getBookingEventDate();
            const eventVenue = await eventBookingComponent.getBookingEventVenue()

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();
            const refId = await eventBookingComponent.getBookingRefId();
            console.log(`refrence id genrated on booking page ${refId}`);

            await eventBookingComponent.clickOnViewBooking()

            const myBookingRefId = await myBookingPage.getRefernceId(refId);
            console.log(`refrence id on the Mybooking page ${myBookingRefId}`);

            expect(refId).toBe(myBookingRefId);

            await myBookingPage.clickOnViewDetails(refId);

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

        test("@regression @booking on booking event should displayed correct customer details ", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnViewDetails(refId);

            const customerName = await bookingDetailPage.getCustomerName();
            const customerEmail = await bookingDetailPage.getCustomerEmail();
            const customerPhone = await bookingDetailPage.getCustomerPhone();

            expect(customerName).toBe(user.Details.emmaUser.fullName);
            expect(customerEmail).toBe(user.Details.emmaUser.email);
            expect(customerPhone).toBe(user.Details.emmaUser.phoneNumber);

        })

        test("@regression @booking should display correct payment summary for multiple tickets", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
            await eventBookingComponent.increaseTicketCount()

            const ticketCount = await eventBookingComponent.getCurrentTicketCount();
            expect(ticketCount).toBe(2);
            const pricePerTicket = await eventBookingComponent.getBookingEventPricePerTicket();
            const actualTotalPrice = pricePerTicket * (ticketCount);

            const expectedTotalPrice = await eventBookingComponent.getTotalPrice();
            expect(actualTotalPrice).toBe(expectedTotalPrice);

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnViewDetails(refId);

            const ticket = await bookingDetailPage.getTickets();
            const detailPricePerTicket = await bookingDetailPage.getPricePerTicket();
            const totalPaid = await bookingDetailPage.getTotalPaid();

            expect(ticket).toBe(ticketCount);
            expect(detailPricePerTicket).toBe(pricePerTicket);
            expect(totalPaid).toBe(actualTotalPrice);

        });
    });

    test.describe('Refund Eligibility', () => {
        test("@regession @booking should mark single-ticket booking as refundable", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage }) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnViewDetails(refId);

            const status = await bookingDetailPage.getRefundStatus();

            expect(status).toBe("Eligible for refund.");

        })

        test("@regession @booking should mark multi-ticket booking as non-refundable", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage }) => {
            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
            await eventBookingComponent.increaseTicketCount();

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnViewDetails(refId);

            expect(await bookingDetailPage.getTickets()).toBe(2);
            const status = await bookingDetailPage.getRefundStatus();

            expect(status).toBe("Not eligible for refund.");

        })
    });

    test.describe('Booking Managment', () => {
        test("@regession @booking should cancel booking successfully", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage}) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnCancelBooking(refId);
            await myBookingPage.confirmCancelBooking();

            const card = myBookingPage.getEventCard(refId);
            expect(card).not.toBeVisible

        })

        test("@regession @booking should cancel booking dismiss successfully", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage}) => {

            await eventPage.goTo();
            await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);

            await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

            await expect(eventBookingComponent.confirmBookingText).toBeVisible();

            const refId = await eventBookingComponent.getBookingRefId();

            await eventBookingComponent.clickOnViewBooking()

            await myBookingPage.clickOnCancelBooking(refId);
            await myBookingPage.dismissCancelBooking(); 

            const card = myBookingPage.getEventCard(refId);
            expect(card).toBeVisible

        })


        test('@regression @booking should clear all bookings successfully', async ({authSetup, myBookingPage})=>{

            await myBookingPage.goTo();
            await myBookingPage.clickOnClearAllBookings(); 

            await expect (myBookingPage.noBookingsTitle).toBeVisible();
            await expect(myBookingPage.noBookingMsg).toBeVisible();

        })




    })


})