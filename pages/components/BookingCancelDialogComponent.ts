import { Locator } from "@playwright/test";


export class BookingCancelDialogComponent {

    private readonly dialog: Locator;

    constructor(dialog: Locator) {
        this.dialog = dialog;
    }

    get root(): Locator{
        return this.dialog; 
    }
    async confirm() : Promise<void> {
        await this.dialog.getByRole('button', { name: /Yes, cancel it/i }).click();
    }

    async dismiss() : Promise<void>{
        await this.dialog.getByRole('button', { name: /Cancel/i }).click();
    }

    get title() : Locator{
        return this.dialog.locator('.modal-title'); 
    }

    get message() : Locator{
        return this.dialog.locator('.leading-relaxed'); 
    }


}