import { test as base, Page, expect } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { HomePage } from "../pages/HomePage"
import { EventPage } from "../pages/EventPage"
import { EventBookingComponent } from "../pages/components/EventBookingComponent"
import { CreateEventPage } from "../pages/CreateEventPage";
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
    createEventPage: CreateEventPage;
    eventBookingComponent: EventBookingComponent;
    authHelper: AuthHelper;
    authSetup: Page;
    myBookingPage : MyBookingPage;
    bookingDetailPage : BookingDetailsPage;
    loginViaUi : HomePage; 
}

export const test = base.extend<MyFixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    loginViaUi : async({loginPage, homePage}, use)=>{
        await loginPage.navigate();
        await  loginPage.login(testData.validUser2.email, testData.validUser2.password);
        await expect(homePage.loggedInUserEmail).toBeVisible();

        await use(homePage);
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

    createEventPage: async ({ page }, use) => {
        await use(new CreateEventPage(page))
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
            await expect(homePage.loggedInUserEmail).toBeVisible();

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