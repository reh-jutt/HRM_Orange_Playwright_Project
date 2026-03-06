import { expect, Page } from "@playwright/test";
import { Adminpage } from "../Admin Pages/adminPage";
import { selectDropdownOption } from "../../helpers/dropDownFuntion.helper";
import { URLS } from "../../helpers/urls.helper";

export class AddUser {
    // Instance of Adminpage for navigation and verification
    private loadAdminpage!: Adminpage;

    constructor(private page: Page) { }

    async goto() {
        // Direct navigation not used - access via Admin page
    }

    // Page element locators
    UserRoleDropdown = () => this.page.locator('.oxd-select-wrapper').nth(0);
    EmployeeName = () => this.page.getByRole("textbox", { name: /Type for hints.../i });
    StatusDropdown = () => this.page.locator('.oxd-select-wrapper').nth(1);
    UsernameInput = () => this.page.getByRole('textbox').nth(2);
    PasswordInput = () => this.page.getByRole('textbox').nth(3);
    ConfirmPasswordInput = () => this.page.getByRole('textbox').nth(4);
    SaveButton = () => this.page.getByRole("button", { name: /save/i });
    CancelButton = () => this.page.getByRole("button", { name: /cancel/i });
    DuplicateUsernameError = () => this.page.getByText("Already exists").first();

    // Navigate to Add User page and verify page load
    async verifyAddUserPage() {
        this.loadAdminpage = new Adminpage(this.page);
        await this.loadAdminpage.goto();
        await this.loadAdminpage.adminPageUI();
        await this.loadAdminpage.clickAddUser();
        await expect(this.page).toHaveURL(URLS.ADD_USER);
        await expect(this.page.getByRole("heading", { name: "Add User" })).toBeVisible();
    }

    // Fill Add User form and submit
    async addUserForm(userrole: string, employeename: string, status: string, username: string, password: string, confirmPassword: string) {
        await this.UserRoleDropdown().click();
        await selectDropdownOption(this.page, userrole);
        await this.EmployeeName().fill(employeename);
        await selectDropdownOption(this.page, employeename);
        await this.StatusDropdown().click();
        await selectDropdownOption(this.page, status);
        await this.UsernameInput().fill(username);
        await this.PasswordInput().fill(password);
        await this.ConfirmPasswordInput().fill(confirmPassword);
        await this.SaveButton().click();

        if (await this.DuplicateUsernameError().isVisible().catch(() => false)) {
            throw new Error(`User \"${username}\" already exists. Please use a unique username.`);
        }

        // Wait until save flow completes and user list page is ready.
        await this.page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
        await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
            // Loader may not appear on every run.
        });
    }

    // Search for and verify newly added user exists
    async verifyUserSuccessfullyAdd(username: string, userrole: string, employeename: string, status: string) {
        await this.loadAdminpage.searchUser(username, userrole, employeename, status);
        await this.loadAdminpage.verifyUserPresent(username);
    }
}