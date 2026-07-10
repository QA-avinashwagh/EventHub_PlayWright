import { Locator } from "@playwright/test";


export class DeleteEventDialogComponent {

    private readonly dialog: Locator;

    constructor(dialog: Locator) {
        this.dialog = dialog;
    }

    get root(): Locator {
        return this.dialog;
    }

    get title(): Locator {
        return this.dialog.getByRole('heading');
    }

    async delete(): Promise<void> {
        await this.dialog.getByRole('button', { name: "Delete event" })
            .click();
    }

    async cancel(): Promise<void> {
        await this.dialog
            .getByRole('button', { name: "Cancel" })
            .click();
    }

    async getDiscription(): Promise<string> {
        const text = await this.dialog.locator('p').textContent();
        if (!text) throw new Error("Delete modal has no description");
        return text;
    }


}