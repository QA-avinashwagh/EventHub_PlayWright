import { Locator, Page } from "@playwright/test";
import { BookingCardComponent } from "./components/BookingCardComponent";
import { BookingCancelDialogComponent } from "./components/BookingCancelDialogComponent";
export class MyBookingPage {

    private readonly page: Page
    private readonly bookingTitle: Locator;
    private readonly noBookingsTitle: Locator;
    private readonly noBookingMsg: Locator;
    private readonly browseEventBtn: Locator;

    private readonly failedToLoadHeading : Locator;
    private readonly failToConnectMsg: Locator;
    private readonly retryBtn: Locator;

    private readonly clearAllBookingBtn: Locator;
    private readonly bookingCard: Locator;
    private readonly cancelDialog: Locator;
    private readonly cancelToastMsg: Locator;


    constructor(page: Page) {
        this.page = page;
        this.bookingTitle = page.getByRole('heading', { name: "My Bookings" });
        this.noBookingsTitle = page.getByRole('heading', { name: "No bookings yet" });
        this.noBookingMsg = page.locator('p', { hasText: "You haven't booked any events yet. Browse upcoming events and grab your tickets!" });
        this.browseEventBtn = page.getByRole('button', { name: "Browse Events" });
        this.failedToLoadHeading  = page.getByRole('heading', { name: "Couldn't load bookings" })
        this.failToConnectMsg = page.locator('p', { hasText: "Failed to connect to the server. Please try again." });
        this.retryBtn = page.getByRole('button', { name: 'Retry' });
        this.clearAllBookingBtn = page.getByRole('button', { name: "Clear all bookings" });
        this.bookingCard = page.getByTestId('booking-card');
        this.cancelDialog = page.getByRole('dialog', { name: "Cancel this booking?" });
        this.cancelToastMsg = page.getByText('Booking cancelled successfully')
    }

    async goTo() {
        await this.page.goto('/bookings');
    }

    get title(): Locator{
        return this.bookingTitle; 
    }

    async clearAllBookings() {
        await this.clearAllBookingBtn.click();
    }

    async browseEvents() {
        await this.browseEventBtn.click();
    }

    get noBookingHeading(): Locator{
        return this.noBookingsTitle        
    }

    get noBookingMessage():Locator{
        return this.noBookingMsg
    }

    get headingFailToLoadMessage():Locator{
        return this.failedToLoadHeading;
    }

    get failToConnectMessage(): Locator{
        return this.failToConnectMsg
    }

    get retryButton(): Locator{
        return this.retryBtn;
    }

    findBooking(refId: string) :BookingCardComponent {
        const card= this.bookingCard.filter({ hasText: refId });
        return new BookingCardComponent(card, refId);
    }

    getCancelDialog() : BookingCancelDialogComponent{
        return new BookingCancelDialogComponent(this.cancelDialog); 
    }

    get sucessCancelToast() : Locator{
        return this.cancelToastMsg
    }

}