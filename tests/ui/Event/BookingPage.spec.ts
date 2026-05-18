import { test, expect } from "../../../fixtures/baseFixture";
import eventData from "../../../test_data/eventData.json";
import user from "../../../test_data/bookingUserDetails.json";

test.describe('Event Booking', () => {
    

    test("@regression @booking event should be able to booked sucessfully", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage }) => {

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

    test("@regression @booking should display error on invalid input for booking details", async ({ authSetup, eventPage, eventBookingComponent }) => {

        await eventPage.goTo();
        await eventPage.clickOnBookTickets("Hollywood Monsoon Night — Los Angeles");

        await eventBookingComponent.clickOnConfirmBooking();

        await expect(eventBookingComponent.errorFullname).toBeVisible();
        await expect(eventBookingComponent.errorEmail).toBeVisible();
        await expect(eventBookingComponent.errorPhoneNum).toBeVisible();
        
    });

    test("@regression @booking event should not be able to book event less than 1 ticket", async ({ authSetup, eventPage, eventBookingComponent }) => {

        await eventPage.goTo();
        await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
        
        const ticketCount = await eventBookingComponent.getCurrentTicketCount();
        expect(ticketCount).toBe(1) ; // Checking default count of the ticket is 1.
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

    test("@regression @booking event should not be able to book event more than 10 ticket", async ({ authSetup, eventPage, eventBookingComponent }) => {

        await eventPage.goTo();
        await eventPage.clickOnBookTickets(eventData.defaultSummit.title);
        await eventBookingComponent.setTicketCountTo(10);

        const ticketCount = await eventBookingComponent.getCurrentTicketCount();
        expect(ticketCount).toBe(10);
        expect(eventBookingComponent.addTicket).toBeDisabled();  // to check the button gets disabled 
    });

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

    test("@regression @booking on booking event should displayed correct customer details ", async ({ authSetup, eventPage, eventBookingComponent, myBookingPage, bookingDetailPage}) => {

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

    test("@regression @booking should be able to booked with correct payment summary ", async({authSetup, eventPage, eventBookingComponent,myBookingPage, bookingDetailPage})=>{

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


    test("@regession @booking single ticket should be able for refund  ", async({authSetup , eventPage, eventBookingComponent, myBookingPage, bookingDetailPage})=>{

        
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

    test("@regession @booking more than 1 ticket should be not able for refund  ", async({authSetup , eventPage, eventBookingComponent, myBookingPage, bookingDetailPage})=>{
        await eventPage.goTo();
        await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
        await eventBookingComponent.increaseTicketCount();

        await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

        await expect(eventBookingComponent.confirmBookingText).toBeVisible();
        
        const refId = await eventBookingComponent.getBookingRefId();
        
        await eventBookingComponent.clickOnViewBooking()
        
        await myBookingPage.clickOnViewDetails(refId);

        expect (await bookingDetailPage.getTickets()).toBe(2);
        const status = await bookingDetailPage.getRefundStatus();

         expect(status).toBe("Not eligible for refund.");

    })

    test("@regession @booking should be able to cancel the ticket", async({authSetup , eventPage, eventBookingComponent, myBookingPage, bookingDetailPage})=>{

        
        await eventPage.goTo();
        await eventPage.clickOnBookTickets(eventData.defaultMonsoon.title);
    
        await eventBookingComponent.addBookingDetails(user.Details.emmaUser.fullName, user.Details.emmaUser.email, user.Details.emmaUser.phoneNumber);

        await expect(eventBookingComponent.confirmBookingText).toBeVisible();
        
        const refId = await eventBookingComponent.getBookingRefId();
        
        await eventBookingComponent.clickOnViewBooking()
        
        await myBookingPage.clickOnViewDetails(refId);

        await myBookingPage.clickOnCancelBooking(refId);

        await myBookingPage.confirmCancelBooking();

         expect(status).toBeTruthy();

    })







})