import { Locator } from "@playwright/test";

export class BookingCardComponent {

    private readonly card: Locator
    private readonly refId: string;

    //Span events insinde booking card 
    private static readonly EVENT_DATE_INDEX = 1;
    private static readonly BOOKING_DATE_INDEX = 3;
    private static readonly TICKET_COUNT_INDEX = 4;
    private static readonly CITY_INDEX = 5;

    constructor(card: Locator, refId: string) {
        this.card = card;
        this.refId = refId;
    }

    get root() : Locator{
        return this.card;
    }


    async viewDetails(): Promise<void> {
        await this.card.getByRole('button', { name: /View Details/i }).click();
    }

    async cancel(): Promise<void> {
        await this.card.getByRole('button', { name: /Cancel Booking/i }).click();
    }

    async getBookingId(): Promise<string> {
        const id = await this.card.locator('div', { has: this.card.getByTestId('booking-id') }).locator('span').first().textContent();
        if (!id) throw new Error(`Refernce ID not found : ${this.refId}`);
        return id.trim();
    }

    async getEventTitle(): Promise<string> {
        const title = await this.card.getByRole('heading').textContent();
        if (!title) throw new Error(`Event title is not found with refernce id ${this.refId}`);
        return title.trim();
    }

    private async extractTextFromCard(i: number) {
        const text = await this.card.locator('span').nth(i).textContent();

        if (!text) throw new Error(`Event with ${this.refId} is not found on the page`);
        return text.trim();
    }

    async getEventDate(): Promise<string> {
        const date = await this.extractTextFromCard(BookingCardComponent.EVENT_DATE_INDEX);
        return date;
    }

    async getBookedEventTicketCount(): Promise<number> {
        const ticket = await this.extractTextFromCard(BookingCardComponent.TICKET_COUNT_INDEX);

        const text = ticket.replace(/[^0-9]/g, '');
        return parseInt(text, 10);
    }

    async getBookedEventCity(): Promise<string> {
        const city = await this.extractTextFromCard(BookingCardComponent.CITY_INDEX);

        const text = city.split(' ');

        text.shift(); //remove first element
        return text.join(' ');
    }

    async getBookingDate(): Promise<string> {
        const date = await this.extractTextFromCard(BookingCardComponent.BOOKING_DATE_INDEX);
        return date;
    }

}