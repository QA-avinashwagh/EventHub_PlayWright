import { Locator, Page } from "@playwright/test";

export class BookingDetailsPage {

    private readonly page: Page;
    private readonly cancelBookingBtn: Locator;
    private readonly cancelDialog: Locator;
    private readonly eventDetails: Locator;
    customerDetails: Locator;
    paymentSummary: Locator;
    checkEligibilityRefundBtn: Locator;
    refundSpinner: Locator;
    refundResult: Locator;
    referanceId : Locator; 

    constructor(page: Page) {
        this.page = page;
        this.cancelBookingBtn = page.getByRole('button', { name: 'Cancel Booking' });
        this.cancelDialog = page.getByRole('dialog', { name: "Cancel this booking?" });
        this.eventDetails = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Event Details/i }) });
        this.customerDetails = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Customer Details/i }) });

        this.paymentSummary = page.locator('div.bg-white')
            .filter({ has: page.getByRole('heading', { name: /Payment Summary/i }) });

        this.checkEligibilityRefundBtn = page.getByTestId('check-refund-btn');
        this.refundSpinner = page.getByTestId('refund-spinner');
        this.refundResult = page.getByTestId('refund-result');
        this.referanceId = page.locator('div', {has:page.getByText(/confirmed/i)}).locator('span');
    }


    async getRefID(): Promise<string>{
        const refid = await this.referanceId.first().textContent();
        if(!refid) throw new Error("Refernce id does not found booking detail page"); 
        return refid;
    }

    async clickOnCancelBookingBtn() {
        await this.cancelBookingBtn.click();
    }

    async confirmCancelBooking() {
        await this.cancelDialog.getByRole('button', { name: /Yes, cancel it/i }).click();
    }

    async dismissCancelBooking() {
        await this.cancelDialog.getByRole('button', { name: /Cancel/i }).click();
    }

    private async getEventDetailsValue(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row =  this.eventDetails.locator('div.flex').filter({has: this.page.locator('span').filter({hasText: labelRegex}).first()});
        
        const detail = await row.locator('span')
                        .nth(1).textContent();

        if (!detail) throw new Error(`Event details were not found ${labelName}`);
        return detail.trim();
    }

    async getEventTitle(): Promise<string> {
        return await this.getEventDetailsValue('Event');
    }

    async getEventCategory(): Promise<string> {
        return await this.getEventDetailsValue('Category');
    }

    async getEventDate(): Promise<string> {
        return await this.getEventDetailsValue('Date');
    }

    async getEventVenue(): Promise<string> {
        return await this.getEventDetailsValue('Venue');
    }

    async getEventCity(): Promise<string> {
        return await this.getEventDetailsValue('City');
    }

    private async getCustomerDetailsValue(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row = this.customerDetails.locator('div.flex').filter({has: this.page.locator('span').filter({ hasText: labelRegex })});
            
        const details = await row.locator('span')
                        .nth(1).textContent();

        if (!details) throw new Error(`Customer details were not found on ${labelName}`);

        return details.trim();
    }

    async getCustomerName(): Promise<string> {
        return await this.getCustomerDetailsValue('Name');
    }

    async getCustomerEmail(): Promise<string> {
        return await this.getCustomerDetailsValue('Email');
    }

    async getCustomerPhone(): Promise<string> {
        return await this.getCustomerDetailsValue('Phone');
    }

    private async getPaymentSummaryValue(labelName: string): Promise<string> {
        // We construct a dynamic RegExp using the variable passed in
        const labelRegex = new RegExp(`^${labelName}$`, 'i');

        const row = this.paymentSummary.locator('div.flex').filter({has: this.page.locator('span').filter({ hasText: labelRegex })});
            
        const paymentText = await row.locator('span')
                        .nth(1).textContent();

        if (!paymentText) throw new Error(`Payment summary were not found at ${labelName}`);

        return paymentText.trim();
    }

    async getTickets(): Promise<number> {
        const ticketText = await this.getPaymentSummaryValue('Tickets');
        const ticket = parseInt(ticketText);
        return ticket;

    }

    async getPricePerTicket(): Promise<number> {
        const price = await this.getPaymentSummaryValue('Price per ticket');

        if (!price) {
            throw new Error("Price per ticket value was not found on the page or is null");
        }

        const cleanPrice = price.replace(/[^0-9.]/g, '');
        const pricePerTicket = parseFloat(cleanPrice);
        if (isNaN(pricePerTicket)) {
            throw new Error("Unable to parse the price per ticket")
        }
        return pricePerTicket;
    }

    async getTotalPaid(): Promise<number> {
        const priceText = await this.getPaymentSummaryValue('Total Paid');

        if (!priceText) {
            throw Error("total price not appeared on the page");
        }

        const actulPrice = priceText.replace(/[^0-9.]/g, '');
        const totalPrice = parseFloat(actulPrice);
        if (isNaN(totalPrice)) {
            throw new Error("Unable to parse total price");
        }
        return totalPrice;
    }

    async getRefundStatus() : Promise <string>{
        await this.checkEligibilityRefundBtn.click();

        await this.refundSpinner.waitFor({ state: 'hidden' });

        const status = await this.refundResult.locator('span strong').textContent();
        if(!status) throw new Error('Refund status is not available');
        return status; 
    }


}