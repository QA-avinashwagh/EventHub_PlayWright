import { Locator } from "@playwright/test";


export class EventRowComponent {

    private readonly row: Locator;
    private readonly eventName: string;
    private static readonly TITLE = 0;
    private static readonly CATEGORY = 1;
    private static readonly CITY = 2;
    private static readonly DATE = 3;
    private static readonly PRICE = 4;
    private static readonly SEATS = 5;

    constructor(row: Locator, eventName: string) {
        this.row = row;
        this.eventName = eventName
    }

    get root(): Locator {
        return this.row;
    }

    async edit(): Promise<void> {
        await this.row.getByRole('button', { name: "Edit" }).click();
    }

    async delete(): Promise<void> {
        await this.row.getByRole('button', { name: "Delete" }).click();
    }

    private async getCellText(index: number): Promise<string> {
        const text = await this.row.locator('td').nth(index).textContent();
        if (!text) throw new Error(`Could not read table cell for event '${this.eventName}'`);
        return text.trim();
    }

    getTitle(): Promise<string> {
        return this.getCellText(EventRowComponent.TITLE);
    }

    getCategory(): Promise<string> {
        return this.getCellText(EventRowComponent.CATEGORY);
    }

    getCity(): Promise<string> {
        return this.getCellText(EventRowComponent.CITY);
    }

    getDate(): Promise<string> {
        return this.getCellText(EventRowComponent.DATE);
    }

    async getPrice(): Promise<number> {
        const priceText = await this.getCellText(EventRowComponent.PRICE);
        const price = priceText.replace(/[^0-9.]/g, '');
        return parseFloat(price)
    }

    async getSeats(): Promise<string> {
        const seatsText = await this.getCellText(EventRowComponent.SEATS);
        return seatsText.trim();
    }

    private async getSeatsValues(): Promise<[number, number]> {
        const seatValues = (await this.getSeats()).split("/").map(text => Number(text.trim()));
        return [seatValues[0], seatValues[1]]
    }

    async getAvailableSeats(): Promise<number> {
        const availableSeats = await this.getSeatsValues();
        return availableSeats[0];
    }

    async getTotalSeats(): Promise<number> {
        const totalSeats = await this.getSeatsValues();
        return totalSeats[1];
    }

    async isReadOnly(): Promise<boolean> {
        const action = await this.row.filter({ hasText: "Read-only" }).isVisible();
        return action;
    }

}