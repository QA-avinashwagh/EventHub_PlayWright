import { Locator, Page } from "@playwright/test";


export class HomePage {

    page : Page;
    loginEmailUser : Locator;
    featuredEventTitle : Locator;
    browseEventsBtn  : Locator;
    myBookingLink : Locator ;



    constructor(page : Page){
        this.page = page;
        this.loginEmailUser = page.getByTestId('user-email-display');
        this.featuredEventTitle = page.getByRole('heading', {name : "Featured Events"});
        this.browseEventsBtn = 
        this.myBookingLink = page.getByRole('button', {name:'My Bookings'});
    }


}