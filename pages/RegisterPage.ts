import { Page, Locator} from "@playwright/test";
export class RegisterPage {

    private readonly page: Page;
    private readonly registerPageTitle: Locator;
    private readonly inpEmail: Locator;
    private readonly inpPassword: Locator;
    private readonly inpConfirmPassword: Locator;
    private readonly createAccountBtn: Locator;
    private readonly signLink: Locator;
    private readonly invalidEmailMsg: Locator;
    private readonly invalidPasswordReqmMsg: Locator;
    private readonly passwordUnMatchMsg: Locator;
    private readonly alreadyRegisterEmail: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerPageTitle = page.getByRole('heading', { name: "Create your account" });
        this.inpEmail = page.locator('#register-email');
        this.inpPassword = page.locator('#register-password');
        this.inpConfirmPassword = page.getByPlaceholder("Repeat your password");
        this.createAccountBtn = page.getByRole('button', { name: "Create Account" });
        this.signLink = page.locator("[href*='/login']");
        this.invalidEmailMsg = page.getByText("Enter a valid email");
        this.invalidPasswordReqmMsg = page.getByText("Password does not meet the requirements below");
        this.passwordUnMatchMsg = page.getByText("Passwords do not match");
        this.alreadyRegisterEmail = page.getByText("Email already registered");
    }

    async navigate() {
        await this.page.goto('/register');
    }

    get registerPageHeading(): Locator{
        return this.registerPageTitle;
    }

    async createAccount(email: string, password: string, confirmPassword: string) {
        await this.inpEmail.fill(email);
        await this.inpPassword.fill(password);
        await this.inpConfirmPassword.fill(confirmPassword);
        await this.createAccountBtn.click();
    }

    async openLoginPage() {
        await this.signLink.click();
    }

    get emailErrorMessage() : Locator {
        return this.invalidEmailMsg
    }

    get passwordErrorMessage(): Locator {
        return this.invalidPasswordReqmMsg;
    }

    get passwordMismatchErrorMessage(): Locator {
        return this.passwordUnMatchMsg;
    }

    get emailAlreadyRegisteredError():Locator {
       return this.alreadyRegisterEmail;
    }


}