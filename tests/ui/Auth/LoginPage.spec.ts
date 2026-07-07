import {expect, test} from "../../../fixtures/baseFixture";
import userData from "../../../test_data/loginUser.json";

test("@login @sanity should login successfully with valid credentails", async({loginPage, homePage})=>{

    await loginPage.navigate();
    await loginPage.login(userData.validUser1.email, userData.validUser1.password);

    await expect (homePage.loggedInUserEmail).toBeVisible();
    await expect (homePage.loggedInUserEmail).toHaveText(userData.validUser1.email);
    await expect(homePage.myBookingsLink).toBeVisible();
})

test("@login @sanity should show error for invalid email ",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login("david@yopmail", userData.validUser1.password);

    await expect (loginPage.emailErrorMessage).toBeVisible();
    await expect (loginPage.emailErrorMessage).toHaveText("Enter a valid email");
})

test("@login @sanity should show validation error when password is less than minimum length",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login(userData.validUser1.email, "Pass");

    await expect (loginPage.pasowrdLengthErrorMessage).toBeVisible();
    await expect (loginPage.pasowrdLengthErrorMessage).toHaveText("Password must be at least 6 characters");
})

test("@login @regression should show toast error for invalid email and password",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login("david123@yopmail.com", "Pass@4567");

    await expect(loginPage.invalidCredentialMessage).toHaveText("Invalid email or password");

})

