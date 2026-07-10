import { AuthHelper } from "../../../utils/authHelper";
import data from "../../../test_data/loginUser.json"
import { test, expect } from "../../../fixtures/baseFixture";


test("@homepage @regression verify featured events present on home page", async({page, request, homePage})=>{

    const authHelper = new AuthHelper();

    await authHelper.loginViaAPI(request,page,
            data.validUser1.email,
            data.validUser1.password
     )

     await expect (homePage.loggedInUserEmail).toBeVisible(); 
    expect (homePage.featureEventTitle).toBeVisible;
     

})