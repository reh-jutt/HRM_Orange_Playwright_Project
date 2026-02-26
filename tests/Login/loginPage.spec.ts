import { test } from "@playwright/test";
import { Loginpage } from "../Pages/login";

test.describe("All Login Page Tests Cases", () => {
    let loginPage: Loginpage;

    test.beforeEach(async ({ page }) => {
        loginPage = new Loginpage(page);
        await loginPage.goto();
    });

    test("Show validation message when username and password are empty", async () => {
        await loginPage.login("", "");
        await loginPage.verifyRequiredFieldMessage();
    });

    test("should login successfully with valid credentials", async () => {
        await loginPage.login("Admin", "admin123");
        await loginPage.verifySuccessfulLogin();
    });
    
    test("should show error message with invalid password", async () => {
        await loginPage.login("Admin", "invalidpassword");
        await loginPage.verifyInvalidLoginMessage();
    });

    test("should show error message with invalid username", async () => {
        await loginPage.login("invaliduser", "admin123");
        await loginPage.verifyInvalidLoginMessage();
    });

    test("should show error message with invalid username and password", async () => {
        await loginPage.login("invaliduser", "invalidpassword");
        await loginPage.verifyInvalidLoginMessage();
    });

    test("should have a functional forgot password link", async () => {
        await loginPage.verifyForgotPasswordLink();
    });
});