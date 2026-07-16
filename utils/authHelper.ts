import { APIRequestContext, Page } from "@playwright/test";
import { AuthClient } from "../api/clients/AuthClient";
import { AuthService } from "../api/services/AuthService";

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
        }, token); 

    //     console.log(
    //             await page.evaluate(() =>
    //                     Object.entries(localStorage)
    //     )
    // );
    
        // console.log(page.url());
        // await page.waitForTimeout(5000);

        await page.goto("/");
        return page;

    }


}
