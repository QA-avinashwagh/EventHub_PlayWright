import { test as base, Page, expect } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { HomePage } from "../pages/HomePage"
import { EventPage } from "../pages/EventPage"
import { EventBookingComponent } from "../pages/components/EventBookingComponent"
import { EventFormComponent } from "../pages/components/EventFormComponent";
import { AuthHelper } from "../utils/authHelper"
import testData from "../test_data/loginUser.json"
import { RegisterPage } from "../pages/RegisterPage"
import { MyBookingPage } from "../pages/MyBookingPage"
import { BookingDetailsPage } from "../pages/BookingDetailPage"

type MyFixtures = {
    loginPage: LoginPage;
    registerPage : RegisterPage;
    homePage: HomePage;
    eventPage: EventPage;
    eventFormComponent: EventFormComponent;
    eventBookingComponent: EventBookingComponent;
    authHelper: AuthHelper;
    authSetup: Page;
    myBookingPage : MyBookingPage;
    bookingDetailPage : BookingDetailsPage;
}

export const test = base.extend<MyFixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    registerPage : async({page}, use)=> {
        await use(new RegisterPage(page));
    }, 

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    eventPage: async ({ page }, use) => {
        await use(new EventPage(page))
    },

    eventFormComponent: async ({ page }, use) => {
        await use(new EventFormComponent(page))
    },

    eventBookingComponent: async ({ page }, use) => {
        await use(new EventBookingComponent(page))
    },

    authHelper: async ({ }, use) => {
        await use(new AuthHelper())
    },

    authSetup : async ({ request, page, authHelper, homePage }, use) => {

        const authenticatedPage = await authHelper.loginViaAPI(request, page,
            testData.validUser1.email,
            testData.validUser1.password);
            await expect(homePage.loginEmailUser).toBeVisible();

            await use(authenticatedPage);
    },

    myBookingPage : async({page}, use)=>{
        await use(new MyBookingPage(page));
    },   

    bookingDetailPage : async({page}, use) =>{
      await use (new BookingDetailsPage(page));
    }
})
export { expect };