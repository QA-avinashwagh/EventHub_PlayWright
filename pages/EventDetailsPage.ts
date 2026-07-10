import { Page, Locator } from "@playwright/test";
import { BookingFormComponent } from "./components/BookingFormComponent";

export class EventDetailsPage {

    //Event Details locator 
    private readonly title : Locator;
    private readonly bookingTicketPrice: Locator;
    private readonly bookingTicketDate: Locator;
    private readonly bookingTicketTime: Locator;
    private readonly bookingTicketVenue: Locator;
    private readonly bookingTicketCity: Locator;
    private readonly bookingTicketAvailability: Locator;

    //Booking form component
    private readonly bookingFormRoot : Locator;

    constructor(page: Page) {

        //Event Details
        this.title = page.getByRole('heading');  
        this.bookingTicketPrice = page.locator('div').filter({ hasText: /^Price per ticket/i });
        this.bookingTicketDate = page.locator('div').filter({ hasText: /^Date/i });
        this.bookingTicketTime = page.locator('div').filter({ hasText: /^Time/i });
        this.bookingTicketVenue = page.locator('div').filter({ hasText: /^Venue/i });
        this.bookingTicketCity = page.locator('div').filter({ hasText: /^City/i });
        this.bookingTicketAvailability = page.locator('div').filter({ hasText: /^Available/i });

        this.bookingFormRoot = page.getByRole('form');
    }

    get Title() : Locator{
        return this.title;
    }

    private async extractTextFromDetails(locator: Locator, fieldName: string): Promise<string> {
        const text = await locator.locator('p').nth(1).textContent();

        if (!text) throw new Error(`Event ${fieldName} is not found on the page`);
        return text.trim();
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

    async getDate(): Promise<string> {
        const date = await this.extractTextFromDetails(this.bookingTicketDate, "Date");
        return date;
    }

    async getTime(): Promise<string> {
        const time = await this.extractTextFromDetails(this.bookingTicketTime, "Time");
        return time;
    }

    async getVenue(): Promise<string> {
        const venue = await this.extractTextFromDetails(this.bookingTicketVenue, "Venue");
        return venue;
    }

    async getCity(): Promise<string> {
        const city = await this.extractTextFromDetails(this.bookingTicketCity, "City");
        return city;
    }
    
    private async getSeatsValues(): Promise<[number, number]> {
        const seatsText = await this.extractTextFromDetails(this.bookingTicketAvailability, "Seats");
        const seatValues = seatsText.split("/").map(text => Number(text.trim()));
        return [seatValues[0], seatValues[1]];
    }

    async getAvailableSeats(): Promise<number> {
        const availableSeats = await this.getSeatsValues();
        return availableSeats[0];
    }

    async getTotalSeats(): Promise<number> {
        const totalSeats = await this.getSeatsValues();
        return totalSeats[1];
    }

    bookingForm(): BookingFormComponent {
        return new BookingFormComponent(this.bookingFormRoot);
    }

}