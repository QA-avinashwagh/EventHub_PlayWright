import { Page, Locator } from "@playwright/test";

export class EventBookingComponent {

    page: Page;

    //Book Tickets 
    bookingTicketPrice: Locator;
    bookingTicketDate: Locator;
    bookingTicketTime: Locator;
    bookingTicketVenue: Locator;
    bookingTicketCity: Locator;
    bookingTicketAvailability: Locator;

    addTicket: Locator;
    reduceTicket: Locator;
    currentTicketCount: Locator;

    fullNameInp: Locator;
    emailInp: Locator;
    phoneNumInp: Locator;

    errorFullname: Locator;
    errorEmail: Locator;
    errorPhoneNum: Locator;

    confirmBookingBtn: Locator;
    totalPriceTxt: Locator

    confirmBookingText: Locator;
    refIdText: Locator;

    constructor(page: Page) {

        this.page = page;

        //Event Details 
        this.bookingTicketPrice = page.locator('div').filter({ hasText: /^Price per ticket/i });
        this.bookingTicketDate = page.locator('div').filter({ hasText: /^Date/i });
        this.bookingTicketTime = page.locator('div').filter({ hasText: /^Time/i });
        this.bookingTicketVenue = page.locator('div').filter({ hasText: /^Venue/i });
        this.bookingTicketCity = page.locator('div').filter({ hasText: /^City/i });
        this.bookingTicketAvailability = page.locator('div').filter({ hasText: /^Available/i });

        //Ticket counter 
        this.addTicket = page.getByRole('button', { name: "+" });
        this.reduceTicket = page.getByRole('button', { name: "-" });
        this.currentTicketCount = page.locator('#ticket-count');

        //Booking user details 
        this.fullNameInp = page.getByLabel('Full Name');
        this.emailInp = page.getByLabel('Email');
        this.phoneNumInp = page.getByLabel('Phone Number');

        //error on user details 
        // This finds the parent container that has the "Full Name" label,
        // then finds the red error paragraph inside it.
        this.errorFullname = page.locator('div')
            .filter({has: page.getByLabel('Full Name')})
            .locator('p.text-red-600')
            .filter({hasText :/name/i});
        this.errorEmail = page.locator('div')
            .filter({ has: page.getByLabel('Email') })
            .locator('p.text-red-600')
            .filter({hasText:/email/i});
        this.errorPhoneNum = page.locator('div')
            .filter({ has: page.getByLabel('Phone Number')})
            .locator('p.text-red-600')
            .filter({hasText:/phone/i});

        //total price 
        this.totalPriceTxt = page.locator('div', {has: page.getByText('Total')});
        this.confirmBookingBtn = page.getByRole('button', { name: "Confirm Booking" });

        //confirm booking 
        this.confirmBookingText = page.getByRole('heading', { name: "Booking Confirmed! 🎉" });

        //refrence id 
        this.refIdText = page.locator('.booking-ref');

    }

    async increaseTicketCount() {
        await this.addTicket.click();
    }

    async decreaseTicketCount() {
        await this.reduceTicket.click();
    }

    async getCurrentTicketCount() :Promise <number>{
        const text = await this.currentTicketCount.textContent();
        return parseInt(text ?? '0' , 10)
    }

    private async extractTextFromDetails(locator: Locator, fieldName: string): Promise<string> {
        const text = await locator.locator('p').nth(1).textContent();

        if (!text) throw new Error(`Event ${fieldName} is not found on the page`);
        return text.trim();
    }

    async getBookingEventPricePerTicket(): Promise<number> {
        const price = await this.extractTextFromDetails(this.bookingTicketPrice, "Price");

        const cleanPrice = price.replace(/[^0-9.]/g, '');
        const eventprice = parseFloat(cleanPrice);
        if (isNaN(eventprice)) {
            throw new Error("Unable to parse booking price");
        }
        return eventprice;
    }

    async getBookingEventDate(): Promise<string> {
        const date = await this.extractTextFromDetails(this.bookingTicketDate, "Date");
        return date;
    }

    async getBookingEventTime(): Promise<string> {
        const time = await this.extractTextFromDetails(this.bookingTicketTime, "Time");
        return time;
    }

    async getBookingEventVenue(): Promise<string> {
        const venue = await this.extractTextFromDetails(this.bookingTicketVenue, "Venue");
        return venue;
    }

    async getBookingEventCity(): Promise<string> {
        const city = await this.extractTextFromDetails(this.bookingTicketCity, "City");
        return city;
    }

    async getBookingEventSeats(): Promise<number> {
        const seatsText = await this.extractTextFromDetails(this.bookingTicketAvailability, "Seats");
        const splittext = seatsText?.split("/");
        const availableSeat = splittext?.at(0);
        if (!availableSeat) throw new Error("could not spilt the available seat");
        const seats = availableSeat.replace(/[^0-9.]/g, '');
        const seat = parseInt(seats);
        if(isNaN(seat)){
            throw new Error("Seat is not able to parse");
        }
        return seat; 
    }

    async getPricePerTicket(): Promise<number> {

        const priceText = await this.extractTextFromDetails(this.bookingTicketPrice, "Price per ticket");
        const price = priceText.replace(/[^0-9.]/g, '');
        const pricePerticket = parseFloat(price);
        if (isNaN(pricePerticket)) {
            throw new Error("Unable to parse the price per ticket");
        }
        return pricePerticket;
    }

    async getTotalPrice(): Promise<number> {
        const totalPrice = await this.totalPriceTxt.getByText(/^\$/).last().textContent();

        if (!totalPrice) throw Error("total price not appeared on the page");
        const price = totalPrice.replace(/[^0-9.]/g, '');
        const actualPrice = parseFloat(price);
        if (isNaN(actualPrice)) {
            throw new Error("Unable to parse total price");
        }
        return actualPrice;
    }

    async clickOnConfirmBooking() {
        await this.confirmBookingBtn.click();
    }

    async addBookingDetails(fullName: string, email: string, phoneNum: string) {

        await this.fullNameInp.fill(fullName);
        await this.emailInp.fill(email);
        await this.phoneNumInp.fill(phoneNum);

        await this.clickOnConfirmBooking();
    }

    async getBookingRefId() {
        return await this.refIdText.textContent();
    }

}