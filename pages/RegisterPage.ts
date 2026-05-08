import { Page, Locator } from "@playwright/test";

export class RegisterPage {

    page: Page;
    registerPageTitle: Locator;
    inpEmail: Locator;
    inpPassword: Locator;
    inpConfirmPassword: Locator;
    createAccountBtn: Locator;
    signLink : Locator;
    invalidEmailMsg : Locator;
    invalidPasswordReqmMsg : Locator;
    passwordUnMatchMsg : Locator;
    alreadyRegisterEmail : Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerPageTitle = page.getByRole('heading', {name:"Create your account"});
        this.inpEmail = page.locator('#register-email');
        this.inpPassword = page.locator('#register-password');
        this.inpConfirmPassword = page.getByPlaceholder("Repeat your password");
        this.createAccountBtn = page.getByRole('button', {name :"Create Account"}); 
        this.signLink = page.locator("[href*='/login']");
        this.invalidEmailMsg = page.getByText("Enter a valid email");
        this.invalidPasswordReqmMsg = page.getByText("Password does not meet the requirements below");
        this.passwordUnMatchMsg = page.getByText("Passwords do not match");
        this.alreadyRegisterEmail = page.getByText("Email already registered");
    }

    async navigate() {
        await this.page.goto('/register');
    }

    async createAccount(email : string, password : string, confirmPassword : string){

        await this.inpEmail.fill(email);
        await this.inpPassword.fill(password);
        await this.inpConfirmPassword.fill(confirmPassword);

        await this.createAccountBtn.click();
    }

    async clickOnSignInLink (){
        await this.signLink.click();
    }

}