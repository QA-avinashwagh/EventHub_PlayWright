import { Locator, Page } from "@playwright/test";


class BookingDetailsPage{

    page : Page;
    cancelBookingBtn : Locator; 
    cancelDialog : Locator;
    eventDetails : Locator;

    constructor(page : Page){
        this.page = page;
        this.cancelBookingBtn = page.getByRole('button', {name : 'Cancel Booking'});
        this.cancelDialog = page.getByRole('dialog', {name: "Cancel this booking?"});
            this.eventDetails = page.getByRole('heading', {name: /Event Details/i}); 
    }

    async clickOnCanceBtn(){
        await this.cancelBookingBtn.click(); 
    }

    async clickOnYesCancelItOnCancelDialog(){
        await this.cancelDialog.getByRole('button', {name: /Yes, cancel it/i}).click();
    }

    async clickOnCancelOnCanelBookingDialog(){
        await this.cancelDialog.getByRole('button', {name: /Cancel/i}).click(); 
    }

    getEventDetailsCard(){
        return this.eventDetails;
    }

    async getEventTitle(){
        return await this.eventDetails
                .locator('span', {hasText:"Event"})
                .locator('span').textContent();
    }




}