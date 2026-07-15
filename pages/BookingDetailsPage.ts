import { Locator, Page } from "@playwright/test";
import { BookingCancelDialogComponent } from "./components/BookingCancelDialogComponent";

export class BookingDetailsPage {

    private readonly page: Page;
    private readonly cancelBookingBtn: Locator;
    private readonly cancelToastMsg: Locator;

    private readonly cancelDialog: Locator;
    private readonly eventDetails: Locator;
    private readonly customerDetails: Locator;
    private readonly paymentSummary: Locator;
    private readonly checkEligibilityRefundBtn: Locator;
    private readonly refundSpinner: Locator;
    private readonly refundResult: Locator;
    private readonly referenceId: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cancelDialog = page.getByRole('dialog', { name: "Cancel this booking?" });
        this.cancelBookingBtn = page.getByRole('button', { name: 'Cancel Booking' });

        this.cancelToastMsg = page.getByText('Booking cancelled successfully')

        this.eventDetails = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Event Details/i }) });
        this.customerDetails = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Customer Details/i }) });

        this.paymentSummary = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Payment Summary/i }) });

        this.checkEligibilityRefundBtn = page.getByTestId('check-refund-btn');
        this.refundSpinner = page.getByTestId('refund-spinner');
        this.refundResult = page.getByTestId('refund-result');
        this.referenceId = page.locator('div', { has: page.getByText(/confirmed/i) }).locator('span');
    }


    async getRefID(): Promise<string> {
        const refid = await this.referenceId.first().textContent();
        if (!refid) throw new Error("Refernce id does not found booking detail page");
        return refid;
    }

    async cancelBooking(): Promise<void> {
        await this.cancelBookingBtn.click();
    }

    getCancelDialog(): BookingCancelDialogComponent {
        return new BookingCancelDialogComponent(this.cancelDialog);
    }

    get sucessCancelToast(): Locator {
        return this.cancelToastMsg
    }

    private async getEventDetails(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row = this.eventDetails.locator('div.flex').filter({ has: this.page.locator('span').filter({ hasText: labelRegex }).first() });

        const detail = await row.locator('span')
            .nth(1).textContent();

        if (!detail) throw new Error(`Event details were not found ${labelName}`);
        return detail.trim();
    }

    async getEventTitle(): Promise<string> {
        return await this.getEventDetails('Event');
    }

    getEventCategory(): Promise<string> {
        return this.getEventDetails('Category');
    }

    getEventDate(): Promise<string> {
        return this.getEventDetails('Date');
    }

    getEventVenue(): Promise<string> {
        return this.getEventDetails('Venue');
    }

    getEventCity(): Promise<string> {
        return this.getEventDetails('City');
    }

    private async getCustomerDetails(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row = this.customerDetails.locator('div.flex').filter({ has: this.page.locator('span').filter({ hasText: labelRegex }) });

        const details = await row.locator('span')
            .nth(1).textContent();

        if (!details) throw new Error(`Customer details were not found on ${labelName}`);

        return details.trim();
    }

    getCustomerName(): Promise<string> {
        return this.getCustomerDetails('Name');
    }

    getCustomerEmail(): Promise<string> {
        return this.getCustomerDetails('Email');
    }

    getCustomerPhone(): Promise<string> {
        return this.getCustomerDetails('Phone');
    }

    private async getPaymentSummary(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row = this.paymentSummary.locator('div.flex').filter({ has: this.page.locator('span').filter({ hasText: labelRegex }) });

        const paymentText = await row.locator('span')
            .nth(1).textContent();

        if (!paymentText) throw new Error(`Payment summary were not found at ${labelName}`);

        return paymentText.trim();
    }

    async getTickets(): Promise<number> {
        const ticketText = await this.getPaymentSummary('Tickets');
        const ticket = parseInt(ticketText);
        return ticket;
    }

    async getPricePerTicket(): Promise<number> {
        const price = await this.getPaymentSummary('Price per ticket');

        const cleanPrice = price.replace(/[^0-9.]/g, '');
        const pricePerTicket = parseFloat(cleanPrice);
        if (isNaN(pricePerTicket)) {
            throw new Error("Unable to parse the price per ticket")
        }
        return pricePerTicket;
    }

    async getTotalPaid(): Promise<number> {
        const priceText = await this.getPaymentSummary('Total Paid');

        const actulPrice = priceText.replace(/[^0-9.]/g, '');
        const totalPrice = parseFloat(actulPrice);
        if (isNaN(totalPrice)) {
            throw new Error("Unable to parse total price");
        }
        return totalPrice;
    }

    async getRefundStatus(): Promise<string> {
        await this.checkEligibilityRefundBtn.click();

        await this.refundSpinner.waitFor({ state: 'hidden' });

        const status = await this.refundResult.locator('span strong').textContent();
        if (!status) throw new Error('Refund status is not available');
        return status;
    }


}