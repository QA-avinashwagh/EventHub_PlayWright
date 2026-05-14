import { Locator, Page } from "@playwright/test";

class BookingPage {

    page : Page
    bookingTitle : Locator;
    noBookingsTitle : Locator;
    noBookingMsg : Locator; 
    browseEventBtn : Locator;
    clearAllBookingBtn : Locator;
    bookingCard : Locator;
    
    cancelDialog : Locator; 


    constructor(page : Page){
        this.page = page;
        this.bookingTitle = page.getByRole('heading', {name: "My Bookings"});
        this.noBookingsTitle = page.getByRole('heading', {name: "No bookings yet"});
        this.noBookingMsg = page.locator('div', {has:page.getByRole('heading', {name: "No bookings yet"})}).locator('p');
        this.browseEventBtn = page.getByRole('button',{name : "Browse Events"});

        this.clearAllBookingBtn = page.getByRole('button', {name: "Clear all bookings"}); 
        this.bookingCard = page.getByTestId('booking-card');
        this.cancelDialog = page.getByRole('dialog', {name: "Cancel this booking?"});
    }

    async goToBooking(){
        await this.page.goto('/bookings');
    }

    async clickOnClearAllBookings(){
        await this.clearAllBookingBtn.click();
    }

    async clickOnBrowseEvent(){
        await this.browseEventBtn.click();
    }

    async isEventPresent(eventName : string){
       return this.bookingCard.filter({hasText :eventName}).isVisible();
    }

    getEventCard(eventName : string){
        return this.bookingCard.filter({hasText:eventName});
    }

    async clickOnViewDetils(eventName : string){
        await this.getEventCard(eventName).getByRole('button',{name:/View Details/i}).click();
    }

    async clickOnCancelBooking(eventName : string){
        await this.getEventCard(eventName).getByRole('button', {name:/Cancel Bookings/i}).click();
    }

    async clickOnYesCancelItOnCancelDialog(){
        await this.cancelDialog.getByRole('button', {name: /Yes, cancel it/i}).click();
    }

    async clickOnCancelOnCanelBookingDialog(){
        await this.cancelDialog.getByRole('button', {name: /Cancel/i}).click(); 
    }

    async getEventDate(eventName :string){
        await this.getEventCard(eventName).locator('span').first().textContent();
    }

    async getBookedEventTicketCount(eventName : string){
        await this.getEventCard(eventName).locator('span').nth(2).textContent();
    }

    async getBookedEventVenue(eventName: string){
        await this.getEventCard(eventName).locator('span').nth(3).textContent();
    }

    async getBookedEventDate(eventName : string){
        await this.getEventCard(eventName).locator('span').nth(4).textContent();
    }



}