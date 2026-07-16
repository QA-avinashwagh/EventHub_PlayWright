import { Locator, Page } from "@playwright/test";
import { BookingCardComponent } from "./components/BookingCardComponent";
import { BookingCancelDialogComponent } from "./components/BookingCancelDialogComponent";
export class MyBookingPage {

    private readonly page: Page
    private readonly bookingTitle: Locator;
    private readonly noBookingsTitle: Locator;
    private readonly noBookingMsg: Locator;
    private readonly browseEventBtn: Locator;

    private readonly failedToLoadHeading: Locator;
    private readonly failToConnectMsg: Locator;
    private readonly retryBtn: Locator;

    private readonly skeleton: Locator;

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
        this.failedToLoadHeading = page.getByRole('heading', { name: "Couldn't load bookings" })
        this.failToConnectMsg = page.locator('p', { hasText: "Failed to connect to the server. Please try again." });
        this.retryBtn = page.getByRole('button', { name: 'Retry' });
        this.clearAllBookingBtn = page.getByRole('button', { name: "Clear all bookings" });
        this.bookingCard = page.getByTestId('booking-card');
        this.cancelDialog = page.getByRole('dialog', { name: "Cancel this booking?" });
        this.cancelToastMsg = page.getByText('Booking cancelled successfully')
        this.skeleton = page.locator('.space-y-4');
    }

    async goTo() {
        await this.page.goto('/bookings');
    }

    get title(): Locator {
        return this.bookingTitle;
    }

    // async clearAllBookings(): Promise<void> {
    //     await this.clearAllBookingBtn.click();
    // }

    clearAllBookings(): Promise<void> {

        console.log("A Before click");
        return this.clearAllBookingBtn.click();

    }

    async browseEvents(): Promise<void> {
        await this.browseEventBtn.click();
    }

    get noBookingHeading(): Locator {
        return this.noBookingsTitle
    }

    get noBookingMessage(): Locator {
        return this.noBookingMsg
    }

    get headingFailToLoadMessage(): Locator {
        return this.failedToLoadHeading;
    }

    get failToConnectMessage(): Locator {
        return this.failToConnectMsg
    }

    get retryButton(): Locator {
        return this.retryBtn;
    }

    findBooking(refId: string): BookingCardComponent {
        const card = this.bookingCard.filter({ hasText: refId });
        return new BookingCardComponent(card, refId);
    }

    getCancelDialog(): BookingCancelDialogComponent {
        return new BookingCancelDialogComponent(this.cancelDialog);
    }

    get sucessCancelToast(): Locator {
        return this.cancelToastMsg
    }

    async handleDialog(
        action: "accept" | "dismiss",
        trigger: () => Promise<void>
    ): Promise<string> {
        console.log("1 Register listener");

        // 1. Create the promise that resolves when the dialog appears
        const dialogPromise = this.page.waitForEvent("dialog");

        console.log("2 Firing trigger");
        // 2. Fire the action that triggers the dialog. Do NOT await it here,
        // otherwise it will block the execution thread.
        const triggerPromise = trigger();

        // 3. Wait for the dialog event to pop up first
        const dialog = await dialogPromise;
        console.log("4 Dialog received");

        const message = dialog.message();
        console.log(message);

        // 4. Handle the dialog (accept/dismiss). This unblocks the click event!
        if (action === "accept") {
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
        console.log("5 Dialog handled");

        // 5. Clean up by awaiting the trigger promise to ensure the click finished completely
        await triggerPromise;
        console.log("3 Trigger finished");

        return message;
    }

}