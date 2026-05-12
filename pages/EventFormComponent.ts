import { Locator, Page } from "@playwright/test";
import { EventData } from "../models/EventData";

export class EventFormComponents {

    page: Page;

    // New Event Page Locator
    addEventTitle: Locator;
    editEventTitle: Locator;

    eventTitleInp: Locator;
    eventDescriptionTextbox: Locator;
    categoryDropdown: Locator;
    cityInp: Locator;
    venueInp: Locator;
    eventDateAndTimeSelect: Locator;
    priceInp: Locator;
    seatsInp: Locator;
    imageUrl: Locator;
    addEventBtn: Locator;
    successMsg: Locator;
    allEventsTitle: Locator;
    eventDialog: Locator;

    errorTitle: Locator;
    errorCity: Locator;
    errorVenue: Locator;
    errorDate: Locator;
    errorPrice: Locator;
    errorSeats: Locator;

    constructor(page: Page) {
        this.page = page;


        //Event titles 
        this.addEventTitle = page.getByRole('heading', { name: "New Event" });
        this.editEventTitle = page.getByRole('heading', { name: "Edit Event" });

        // Add New Event- fields  
        this.eventTitleInp = page.getByTestId('event-title-input');
        this.eventDescriptionTextbox = page.getByPlaceholder('Describe the event…');
        this.categoryDropdown = page.getByLabel('Category');
        this.cityInp = page.getByLabel('City');
        this.venueInp = page.getByLabel('Venu');
        this.eventDateAndTimeSelect = page.getByLabel("Event Date & Time");
        this.priceInp = page.getByLabel('Price ($)');
        this.seatsInp = page.getByLabel('Total Seats');
        this.imageUrl = page.getByLabel('image URL (optional)');
        this.addEventBtn = page.getByRole("button", { name: "Add Event" });
        this.successMsg = page.getByText("Event created!");

        //Error message on the field 
        this.errorTitle = page.getByText("Title is required");
        this.errorCity = page.getByText("City is required");
        this.errorVenue = page.getByText("Venue is required");
        this.errorDate = page.getByText("Event date is required");
        this.errorPrice = page.getByText("Enter a valid price (≥ 0)");
        this.errorSeats = page.getByText("Must have at least 1 seat");

        //event listing in creating page 
        this.allEventsTitle = page.getByRole("heading", { name: "All Events" });

        // Delete event Modal 
        this.eventDialog = page.getByRole('dialog');

    }

    async addEventDetails(eventData : EventData) {

        await this.eventTitleInp.fill(eventData.title);
        await this.eventDescriptionTextbox.fill(eventData.description);
        await this.categoryDropdown.selectOption(eventData.category);
        await this.cityInp.fill(eventData.city);
        await this.venueInp.fill(eventData.venue);
        await this.eventDateAndTimeSelect.fill(eventData.dateAndTime);
        await this.priceInp.fill(eventData.price);
        await this.seatsInp.fill(eventData.seats);
        await this.imageUrl.fill(eventData.imageUrl);

        await this.addEventBtn.click();
    }

    async clickOnAddEvent() {
        await this.addEventBtn.click();
    }

    getToastDisplayed() {
        return this.successMsg;
    }

    getAllEventTitle() {
        return this.allEventsTitle;
    }

    getEventRow(eventName: string) {
        const row = this.page.getByRole('row').filter({ hasText: eventName });
        return row;
    }

    async editEvent(eventName: string) {
        const row = this.getEventRow(eventName);
        await row.getByRole('button', { name: "Edit" }).click();
    }

    async deleteEvent(eventName: string) {
        const row = this.getEventRow(eventName);
        await row.getByRole('button', { name: "Delete" }).click();

        await this.eventDialog
            .getByRole('button', { name: "Delete event" })
            .click();
    }

    isDeleteEventDialogPresent() {
        const title = this.eventDialog.getByRole('heading', { name: "Delete this event?" });
        return title;
    }


}