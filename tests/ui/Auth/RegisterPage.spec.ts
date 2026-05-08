import {test, expect} from "@playwright/test";
import { RegisterPage } from "../../../pages/RegisterPage";
import { HomePage } from "../../../pages/HomePage";
import data from "../../../test_data/registerUser.json";

const user = data.validData.email;
const time = Date.now().toString().slice(-6);
const userEmail = `${user}_${time}@yopmail.com`;


test("@register @sanity should register successfully with valid user data ", async({page})=>{
    
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);

    await registerPage.navigate();
    
    await registerPage.createAccount(userEmail, data.validData.password, data.validData.confirmPassword);
    await expect(homePage.loginEmailUser).toHaveText(userEmail);
    await expect (homePage.myBookingLink).toBeVisible();
});

test("@register @regression should show error on invalid email", async({page})=>{
    
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.invalidEmail.email, data.invalidEmail.password, data.invalidEmail.confirmPassword);
    await expect (registerPage.invalidEmailMsg).toBeVisible();
    await expect (registerPage.invalidEmailMsg).toHaveText(data.invalidEmail.expected);
});

test("@register @regression should show validation error when password does not meet requirement", async({page})=>{
    
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.passwordTooShort.email, data.passwordTooShort.password,data.passwordTooShort.confirmPassword);
    await expect (registerPage.invalidPasswordReqmMsg).toBeVisible();
    await expect (registerPage.invalidPasswordReqmMsg).toHaveText(data.passwordTooShort.expected);
});

test("@register @regression should show error when passwords does not match", async({page})=>{
    
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.passwordMismatch.email, data.passwordMismatch.password, data.passwordMismatch.confirmPassword);
    await expect (registerPage.passwordUnMatchMsg).toBeVisible();
    await expect (registerPage.passwordUnMatchMsg).toHaveText(data.passwordMismatch.expected);
});

test("@register @regression should show error on already register email", async({page})=>{
    
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigate();
    
    await registerPage.createAccount(data.alreadyRegistered.email, data.alreadyRegistered.password, data.alreadyRegistered.confirmPassword);
    await expect (registerPage.alreadyRegisterEmail).toBeVisible();
    await expect (registerPage.alreadyRegisterEmail).toHaveText(data.alreadyRegistered.expected);
});
