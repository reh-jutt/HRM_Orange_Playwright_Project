import { Page, expect } from "@playwright/test"

export class Adminpage {

    constructor(private page: Page) { }

    async goto() {
        await this.page.goto("admin/viewSystemUsers")
    }


    //Search Section Locators
    UsernameInput = () => this.page.getByRole('textbox').nth(1);
    UserRoleDropdown = () => this.page.locator('.oxd-select-wrapper').nth(0);
    EmployeeNameInput = () => this.page.getByRole("textbox", { name: /Type for hints.../i });
    StatusDropdown = () => this.page.locator('.oxd-select-wrapper').nth(1);
    ResetButtonSearch = () => this.page.getByRole("button", { name: /Reset/i });
    SearchButton = () => this.page.getByRole("button", { name: /search/i });

    //Add Tables Locator
    AddButton = () => this.page.getByRole("button", { name: /\+ add/i });
    tableRows = () => this.page.locator('.oxd-table-body .oxd-table-row');
    deleteButton = (username: string) => this.page.locator(`.oxd-table-row:has-text("${username}") button`).first();
    editButton = (username: string) => this.page.locator(`.oxd-table-row:has-text("${username}") button`).nth(1);

    async adminPageUI() {

        await expect(this.page).toHaveURL("admin/viewSystemUsers");
        await expect(this.page).toHaveTitle("Admin /User Management")
    }

    // ======================
    // Actions / Methods
    // ======================

    //This method is used only for Search
    async searchUser(username: string, userRole: string, employeename: string, status: string) {
        await this.UsernameInput().fill(username);

        await this.UserRoleDropdown().click();
        // await expect(this.UserRoleDropdown()).toContainText(userRole);
        await this.selectDropdownOption(userRole);

        await this.EmployeeNameInput().fill(employeename);

        await this.StatusDropdown().click();
        // await expect(this.StatusDropdown()).toContainText(status);
        await this.selectDropdownOption(status);

        await this.SearchButton().click();
    }

    //Add User Button function
    async clickAddUser() {
        await this.AddButton().click();
    }

    //Reset Search button function
    async ResetUser() {
        await this.ResetButtonSearch().click();
    }

    //Verify Search user present in table function
    async verifyUserPresent(username: string) {
        // Match row where the first cell (username) exactly matches
        const row = this.page.locator(`.oxd-table-row:has-text("${username}")`).first();
        await expect(row).toBeVisible();
    }

    //Verify search result in table with entire rows
    async verifyFullRow(expectedRowText: string) {
        // Trim and normalize spaces to avoid extra whitespace issues
        const row = this.page.locator('.oxd-table-row').filter({
            hasText: expectedRowText
        });

        // Take first match (should be only one if exact)
        await expect(row.first()).toBeVisible();
    }

    //If user not found this function is used
async userNotFound() {
  await expect(this.tableRows()).toHaveCount(0);
}

    //This function is used that reset button is working
    async verifyResetButton() {
        await expect(this.UsernameInput()).toHaveValue('');
    }

    //Generic Dropdown function used for user role and status dropdowns
    async selectDropdownOption(optionText: string) {
        // await this.page.locator(".oxd-select-option", { hasText: optionText }).click();
        const listbox = this.page.locator('[role="listbox"]:visible');
        await listbox.getByRole('option', { name: optionText }).click();

    }
}