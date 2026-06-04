import { Locator, Page } from "@playwright/test";
export class EventPage {

    page: Page;
    addNewEventBtn: Locator;

    // search input and filters 
    searchInp: Locator;
    categoriesDropDown: Locator;
    citiesDropDown: Locator;
    clearFilterBtn: Locator;
    noEventResult: Locator;
    eventCard: Locator;
    loadingSkeleton : Locator;
    loadingIcon : Locator;
    soldoutText : Locator; 

    constructor(page: Page) {
        this.page = page;
        this.addNewEventBtn = page.getByRole("button", { name: "Add New Event" });

        //Seach inputs and filters
        this.searchInp = page.getByPlaceholder("Search events, venues…");
        this.categoriesDropDown = page.getByRole('combobox').nth(0);
        this.citiesDropDown = page.getByRole('combobox').nth(1);
        this.clearFilterBtn = page.getByRole('button', { name: "Clear filters" });
        this.noEventResult = page.getByRole('heading', { name: "No events found" });
        this.eventCard = page.getByTestId('event-card');
        this.loadingSkeleton = page.locator('.animate-pulse');
        this.loadingIcon = page.getByRole('status', { name: 'Loading' })
        this.soldoutText = page.getByText('Sold Out'); 
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

    async filterCategory(category : string){
        await this.categoriesDropDown.selectOption(category); 
    }

    async filterCity(city : string){
        await this.citiesDropDown.selectOption(city);
    }

    async waitForResultToLoad(){
        await this.loadingSkeleton.first().waitFor({state :'hidden'});
    }


    async isEventVisible(eventName: string) {
        const isVisible = await this.eventCard.filter({ hasText: eventName }).isVisible();
        return isVisible;
    }

    getEventCard(eventName: string) {
        return this.eventCard.filter({ hasText: eventName });
    }

    async getEventPrice(eventName: string) {
        const event = this.getEventCard(eventName);
        const priceText = await event.getByText(/^\$/).textContent();
        if (!priceText) throw new Error(`Could not find price for event: ${eventName}`);
        const price = priceText.replace(/[^0-9.]/g, '');
        return parseFloat(price);
    }

    async getAvailableSeats(eventName: string) {
        const event = this.getEventCard(eventName);
        const availableSeatText = await event.getByText(/seats available/i).textContent();
        if (!availableSeatText) throw new Error(`Could not find seats for event: ${eventName}`);
        const availableSeats = availableSeatText.replace(/[^0-9.]/g, '');
        return parseFloat(availableSeats);
    }

    async clickOnBookTickets(eventName: string) {
        const event = this.getEventCard(eventName);
        await event.getByRole('link', { name: "Book Now" }).click();
    }

    getSoldOutButton(eventName: string): Locator{
        const event = this.getEventCard(eventName);
        return event.getByRole('link', { name: "Sold Out" });
    }

    async clickOnAddNewEvent() {
        await this.addNewEventBtn.click();
    }

}



