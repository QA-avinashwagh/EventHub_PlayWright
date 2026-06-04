import { Locator, Page } from "@playwright/test";

export class MyBookingPage {

    page : Page
    bookingTitle : Locator;
    noBookingsTitle : Locator;
    noBookingMsg : Locator; 
    browseEventBtn : Locator;
    
    loadingBooking : Locator;
    failToConnectMsg : Locator;
    retryButton : Locator;

    clearAllBookingBtn : Locator;
    bookingCard : Locator;
    cancelDialog : Locator; 
    cancelToastMsg : Locator;


    constructor(page : Page){
        this.page = page;
        this.bookingTitle = page.getByRole('heading', {name: "My Bookings"});
        this.noBookingsTitle = page.getByRole('heading', {name: "No bookings yet"});
        this.noBookingMsg = page.locator('p', {hasText: "You haven't booked any events yet. Browse upcoming events and grab your tickets!"});
        this.browseEventBtn = page.getByRole('button',{name : "Browse Events"});
        this.loadingBooking = page.getByRole('heading', {name:"Couldn't load bookings"})
        this.failToConnectMsg = page.locator('p', {hasText: "Failed to connect to the server. Please try again."});
        this.retryButton = page.getByRole('button', {name:'Retry'}); 
        this.clearAllBookingBtn = page.getByRole('button', {name: "Clear all bookings"}); 
        this.bookingCard = page.getByTestId('booking-card');
        this.cancelDialog = page.getByRole('dialog', {name: "Cancel this booking?"});
        this.cancelToastMsg = page.getByText('Booking cancelled successfully')
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

    getEventCard(refId : string ){
        return this.bookingCard.filter({hasText:refId});
    }

    async clickOnViewDetails(refId : string){
        await this.getEventCard(refId).getByRole('button',{name:/View Details/i}).click();
    }

    async clickOnCancelBooking(refId : string){
        await this.getEventCard(refId).getByRole('button', {name:/Cancel Booking/i}).click();
    }

    async confirmCancelBooking(){
        await this.cancelDialog.getByRole('button', {name: /Yes, cancel it/i}).click();
    }

    async dismissCancelBooking(){
        await this.cancelDialog.getByRole('button', {name: /Cancel/i}).click(); 
    }

    private async extractTextFromCard(refId :string, i : number){
        const text = await this.getEventCard(refId).locator('span').nth(i).textContent();
        
        if (!text) throw new Error(`Event with ${refId} is not found on the page`);
        return text.trim();        
    }

    async getRefernceId(refID : string) : Promise<string>{
        const refId = await this.getEventCard(refID).locator('div', {has: this.page.getByTestId('booking-id')}).locator('span').first().textContent();
        if(!refId)throw new Error(`Refernce ID not found : ${refID}`);
        return refId;
    }

    async getEventTitle(refId : string) : Promise<string>{
        const title = await this.getEventCard(refId).getByRole('heading').textContent();
        if(!title) throw new Error(`Event title is not found with refernce id ${refId}`);
        return title;
    }

    async getEventDate(refId :string) : Promise <string>{
       const date = await this.extractTextFromCard(refId,1);
       return date;
    }

    async getBookedEventTicketCount(refId : string): Promise <number>{
      const ticket = await this.extractTextFromCard(refId, 4);

      const text = ticket.replace(/[^0-9]/g, '');
       return parseInt(text);
    }

    async getBookedEventCity(refId: string) : Promise <string>{
        const city =await this.extractTextFromCard(refId,5);

        const text = city.split(' ');

        text.shift(); //remove first element
        return text.join(' ');
    }

    async getBookedEventDate(refId : string): Promise <string>{
        const date = await this.extractTextFromCard(refId, 3);
        return date;
    }


}