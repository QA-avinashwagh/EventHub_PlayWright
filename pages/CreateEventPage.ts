import { Locator, Page } from "@playwright/test";
import { EventData } from "../models/EventData";
import { EventRowComponent } from "./components/EventRowComponent";
import { DeleteEventDialogComponent } from "./components/DeleteEventDialogComponent";

export class CreateEventPage {

    private readonly page: Page;

    // New Event Page Locator
    private readonly addEventTitle: Locator;
    private readonly editEventTitle: Locator;

    private readonly eventTitleInp: Locator;
    private readonly eventDescriptionTextbox: Locator;
    private readonly categoryDropdown: Locator;
    private readonly cityInp: Locator;
    private readonly venueInp: Locator;
    private readonly eventDateAndTimeSelect: Locator;
    private readonly priceInp: Locator;
    private readonly seatsInp: Locator;
    private readonly imageUrl: Locator;
    private readonly addEventBtn: Locator;
    private readonly successMsg: Locator;
    private readonly updateBtn: Locator;
    private readonly updateMsg: Locator;
    private readonly allEventsTitle: Locator;
    private readonly eventDialog: Locator;
    private readonly dismissToastBtn: Locator;

    private readonly errorTitle: Locator;
    private readonly errorCity: Locator;
    private readonly errorVenue: Locator;
    private readonly errorDate: Locator;
    private readonly errorPrice: Locator;
    private readonly errorSeats: Locator;

    private readonly eventTableRow: Locator;

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
        this.venueInp = page.getByLabel('Venue');
        this.eventDateAndTimeSelect = page.getByLabel("Event Date & Time");
        this.priceInp = page.getByLabel('Price ($)');
        this.seatsInp = page.getByLabel('Total Seats');
        this.imageUrl = page.getByLabel('image URL (optional)');
        this.addEventBtn = page.getByRole("button", { name: "Add Event" });
        this.successMsg = page.getByText("Event created!");
        this.updateBtn = page.getByTestId('add-event-btn');
        this.updateMsg = page.getByText("Event updated!");
        this.dismissToastBtn = page.getByRole('button', { name: 'Dismiss' })

        //Error message on the field 
        this.errorTitle = page.getByText("Title is required");
        this.errorCity = page.getByText("City is required");
        this.errorVenue = page.getByText("Venue is required");
        this.errorDate = page.getByText("Event date is required");
        this.errorPrice = page.getByText("Enter a valid price (≥ 0)");
        this.errorSeats = page.getByText("Must have at least 1 seat");

        //event listing in creating page 
        this.allEventsTitle = page.getByRole("heading", { name: "All Events" });

        //all rows 
        this.eventTableRow = page.getByTestId('event-table-row')

        // Delete event Modal 
        this.eventDialog = page.getByRole('dialog', {name : "Delete this event?"});
    }

    get title(): Locator {
        return this.addEventTitle;
    }

    async clickOnAddEvent() {
        await this.addEventBtn.click();
    }

    async createEvent(eventData: EventData) {

        await this.fillTitle(eventData.title)
        await this.eventDescriptionTextbox.fill(eventData.description);
        await this.updateCategory(eventData.category);
        await this.cityInp.fill(eventData.city);
        await this.fillVenu(eventData.venue);
        await this.eventDateAndTimeSelect.fill(eventData.dateAndTime);
        await this.fillPrice(eventData.price);
        await this.fillSeats(eventData.seats);

        if (eventData.imageUrl) {
            await this.imageUrl.fill(eventData.imageUrl);
        }
        await this.addEventBtn.click();
    }

    get successMessage(): Locator {
        return this.successMsg;
    }

    get allEventTitles(): Locator {
        return this.allEventsTitle;
    }

    // getters for error
    get errorOnTitle(): Locator {
        return this.errorTitle;
    }

    get errorOnCity(): Locator {
        return this.errorCity;
    }

    get errorOnDate(): Locator {
        return this.errorDate;
    }

    get errorOnVenue(): Locator {
        return this.errorVenue;
    }

    get errorOnPrice(): Locator {
        return this.errorPrice;
    }

    get errorOnSeats(): Locator {
        return this.errorSeats;
    }

    //Edit Event fields 
    get editTitle() : Locator{
        return this.editEventTitle;
    }

    async fillTitle(title: string) {
        await this.eventTitleInp.fill(title);
    }

    async fillVenu(venue: string) {
        await this.venueInp.fill(venue);
    }

    async fillPrice(price: string) {
        await this.priceInp.fill(price);
    }

    async fillSeats(seat: string) {
        await this.seatsInp.fill(seat);
    }

    async updateCategory(category: string) {
        await this.categoryDropdown.selectOption(category);
    }

    async clickOnUpdateEvent() {
        await this.updateBtn.click();
    }

    get updateMessage(): Locator{
        return this.updateMsg;
    }

    async disMissToast() {
        await this.dismissToastBtn.click();
    }

    getEventRow(eventName: string) : EventRowComponent{
        const row = this.eventTableRow.filter({ hasText: eventName });
        return new EventRowComponent(row, eventName);
    }

    getDeleteDialog() : DeleteEventDialogComponent{
        return new DeleteEventDialogComponent(this.eventDialog);
    }


}