import {test, expect} from "@playwright/test";
import { AuthHelper } from "../../../utils/authHelper";
import data from "../../../test_data/loginUser.json"
import { HomePage } from "../../../pages/HomePage";


test("@homepage @regression verify featured events present on home page", async({page, request})=>{

    const authHelper = new AuthHelper();
    const homePage = new HomePage(page);

    await authHelper.loginViaAPI(request,page,
            data.validUser1.email,
            data.validUser1.password
     )

    await expect(homePage.loginEmailUser).toBeVisible();
    await expect(homePage.featuredEventTitle).toBeVisible()



})