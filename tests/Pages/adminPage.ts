import { Page, expect } from "@playwright/test"

export class Adminpage {

    constructor(private page: Page) { }

    async goto() {
        await this.page.goto("admin/viewSystemUsers")
    }


    //Search Section Locators
    UsernameInput = () => this.page.getByLabel(/Username/i);
    UserRoleDropdown = () => this.page.getByLabel(/User Role/i);
    EmployeeNameInput = () => this.page.getByLabel(/Employee Name/i);
    StatusDropdown = () => this.page.getByLabel(/status/i);
    ResetButtonSearch = () => this.page.getByRole("button", { name: /Reset/i });
    SearchButton = () => this.page.getByRole("button", { name: /seasrch/i });

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
    async searchUser(username: string, userrole: string, employeename: string, status: string) {
        await this.UsernameInput().fill(username);
        await this.UserRoleDropdown().fill(userrole);
        await this.EmployeeNameInput().fill(employeename);
        await this.StatusDropdown().fill(status);
        await this.SearchButton().click();
    }

    async clickAddUser() {
        await this.AddButton().click();
    }

    async ResetUser() {
        await this.ResetButtonSearch().click();
    }

    async verifyUserPresent(username: string) {
        await expect(this.page.locator('.oxd-table-row', { hasText: username })).toBeVisible();
    }

    async userNotFound() {
        await expect(this.page.getByText("No Records Found")).toBeVisible();
     }

     async verifyResetButton(){
        await expect(this.UsernameInput()).toHaveValue('');
     }
}