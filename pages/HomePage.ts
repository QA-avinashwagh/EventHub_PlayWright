import { Locator, Page } from "@playwright/test";

export class HomePage {

    private readonly page: Page;
    private readonly loginEmailUser: Locator;
    private readonly featuredEventTitle: Locator;
    private readonly browseEventsBtn: Locator;
    private readonly myBookingLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginEmailUser = page.getByTestId('user-email-display');
        this.featuredEventTitle = page.getByRole('heading', { name: "Featured Events" });
        this.browseEventsBtn =
            this.myBookingLink = page.getByRole('button', { name: 'My Bookings' });
    }

    async goTo(): Promise<void> {
        await this.page.goto('/');
    }

    get loggedInUserEmail(): Locator{
        return this.loginEmailUser;
    }

    get featureEventTitle() : Locator {
        return this.featuredEventTitle;
    }

    get browsEventButton(): Locator {
        return this.browseEventsBtn;
    }

    async openBrowseEvent(): Promise<void> {
        await this.browseEventsBtn.click();
    }

    get myBookingsLink(): Locator {
        return this.myBookingLink;
    }

    async clickOnMyBookingLinks(): Promise<void> {
        await this.myBookingLink.click();
    }

}