import { Locator } from "@playwright/test";


export class EventCardComponent {

    private readonly card: Locator
    private readonly eventName: string

    constructor(card: Locator, eventName: string) {
        this.card = card;
        this.eventName = eventName;
    }

    get root():Locator{
        return this.card; 
    }

    async getPrice(): Promise<number> {
        const priceText = await this.card.getByText(/^\$/).textContent();
        if (!priceText) throw new Error(`Could not find price for event: ${this.eventName}`);
        const price = priceText.replace(/[^0-9.]/g, '');
        return parseFloat(price);
    }

    async getAvailableSeats(): Promise<number> {
        const availableSeatText = await this.card.getByText(/seats available/i).textContent();
        if (!availableSeatText) throw new Error(`Could not find seats for event: ${this.eventName}`);
        const availableSeats = availableSeatText.replace(/[^0-9.]/g, '');
        return parseFloat(availableSeats);
    }

    async book(): Promise<void> {
        await this.card.getByRole('link', { name: "Book Now" }).click();
    }

    get soldOutButton(): Locator {
        return this.card.getByRole('link', { name: "Sold Out" });
    }


}
