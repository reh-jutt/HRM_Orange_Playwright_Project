import { Page, expect } from "@playwright/test";
import { URLS } from "../../helpers/urls.helper";

export class JobTitlesCRUD {
    constructor(public page: Page) { }

    async goto() {
        // Navigation to Job Titles page will be done via Admin page, so direct navigation is not implemented here.
        await this.page.goto(URLS.JOB_TITLES);
    }

    // Add Job title page element locators
    JobTitleNameInput = () => this.page.getByRole('textbox', { name: "" }).nth(1);
    JobTitleDescriptionInput = () => this.page.getByRole('textbox', { name: /Type Description here/i });
    JobSpecificationUploadInput = () => this.page.locator('input[type="file"]');
    JobTitleNoteInput = () => this.page.getByRole('textbox', { name: /Add Note/i });
    SaveButton = () => this.page.getByRole('button', { name: /Save/i });
    CancelButton = () => this.page.getByRole('button', { name: /Cancel/i });
    RequiredFieldError = () => this.page.locator('.oxd-input-field-error-message');
    DuplicateJobTitleError = () => this.page.getByText(/Already exists/i).first();
    InvalidFileTypeError = () => this.page.getByText(/File type not allowed/i).first();
    largeFileError = () => this.page.getByText(/Attachment Size Exceeded/i).first();
    
    // Job Titles page element locators
    JobTitlesTableRows = () => this.page.locator('.oxd-table-body .oxd-table-row');
    AddJobTitleButton = () => this.page.getByRole('button', { name: /Add/i });
    DeleteButton = (jobTitleName: string) => this.page.locator(`.oxd-table-row:has-text("${jobTitleName}") button`).first();
    DeleteConfirmationButton = () => this.page.getByRole('button', { name: /Yes, Delete/i });
    DeleteCancelButton = () => this.page.getByRole('button', { name: /No, Cancel/i });
    CloseConfirmationButton = () => this.page.getByRole('button', { name: /x/i });
    EditButton = (jobTitleName: string) => this.page.locator(`.oxd-table-row:has-text("${jobTitleName}") button`).nth(1);
    
    // Verify Job Titles page UI elements are visible
    async JobTitlesPageUI() {
        // Navigate to Job Titles page via Admin page
        await expect(this.page.getByRole("heading", { name: /Job Titles/i })).toBeVisible();
        await expect(this.page).toHaveURL(URLS.JOB_TITLES);
    }

    // Navigate to Add Job Title page and verify page load
    async isAddJobTitlePageVisible() {
            await expect(this.page.getByRole("heading", { name: /Add Job Title/i })).toBeVisible();
            await expect(this.JobTitleNameInput()).toBeVisible();
            await expect(this.JobTitleDescriptionInput()).toBeVisible();
            await expect(this.JobSpecificationUploadInput()).toBeAttached();
            await expect(this.JobTitleNoteInput()).toBeVisible();
            await expect(this.SaveButton()).toBeVisible();
            await expect(this.CancelButton()).toBeVisible();
    }

    // Fill Add Job Title form and submit
    async addJobTitleForm(
        jobTitleName: string,
        jobDescription?: string,
        jobSpecificationPath?: string,
        jobNote?: string) 
        {
        await this.JobTitleNameInput().fill(jobTitleName);
        if (jobDescription) {
            await this.JobTitleDescriptionInput().fill(jobDescription);
        };
        if (jobSpecificationPath) {
        await this.JobSpecificationUploadInput().setInputFiles(jobSpecificationPath);
        };
        if (jobNote) {
            await this.JobTitleNoteInput().fill(jobNote);
        };
        await this.SaveButton().click();
    }

    // Verify that the newly added job title appears in the list with correct details
    async verifyJobTitleAdded(jobTitleName: string) {
        const jobTitleRow = this.JobTitlesTableRows().filter({ hasText: jobTitleName }).first();
        await expect(jobTitleRow).toBeVisible();
        await expect(jobTitleRow).toContainText(jobTitleName);
        await expect(jobTitleRow).toHaveCount(1);
    }



    async clickAddJobTitle() {
        await this.AddJobTitleButton().click();
    }

    async deleteJobTitle(jobTitleName: string) {
        const deleteButton = this.DeleteButton(jobTitleName);
        await deleteButton.click();
        await this.DeleteConfirmationButton().click();
    }

    async verifyJobTitleDeleted(jobTitleName: string) {
        const jobTitleRow = this.JobTitlesTableRows().filter({ hasText: jobTitleName });
        await expect(jobTitleRow).toHaveCount(0);
    }

    async editJobTitle(jobTitleName: string) {
        const editButton = this.EditButton(jobTitleName);
        await editButton.click();
    }

    async verifyJobTitleUpdated(jobTitleName: string, updatedDescription: string) {
        const jobTitleRow = this.JobTitlesTableRows().filter({ hasText: jobTitleName });
        const descriptionCell = jobTitleRow.locator('.oxd-table-cell').nth(2);
        await expect(descriptionCell).toHaveText(updatedDescription);
    }
}