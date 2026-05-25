import {expect, test} from "@playwright/test";
import { AuthClient } from "../../../api/clients/AuthClient";
import { AuthService } from "../../../api/services/AuthService";
import testData from "../../../test_data/loginUser.json"

test("@api-auth Should log in successfully with valid credentials", async({request})=>{

    const authClient = new AuthClient(request);
    const authService = new AuthService(authClient);

    const response = await authService.login(testData.validUser1.email, testData.validUser1.password); 

    test.info().attach("Login Response", {
                body: JSON.stringify(response, null, 2),
                contentType : "application/json"
    })

     expect(response.success).toBeTruthy();
     expect(response.token).toBeDefined();
     expect(response.user.email).toBe(testData.validUser1.email);

})

test("@api-auth should show error on invalid credential", async({request})=>{

    const authClient = new AuthClient(request);
    const authService = new AuthService(authClient);
    
    await expect (authService.login
        (testData.invalidUser.email, testData.invalidUser.password)).rejects.toThrow("Invalid email or password");

})
