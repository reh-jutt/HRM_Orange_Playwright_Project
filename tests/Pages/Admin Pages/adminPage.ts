import { Page, expect } from "@playwright/test"
import { selectDropdownOption } from "../../helpers/dropDownFuntion.helper";
import { URLS } from "../../helpers/urls.helper";

export class Adminpage {
    constructor(private page: Page) { }

    // Navigate to admin users page
    async goto() {
        await this.page.goto(URLS.ADMIN_USERS)
    }

    // Page element locators
    UsernameInput = () => this.page.getByRole('textbox').nth(1);
    UserRoleDropdown = () => this.page.locator('.oxd-select-wrapper').nth(0);
    EmployeeNameInput = () => this.page.getByRole("textbox", { name: /Type for hints.../i });
    StatusDropdown = () => this.page.locator('.oxd-select-wrapper').nth(1);
    ResetButtonSearch = () => this.page.getByRole("button", { name: /Reset/i });
    SearchButton = () => this.page.getByRole("button", { name: /search/i });
    AddButton = () => this.page.getByRole("button", { name: /add/i });
    tableRows = () => this.page.locator('.oxd-table-body .oxd-table-row');
    deleteButton = (username: string) => this.page.locator(`.oxd-table-row:has-text("${username}") button`).first();
    editButton = (username: string) => this.page.locator(`.oxd-table-row:has-text("${username}") button`).nth(1);

    // Verify admin page UI elements are visible
    async adminPageUI() {
        await expect(this.page).toHaveURL(URLS.ADMIN_USERS);
        await expect(this.page.getByRole("heading", { name: /Admin/i })).toBeVisible();
    }

    // Search for user by username, role, employee name, and status
    async searchUser(username: string, userRole: string, employeename: string, status: string) {
        await this.UsernameInput().fill(username);

        // Only select dropdown options if a valid option is provided (not empty or default)
        if (userRole && userRole !== "-- Select --") {
            await this.UserRoleDropdown().click();
            await selectDropdownOption(this.page, userRole);
        }

        // Employee name search requires filling input and selecting from suggestions
        if (employeename && employeename.trim().length > 0) {
            await this.EmployeeNameInput().fill(employeename);
            await selectDropdownOption(this.page, employeename);
        }

        // Only select status if a valid option is provided (not empty or default)
        if (status && status !== "-- Select --") {
            await this.StatusDropdown().click();
            await selectDropdownOption(this.page, status);
        }

        await this.SearchButton().click();
    }

    // Click Add User button
    async clickAddUser() {
        await this.AddButton().click();
    }

    // Click Reset button to clear search fields
    async ResetUser() {
        await this.ResetButtonSearch().click();
    }

    // Verify user exists in search results
    async verifyUserPresent(username: string) {
        const row = this.page.locator(`.oxd-table-row:has-text("${username}")`).first();
        await expect(row).toBeVisible();
    }

    // Verify no users found in search results
    async userNotFound() {
        await expect(this.tableRows()).toHaveCount(0);
    }

    // Delete user and confirm deletion
    async deleteUser(username: string) {
        await this.deleteButton(username).click();
        await this.page.getByRole('button', { name: /confirm/i }).click();
    }

    // Click edit button for specified user
    async editUser(username: string) {
        await this.editButton(username).click();
    }

    // Verify search fields are cleared after reset
    async verifyResetButton() {
        await expect(this.UsernameInput()).toHaveValue('');
        // await expect(this.UserRoleDropdown()).not.toHaveText('-- Select --');
        // await expect(this.EmployeeNameInput()).toHaveValue('');
        // await expect(this.StatusDropdown()).not.toHaveText('-- Select --');
    }

}