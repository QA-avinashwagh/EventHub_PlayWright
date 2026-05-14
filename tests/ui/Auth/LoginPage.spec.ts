import {expect, test} from "../../../fixtures/baseFixture";
import userData from "../../../test_data/loginUser.json";

test("@login @sanity should login successfully with valid credentails", async({loginPage, homePage})=>{

    await loginPage.navigate();
    await loginPage.login(userData.validUser1.email, userData.validUser1.password);

    await expect(homePage.loginEmailUser).toBeVisible();
    await expect(homePage.loginEmailUser).toHaveText(userData.validUser1.email);
    await expect (homePage.myBookingLink).toBeVisible();
})

test("@login @sanity should show error for invalid email ",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login("david@yopmail", userData.validUser1.password);

    await expect(loginPage.invalidEmailMsg).toBeVisible();
    await expect(loginPage.invalidEmailMsg).toHaveText("Enter a valid email");
})

test("@login @sanity should show validation error when password is less than minimum length",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login(userData.validUser1.email, "Pass");

    await expect(loginPage.invalidPasswordLengthMsg).toBeVisible();
    await expect(loginPage.invalidPasswordLengthMsg).toHaveText("Password must be at least 6 characters");
})

test("@login @regression should show toast error for invalid email and password",async({loginPage})=>{

    await loginPage.navigate();
    await loginPage.login("david123@yopmail.com", "Pass@4567");

    await expect(loginPage.invalidEmailPasswordMsg).toHaveText("Invalid email or password");

})

