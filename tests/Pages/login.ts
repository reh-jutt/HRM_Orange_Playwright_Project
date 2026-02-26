import { Page, expect } from "@playwright/test";

export class Loginpage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"); // uses baseURL
    }

    //Locators for login page elements
    usernameInput = () => this.page.getByRole("textbox", { name: /username/i });
    passwordInput = () => this.page.locator('input[name="password"]');
    loginButton = () => this.page.getByRole("button", { name: /login/i });
    requiredFieldMessage = () => this.page.locator('.oxd-input-field-error-message'); //inline field validation message locator
    invalidLoginMessage = () => this.page.locator('.oxd-alert-content-text');
    // invalidLoginMessage = () => this.page.getByText('Invalid credentials'); // Alternative locator for the error message
    forgotPasswordLink = () => this.page.locator('.orangehrm-login-forgot-header'); // Locator for the "Forgot your password?" link

    //This is the method to perform login action and verify the result
    async login(username: string, password: string) {
        await this.usernameInput().fill(username);
        await this.passwordInput().fill(password);
        await this.loginButton().click();

        // Wait for the page to load after clicking the login button
        await Promise.all([
            this.page.waitForLoadState('load'),
            this.loginButton().click()
        ]);
    }

    // This method verifies that the user is successfully logged in by checking the URL and the presence of the dashboard element
    async verifySuccessfulLogin() {
        await expect(this.page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
        await expect(this.page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    }

    // This method verifies that the user sees an error message when login fails due to invalid credentials
    async verifyInvalidLoginMessage() {
        await expect(this.page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        await expect(this.invalidLoginMessage()).toBeVisible();
        await expect(this.invalidLoginMessage()).toHaveText("Invalid credentials");
    }

    // This method verifies that the user sees a validation message when trying to login with empty username and password
    async verifyRequiredFieldMessage() {
        await expect(this.page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        // await expect(this.requiredFieldMessage()).toBeVisible();
        await expect(this.requiredFieldMessage()).toHaveCount(2); // Verify that there are two validation messages (one for username and one for password)
        await expect(this.requiredFieldMessage()).toHaveText(["Required", "Required"]); // Verify that both validation messages display "Required"
    }

    // This method verifies that Login page have the forgot password link
    async verifyForgotPasswordLink() {
        await expect(this.forgotPasswordLink()).toHaveText("Forgot your password?");
        await expect(this.forgotPasswordLink()).toBeVisible();
        await expect(this.forgotPasswordLink()).toHaveAttribute("href", "https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode");
        await this.forgotPasswordLink().click();
        await expect(this.page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode");
        await expect(this.page.getByRole("heading", { name: /reset password/i })).toBeVisible();
    }
}