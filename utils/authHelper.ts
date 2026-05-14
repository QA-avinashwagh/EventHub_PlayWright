import { APIRequestContext, Page } from "@playwright/test";
import { AuthClient } from "../api/clients/AuthClient";
import { AuthService } from "../api/services/loginService";

export class AuthHelper  {

    async loginViaAPI(request: APIRequestContext, page: Page, email: string, password: string) : Promise<Page>{

        const authClient = new AuthClient(request);
        const authService = new AuthService(authClient);

        const response = await authService.login(email, password);
        const token = response.token;

        await page.goto('/');

        await page.evaluate((token) => {
            localStorage
                .setItem("eventhub_token", token)
        }, token)

        await page.reload();
        return page;

    }


}
