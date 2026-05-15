import { Locator, Page } from "@playwright/test";

export class BookingPage {

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

    async goTo(){
        await this.page.goto('/bookings');
    }

    async clickOnClearAllBookings(){
        await this.clearAllBookingBtn.click();
    }

    async clickOnBrowseEvent(){
        await this.browseEventBtn.click();
    }

    getEventCard(eventName : string){
        return this.bookingCard.filter({hasText:eventName});
    }

    async clickOnViewDetails(eventName : string){
        await this.getEventCard(eventName).getByRole('button',{name:/View Details/i}).click();
    }

    async clickOnCancelBooking(eventName : string){
        await this.getEventCard(eventName).getByRole('button', {name:/Cancel Booking/i}).click();
    }

    async confirmCancelBooking(){
        await this.cancelDialog.getByRole('button', {name: /Yes, cancel it/i}).click();
    }

    async dismissCancelBooking(){
        await this.cancelDialog.getByRole('button', {name: /Cancel/i}).click(); 
    }

    private async extractTextFromCard(eventName :string, i : number){
        const text = await this.getEventCard(eventName).locator('span').nth(i).textContent();
        
        if (!text) throw new Error(`Event ${eventName} is not found on the page`);
        return text.trim();        
    }

    async getRefernceId(eventName : string) : Promise<string>{
        const refId = await this.getEventCard(eventName).locator('div', {has: this.page.getByTestId('booking-id')}).locator('span').first().textContent();
        if(!refId)throw new Error(`Refernce ID not found on the event ${eventName}`);
        return refId;
    }

    async getEventDate(eventName :string) : Promise <string>{
       const date = await this.extractTextFromCard(eventName,1);
       return date;
    }

    async getBookedEventTicketCount(eventName : string): Promise <string>{
      const ticket = await this.extractTextFromCard(eventName, 2);
      return ticket;
    }

    async getBookedEventVenue(eventName: string) : Promise <string>{
        const venue =await this.extractTextFromCard(eventName,3)
        return venue;
    }

    async getBookedEventDate(eventName : string): Promise <string>{
        const date = await this.extractTextFromCard(eventName, 4);
        return date;
    }


}