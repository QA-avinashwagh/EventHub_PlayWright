import { Page, Locator} from "@playwright/test"

export class LoginPage {

    private readonly page: Page;
    private readonly loginPageTitle: Locator;
    private readonly inpEmail: Locator;
    private readonly inpPassword: Locator;
    private readonly signInBtn: Locator;
    private readonly registerPageLink: Locator;
    private readonly invalidEmailMsg: Locator;
    private readonly invalidPasswordLengthMsg: Locator;
    private readonly invalidEmailPasswordMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginPageTitle = page.getByRole('heading', { name: "Sign in to EventHub" });
        this.inpEmail = page.getByLabel('Email');
        this.inpPassword = page.locator('#password');
        this.signInBtn = page.getByRole('button', { name: "Sign In" });
        this.registerPageLink = page.getByRole('link', { name: 'Register' });
        this.invalidEmailMsg = page.getByText("Enter a valid email");
        this.invalidPasswordLengthMsg = page.getByText("Password must be at least 6 characters");
        this.invalidEmailPasswordMsg = page.getByText("invalid email or password")
    }

    async navigate(): Promise<void> {
        await this.page.goto('/login');
    }

    async login(email: string, password: string): Promise<void> {
        await this.inpEmail.fill(email);
        await this.inpPassword.fill(password);
        await this.signInBtn.click()
    }

    async clickOnRegisterPageLink(): Promise<void> {
        await this.registerPageLink.click();
    }

    get logInPageTitle(): Locator{
        return this.loginPageTitle;
    }

    get emailErrorMessage(): Locator {
       return this.invalidEmailMsg;

    }

    get pasowrdLengthErrorMessage() :Locator {
        return this.invalidPasswordLengthMsg;
    }

    get invalidCredentialMessage():Locator{
        return this.invalidEmailPasswordMsg
    }


}