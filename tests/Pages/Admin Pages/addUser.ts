import { expect, Page } from "@playwright/test";
import { Adminpage } from "../Admin Pages/adminPage";
import { selectDropdownOption } from "../../helpers/dropDownFuntion.helper";

export class AddUser {

    //Initializing Adminpage
    private loadAdminpage!: Adminpage; // Class Level Property

    constructor(private page: Page) { }

    async goto() {
        // await this.page.goto("admin/saveSystemUser");
    }

    //Add User Forms Locators Initializing
    UserRoleDropdown = () => this.page.locator('.oxd-select-wrapper').nth(0);
    EmployeeName = () => this.page.getByRole("textbox", { name: /Type for hints.../i });
    StatusDropdown = () => this.page.locator('.oxd-select-wrapper').nth(1);
    UsernameInput = () => this.page.getByRole('textbox').nth(2);
    PasswordInput = () => this.page.getByRole('textbox').nth(3);
    ConfirmPasswordInput = () => this.page.getByRole('textbox').nth(4);
    SaveButton = () => this.page.getByRole("button", { name: /save/i });
    CancelButton = () => this.page.getByRole("button", { name: /cancel/i });

    //Verify heading of Add user
    async verifyAddUserPage() {
        this.loadAdminpage = new Adminpage(this.page);
        await this.loadAdminpage.goto();
        await this.loadAdminpage.adminPageUI();
        await this.loadAdminpage.clickAddUser();
        await expect(this.page).toHaveURL(`${process.env.BASE_URL}/admin/saveSystemUser`);
        await expect(this.page.getByRole("heading", { name: "Add User" })).toBeVisible();
    }

    //Add Users in Admin User-Management
    async addUserForm(userrole: string, employeename: string, status:string, username: string, password: string, confirmPassword: string) {

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
    }

    //This function is about to verify that user is successfully added in table
    async verifyUserSuccessfullyAdd(username: string, userrole: string, employeename: string, status:string){
        await this.loadAdminpage.searchUser(username, userrole, employeename, status);
        await this.loadAdminpage.verifyUserPresent(username);
    }
}