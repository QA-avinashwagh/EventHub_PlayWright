import { Page, Locator } from "@playwright/test";

export class EventBookingComponents{

    page : Page ;

    //Book Tickets 
    bkTicketPrice: Locator;
    bkTicketDate : Locator;
    bkTicketTime : Locator;
    bkTicketVenue : Locator; 
    bkTicketCity : Locator;
    bkTicketAvailable : Locator;

    addTicket : Locator;
    reduceTicket : Locator;
    currentTicketCount : Locator;

    fullNameInp : Locator;
    emailInp : Locator;
    phoneNumInp : Locator;

    errorFullname : Locator;
    errorEmail : Locator;
    errorPhoneNum : Locator;

    confirmBookingBtn : Locator;
    totalPriceTxt : Locator


    constructor(page : Page){
        
        this.page = page;

        //Event Details 
        this.bkTicketPrice = page.locator('div').filter({ hasText: /^Price per ticket/i });
        this.bkTicketDate = page.locator('div').filter({hasText : /^Date/i});
        this.bkTicketTime = page.locator('div').filter({hasText : /^Time/i});
        this.bkTicketVenue = page.locator('div').filter({hasText : /^Venue/i});
        this.bkTicketCity = page.locator('div').filter({hasText : /^City/i});
        this.bkTicketAvailable = page.locator('div').filter({hasText : /^Available/i});
        
        //Ticket counter 
        this.addTicket = page.getByRole('button', {name: "+"});
        this.reduceTicket = page.getByRole('button', {name: "-"});
        this.currentTicketCount = page.locator('#ticket-count'); 

        //Booking user details 
        this.fullNameInp = page.getByLabel('Full Name');
        this.emailInp = page.getByLabel('Email');
        this.phoneNumInp = page.getByLabel('Phone Number');

        //error on user details 
        this.errorFullname = this.fullNameInp.locator('p');
        this.errorEmail = this.emailInp.locator('p');
        this.errorPhoneNum = this.phoneNumInp.locator('p');

        //total price 
        this.totalPriceTxt = page.getByText("Total");
        this.confirmBookingBtn = page.getByRole('button', {name :"Confirm Booking"});
    }

    async getBookEventPrice() {
        const priceRow = await this.bkTicketPrice.locator('p').nth(1).textContent();

        if (!priceRow) throw new Error("Price not found on the page");

        const cleanPrice = priceRow.replace(/[^0-9.]/g, '');
        return parseFloat(cleanPrice);
    }

    async getBookedEventDate(){
        const dateRow = await this.bkTicketDate.locator('p').nth(1).textContent();

        if(!dateRow) throw new Error("Event date not found on the page");

        return dateRow; 
    }

    async getBookedEventTime(){
        const timeRow = await this.bkTicketTime.locator('p').nth(1).textContent();

        if(!timeRow) throw new Error("Event Time not found on the page");

        return timeRow; 
    }
    
    async getBookedEventVenue(){
        const venueRow = await this.bkTicketVenue.locator('p').nth(1).textContent();

        if(!venueRow) throw new Error("Event date not found on the page");

        return venueRow; 
    }

    async getBookedEventCity(){
        const cityRow = await this.bkTicketCity.locator('p').nth(1).textContent();

        if(!cityRow) throw new Error("Event date not found on the page");

        return cityRow; 
    }
    
    async getBookedEventSeats(){
        const seatsRow = await this.bkTicketAvailable.locator('p').nth(1).textContent();

        if(!seatsRow) throw new Error("Event date not found on the page");

        return seatsRow; 
    }

    async getTotalPrice() {
          const totalPrice = await this.bkTicketPrice.locator('span').textContent();
          
          if(!totalPrice) throw Error("total price not appeared on the page")
          const price = totalPrice.replace(/[^0-9.]/g, '');
          return parseFloat(price);

    }

    async clickOnConfirmBooking(){
        await this.confirmBookingBtn.click();
    }

    async addBookingDetails(fullName : string, email : string, phoneNum :string){

        await this.fullNameInp.fill(fullName);
        await this.emailInp.fill(email);
        await this.phoneNumInp.fill(phoneNum);
        
        await this.clickOnConfirmBooking();
    }

}