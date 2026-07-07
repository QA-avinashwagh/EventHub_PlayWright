import { Locator, Page } from "@playwright/test";
import { EventCardComponent } from "./components/EventCardComponent";
export class EventPage {

    private readonly page: Page;
    private readonly addNewEventBtn: Locator;

    // search input and filters 
    private readonly searchInp: Locator;
    private readonly categoriesDropDown: Locator;
    private readonly citiesDropDown: Locator;
    private readonly clearFilterBtn: Locator;
    private readonly noEventResult: Locator;
    private readonly eventCard: Locator;
    private readonly loadingSkeleton: Locator;
    private readonly loadingIcon: Locator;
    private readonly soldoutText: Locator;

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

    async goTo(): Promise<void> {
        await this.page.goto('/events');
    }

    get noEventMessage(): Locator {
        return this.noEventResult;
    }

    get addNewButton(): Locator {
        return this.addNewEventBtn
    }

    async waitForSkeletonToAppear(): Promise<void> {
        await this.loadingSkeleton.first().waitFor({ state: 'visible' });
    }

    async waitForResultToLoad(): Promise<void> {
        await this.loadingSkeleton.first().waitFor({ state: 'hidden', timeout: 5000 });
    }

    async searchEvent(eventName: string): Promise<void> {
        await this.searchInp.pressSequentially(eventName);

        await Promise.race([
            this.eventCard.first().waitFor(),
            this.noEventResult.waitFor()
        ]);
    }

    async filterCategory(category: string): Promise<void> {
        await this.categoriesDropDown.selectOption(category);
    }

    async filterCity(city: string): Promise<void> {
        await this.citiesDropDown.selectOption(city);
    }

    async clearFilter() : Promise<void>{
        await this.clearFilterBtn.click();
    }

    findEvent(eventName: string): EventCardComponent {
        const card = this.eventCard.filter({ hasText: eventName });
         return new EventCardComponent(card, eventName);
    }

    async clickOnAddNewEvent(): Promise<void> {
        await this.addNewEventBtn.click();
    }

    get soldOutText(): Locator {
        return (this.soldoutText);
    }

}



