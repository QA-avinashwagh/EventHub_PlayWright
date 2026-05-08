import {Page, Locator} from "@playwright/test"

export class LoginPage{

    page : Page;
    loginPageTitle : Locator; 
    inpEmail : Locator;
    inpPassword :Locator;
    signInBtn : Locator; 
    registerPageLink : Locator;
    invalidEmailMsg : Locator;
    invalidPasswordLengthMsg : Locator;
    invalidEmailPasswordMsg : Locator;

    constructor(page : Page){
        this.page = page ;
        this.loginPageTitle = page.getByRole('heading', {name : "Sign in to EventHub"});
        this.inpEmail = page.getByLabel('Email');
        this.inpPassword = page.locator('#password'); 
        this.signInBtn = page.getByRole('button', {name:"Sign In"});
        this.registerPageLink = page.getByRole('link', {name: 'Register'});
        this.invalidEmailMsg = page.getByText("Enter a valid email");
        this.invalidPasswordLengthMsg = page.getByText("Password must be at least 6 characters");
        this.invalidEmailPasswordMsg = page.getByText("invalid email or password")
    }

    async navigate(){
        await this.page.goto('/login');
    }

    async login(email : string , password : string){
        await this.inpEmail.fill(email);
        await this.inpPassword.fill (password);
        await  this.signInBtn.click()
        
    }

    async clickOnRegisterPageLink(){
        await this.registerPageLink.click();
    }

}