import { Page, expect } from "@playwright/test";
import { URLS } from "../helpers/urls.helper";

export class Loginpage {
    // Initialize page object for login page interactions
    constructor(private page: Page) { }

    // Navigate to login page using provided base URL or default URL
    async goto(baseUrl?: string) {
        const url = baseUrl ? `${baseUrl}/auth/login` : URLS.LOGIN;
        await this.page.goto(url);
    }

    // Page element locators
    usernameInput = () => this.page.getByRole("textbox", { name: /username/i });
    passwordInput = () => this.page.locator('input[name="password"]');
    loginButton = () => this.page.getByRole("button", { name: /login/i });
    requiredFieldMessage = () => this.page.locator('.oxd-input-field-error-message');
    invalidLoginMessage = () => this.page.locator('.oxd-alert-content-text');
    forgotPasswordLink = () => this.page.getByText("Forgot your password?");

    // Fill credentials and submit login form
    async login(username: string, password: string) {
        await this.usernameInput().fill(username);
        await this.passwordInput().fill(password);
        await this.loginButton().click();
        await Promise.all([this.page.waitForLoadState('load')]);
    }

    // Verify login success by checking URL and dashboard heading
    async verifySuccessfulLogin() {
        await expect(this.page).toHaveURL(URLS.DASHBOARD);
        await expect(this.page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    }

    // Verify invalid credentials error message is displayed
    async verifyInvalidLoginMessage() {
        await expect(this.page).toHaveURL(URLS.LOGIN);
        await expect(this.invalidLoginMessage()).toBeVisible();
        await expect(this.invalidLoginMessage()).toHaveText("Invalid credentials");
    }

    // Verify required field validation messages for empty inputs
    async verifyRequiredFieldMessage() {
        await expect(this.page).toHaveURL(URLS.LOGIN);
        await expect(this.requiredFieldMessage()).toHaveCount(2);
        await expect(this.requiredFieldMessage()).toHaveText(["Required", "Required"]);
    }

    // Verify forgot password link functionality
    async verifyForgotPasswordLink() {
        await expect(this.forgotPasswordLink()).toBeVisible();
        await expect(this.forgotPasswordLink()).toHaveText("Forgot your password?");
        await this.forgotPasswordLink().click();
        await Promise.all([this.page.waitForURL(URLS.FORGOT_PASSWORD)]);
        await expect(this.page.getByRole("heading", { name: /reset password/i })).toBeVisible();
    }
}