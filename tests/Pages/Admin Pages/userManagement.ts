import { Page } from "@playwright/test";
import { userSearch } from "./userSearch";
import { selectDropdownOption } from "../../helpers/dropDownFuntion.helper";
import { URLS } from "../../helpers/urls.helper";

export class UserManagementCrud {
    // Instance of userSearch for navigation and verification
    private loadUserSearch!: userSearch;

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
    DuplicateUsernameError = () => this.page.getByText(/Already exists/i).first();
    RequiredFieldError = () => this.page.locator('.oxd-input-field-error-message');
    MismatchPasswordError = () => this.page.getByText(/Passwords do not match/i).first();
    DeleteUserButton = () => this.page.locator(`.oxd-table-row oxd-icon bi-trash`).first();
    DeleteConfirmationButton = () => this.page.getByRole('button', { name: /Yes, Delete/i });
    DeleteCancelButton = () => this.page.getByRole('button', { name: /No, Cancel/i });
    EditUserButton = () => this.page.locator(`.oxd-table-row oxd-icon bi-pencil`).first();

    // Navigate to Add User page and verify page load
    async AddUserPageUI() {
        this.loadUserSearch = new userSearch(this.page);
        await this.loadUserSearch.goto();
        await this.loadUserSearch.adminPageUI();
        await this.loadUserSearch.clickAddUser();
    }

    // Fill Add User form and submit
    async addUserForm(
        userrole: string,
        employeename: string,
        status: string,
        username: string,
        password: string,
        confirmPassword: string,
        expectNavigation = true
    ) {
        await this.UserRoleDropdown().click();
        await selectDropdownOption(this.page, userrole);
        await this.EmployeeName().fill(employeename);
        await selectDropdownOption(this.page, employeename);
        await this.StatusDropdown().click();
        await selectDropdownOption(this.page, status);
        await this.UsernameInput().fill(username);
        await this.PasswordInput().fill(password);
        await this.ConfirmPasswordInput().fill(confirmPassword);

        if (!expectNavigation) {
            return;
        }
    }

    // Search for and verify newly added user exists
    async verifyUserAdded(username: string, userrole: string, employeename: string, status: string) {
        await this.loadUserSearch.searchUser(username, userrole, employeename, status);
        await this.loadUserSearch.verifyUserPresent(username);
    }

    // Additional methods for Cancel, Delete, Edit can be implemented similarly
    async cancelButtonFunctionality() {
        // Implementation for Cancel functionality
        await this.CancelButton().click();
    }

    async DeleteUser(username: string) {
        // Implementation for Delete functionality
        const row = this.page.locator(`.oxd-table-row:has-text("${username}")`).first();
        await row.locator('.oxd-icon.bi-trash').click();
        // Confirm deletion in modal
        await this.page.getByRole('button', { name: /Yes, Delete/i }).click();

    }
    async EditUser(username: string) {
        // Implementation for Edit functionality
        const row = this.page.locator(`.oxd-table-row:has-text("${username}")`).first();
        await row.locator('.oxd-icon.bi-pencil').click();
    }
}