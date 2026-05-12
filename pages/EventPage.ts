import { Locator, Page } from "@playwright/test";

export class EventPage {

    page: Page;
    eventLink: Locator;
    addNewEventBtn: Locator;

    // search input and filters 
    searchInp: Locator;
    categoriesDropDown: Locator;
    citiesDropDown: Locator;
    clearFilterBtn: Locator;
    noEventResult: Locator;
    eventCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventLink = page.getByTestId('nav-events');
        this.addNewEventBtn = page.getByRole("button", { name: "Add New Event" });

        //Seach inputs and filters
        this.searchInp = page.getByPlaceholder("Search events, venues…");
        this.categoriesDropDown = page.getByRole('combobox').filter({ hasText: "All Categoreis" });
        this.citiesDropDown = page.getByRole('combobox').filter({ hasText: "All Cities" });
        this.clearFilterBtn = page.getByRole('button', { name: "Clear filters" });
        this.noEventResult = page.getByRole('heading', { name: "No events found" });
        this.eventCard = page.getByTestId('event-card');

    }

    async goTo() {
        await this.page.goto('/events');
    }

    async searchEvent(eventName: string) {
        await this.searchInp.pressSequentially(eventName);

        await Promise.race([
            this.eventCard.first().waitFor(),
            this.noEventResult.waitFor()
        ]);
    }

    async isEventVisible(eventName: string) {
        const isVisible = await this.eventCard.filter({ hasText: eventName }).isVisible();
        return isVisible;
    }

    async getEventPrice(eventName: string) {
        const event = this.eventCard.filter({ hasText: eventName });
        const priceText = await event.locator('p').textContent();
        if (!priceText) throw new Error(`Could not find price for event: ${eventName}`);
        const price = priceText.replace(/[^0-9.]/g, '');
        return parseFloat(price);
    }

    async getAvailableSeats(eventName: string) {
        const event = this.eventCard.filter({ hasText: eventName });
        const avilSeatText = await event.locator('span').textContent();
        if (!avilSeatText) throw new Error(`Could not find seats for event: ${eventName}`);
        const availableSeats = avilSeatText.replace(/[^0-9.]/g, '');
        return parseFloat(availableSeats);
    }

    async clickOnBookTickets(eventName: string) {
        const event = this.eventCard.filter({ hasText: eventName });
        await event.getByRole('link', { name: "Book Now" }).click();
    }

    async clickOnAddNewEvent() {
        await this.addNewEventBtn.click();
    }

}



