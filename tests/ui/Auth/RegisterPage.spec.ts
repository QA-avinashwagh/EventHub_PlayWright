import {test, expect} from "../../../fixtures/baseFixture";
import data from "../../../test_data/registerUser.json";

const user = data.validData.email;
const time = Date.now().toString().slice(-6);
const userEmail = `${user}_${time}@yopmail.com`;

test("@register @sanity should register successfully with valid user data ", async({registerPage, homePage})=>{
    
    await registerPage.navigate();
    
    await registerPage.createAccount(userEmail, data.validData.password, data.validData.confirmPassword);
    await expect(homePage.loggedInUserEmail).toHaveText(userEmail);
    await expect (homePage.myBookingsLink).toBeVisible();
});

test("@register @regression should show error on invalid email", async({registerPage})=>{
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.invalidEmail.email, data.invalidEmail.password, data.invalidEmail.confirmPassword);
    await expect (registerPage.emailErrorMessage).toBeVisible();
    await expect (registerPage.emailErrorMessage).toHaveText(data.invalidEmail.expected);
});

test("@register @regression should show validation error when password does not meet requirement", async({registerPage})=>{
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.passwordTooShort.email, data.passwordTooShort.password,data.passwordTooShort.confirmPassword);
    await expect (registerPage.passwordErrorMessage).toBeVisible();
    await expect (registerPage.passwordErrorMessage).toHaveText(data.passwordTooShort.expected);
});

test("@register @regression should show error when passwords does not match", async({registerPage})=>{
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.passwordMismatch.email, data.passwordMismatch.password, data.passwordMismatch.confirmPassword);
    await expect (registerPage.passwordMismatchErrorMessage).toBeVisible();
    await expect (registerPage.passwordMismatchErrorMessage).toHaveText(data.passwordMismatch.expected);
});

test("@register @regression should show error on already register email", async({registerPage})=>{
     
    await registerPage.navigate();
    
    await registerPage.createAccount(data.alreadyRegistered.email, data.alreadyRegistered.password, data.alreadyRegistered.confirmPassword);
    await expect (registerPage.emailAlreadyRegisteredError).toBeVisible();
    await expect (registerPage.emailAlreadyRegisteredError).toHaveText(data.alreadyRegistered.expected);
});
