import { Locator } from "@playwright/test";

export class BookingFormComponent {

    private readonly form: Locator;
    private readonly addTicket: Locator;
    private readonly reduceTicket: Locator;
    private readonly currentTicketCount: Locator;

    private readonly fullNameInp: Locator;
    private readonly emailInp: Locator;
    private readonly phoneNumInp: Locator;

    private readonly errorOnFullname: Locator;
    private readonly errorOnEmail: Locator;
    private readonly errorOnPhone: Locator;

    private readonly confirmBookingBtn: Locator;
    private readonly totalPriceTxt: Locator


    constructor(form: Locator) {

        this.form = form;

        //Ticket counter 
        this.addTicket = form.getByRole('button', { name: "+" });
        this.reduceTicket = form.getByRole('button', { name: "−" });
        this.currentTicketCount = form.locator('#ticket-count');

        //Booking user details 
        this.fullNameInp = form.getByLabel('Full Name');
        this.emailInp = form.getByLabel('Email');
        this.phoneNumInp = form.getByLabel('Phone Number');

        //error on user details 
        // This finds the parent container that has the "Full Name" label,
        // then finds the red error paragraph inside it.
        this.errorOnFullname = form.locator('div')
            .filter({ has: form.getByLabel('Full Name') })
            .locator('p.text-red-600')
            .filter({ hasText: /name/i });
        this.errorOnEmail = form.locator('div')
            .filter({ has: form.getByLabel('Email') })
            .locator('p.text-red-600')
            .filter({ hasText: /email/i });
        this.errorOnPhone = form.locator('div')
            .filter({ has: form.getByLabel('Phone Number') })
            .locator('p.text-red-600')
            .filter({ hasText: /phone/i });

        //total price 
        this.totalPriceTxt = form.locator('div', { has: form.getByText('Total') });
        this.confirmBookingBtn = form.getByRole('button', { name: "Confirm Booking" });


    }

    get root(): Locator {
        return this.form;
    }

    async increaseTicketCount(): Promise<void> {
        await this.addTicket.click();
    }

    async decreaseTicketCount(): Promise<void> {
        await this.reduceTicket.click();
    }

    get decreaseButton(): Locator {
        return this.reduceTicket;
    }

    get incraseButton(): Locator {
        return this.addTicket;
    }

    // This method to test max limit for ticket booking 
    async setTicketCountTo(count: number): Promise<void> {
        for (let i = 1; i < count; i++) {
            await this.increaseTicketCount();
        }
    }

    async getCurrentTicketCount(): Promise<number> {
        const text = await this.currentTicketCount.textContent();
        return parseInt(text ?? '0', 10)
    }

    async confirmBooking(): Promise<void> {
        await this.confirmBookingBtn.click();
    }

    async book(fullName: string, email: string, phoneNum: string): Promise<void> {

        await this.fullNameInp.fill(fullName);
        await this.emailInp.fill(email);
        await this.phoneNumInp.fill(phoneNum);

        await this.confirmBooking();
    }

    async enterBookingDetails(fullName: string, email: string, phoneNum: string): Promise<void> {

        await this.fullNameInp.fill(fullName);
        await this.emailInp.fill(email);
        await this.phoneNumInp.fill(phoneNum);
    }

    get fullNameError(): Locator {
        return this.errorOnFullname;
    }

    get phoneError(): Locator {
        return this.errorOnPhone;
    }

    get emailError(): Locator {
        return this.errorOnEmail;
    }

    async getTotalPrice(): Promise<number> {
        const totalPrice = await this.totalPriceTxt.getByText(/^\$/).last().textContent();

        if (!totalPrice) throw Error("total price not appeared on the page");
        const price = totalPrice.replace(/[^0-9.]/g, '');
        const actualPrice = parseFloat(price);
        if (isNaN(actualPrice)) {
            throw new Error("Unable to parse total price");
        }
        return actualPrice;
    }

    

}