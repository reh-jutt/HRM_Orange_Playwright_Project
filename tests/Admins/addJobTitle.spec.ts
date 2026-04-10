import { test, expect } from "@playwright/test";
import { JobTitlesCRUD } from "../Pages/Admin Pages/jobtitlescrud";
import { URLS } from "../helpers/urls.helper";
import { generateDescription, generateNote, generateUniqueJobTitle } from "../helpers/jobTitle.helper";
import { Files } from "../helpers/fileHelper";
import { promises } from "node:dns";

test.describe("Test cases for Job Titles CRUD operations", () => {
    let loadJobTitlesCRUD: JobTitlesCRUD;
    const jobDescription = generateDescription();
    const jobNote = generateNote();

    test.beforeEach(async ({ page }) => {
        loadJobTitlesCRUD = new JobTitlesCRUD(page);
        await loadJobTitlesCRUD.goto();
    });

    //Verify that the Job Titles page UI elements are displayed correctly
    test("Verify Job Titles page UI elements", async ({ page }) => {
        await loadJobTitlesCRUD.JobTitlesPageUI();
    });

    // This test verifies that clicking the "Add Job Title" button navigates to the Add Job Title page and that all form elements are visible
    test("Verify Add Job Title page is correctly open", async ({ page }) => {
        await loadJobTitlesCRUD.clickAddJobTitle();
        await expect(page).toHaveURL(URLS.ADD_JOB_TITLE);
        await loadJobTitlesCRUD.isAddJobTitlePageVisible();
    });

    // This test verifies that a new job title can be added successfully with all fields filled, and that it appears in the list with correct details
    test("Fill all fields with data and save job title", async () => {
        const uniqueJobTitleName = generateUniqueJobTitle("Test Job Title");
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName, jobDescription, Files.validJobSpecificationFile, jobNote);
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        await loadJobTitlesCRUD.verifyJobTitleAdded(uniqueJobTitleName);
    });

    // This test verifies that a new job title can be added successfully by filling only the mandatory fields, and that it appears in the list with correct details
    test("Fill only mandatory fields and save job title", async () => {
        const uniqueJobTitleName = generateUniqueJobTitle("Test Job Title");
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName);
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        await loadJobTitlesCRUD.verifyJobTitleAdded(uniqueJobTitleName);
    });

    // This test verifies that an error message is displayed when trying to add a job title with a name that already exists in the system
    test("Verify error message when trying to add job title with existing name", async () => {
        const uniqueJobTitleName = generateUniqueJobTitle("Test Job Title");
        // First add a job title to create a duplicate scenario
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName, jobDescription, Files.validJobSpecificationFile, jobNote);
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        // Try adding another job title with the same name
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName, jobDescription, Files.validJobSpecificationFile, jobNote);
        await loadJobTitlesCRUD.DuplicateJobTitleError().waitFor({ state: "visible" });
        await expect(loadJobTitlesCRUD.DuplicateJobTitleError()).toBeVisible();
    });

    // This test verifies that an error message is displayed when trying to upload a file with an unsupported format for the Job Specification field
    test("Verify error message when uploading invalid file type for Job Specification", async () => {
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.JobSpecificationUploadInput().setInputFiles(Files.invalidJobSpecificationFile);
        await loadJobTitlesCRUD.InvalidFileTypeError().waitFor({ state: "visible" });
        await expect(loadJobTitlesCRUD.InvalidFileTypeError()).toBeVisible();
    });

    // This test verifies that an error message is displayed when trying to upload a file that exceeds the allowed size limit for the Job Specification field
    test("Verify error message when uploading file exceeding size limit for Job Specification", async () => {
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.JobSpecificationUploadInput().setInputFiles(Files.largeJobSpecificationFile);
        await loadJobTitlesCRUD.largeFileError().waitFor({ state: "visible" });
        await expect(loadJobTitlesCRUD.largeFileError()).toBeVisible();
    });

    // This test verifies that clicking the Cancel button on the Add Job Title page navigates back to the Job Titles list page without saving
    test("Verify Cancel button functionality on Add Job Title page", async () => {
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.CancelButton().click();
        await loadJobTitlesCRUD.JobTitlesPageUI();
    });

    // This test verifies that form validation errors are displayed when trying to save a job title without filling mandatory fields
    test("Verify form validation for mandatory fields on Add Job Title page", async () => {
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.SaveButton().click();
        await expect(loadJobTitlesCRUD.RequiredFieldError()).toHaveCount(1); // Expecting 1 required field error for Job Title Name
    });

    // This test verifies that a job title can be deleted successfully and no longer appears in the list
    test("Delete the created job title", async () => {
        const uniqueJobTitleName = generateUniqueJobTitle("Test Job Title");
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName, jobDescription, Files.validJobSpecificationFile, jobNote);
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        await loadJobTitlesCRUD.verifyJobTitleAdded(uniqueJobTitleName);
        await loadJobTitlesCRUD.deleteJobTitle(uniqueJobTitleName);
        await loadJobTitlesCRUD.verifyJobTitleDeleted(uniqueJobTitleName);
    });

    // This test verifies that editing a job title updates the details correctly in the list view
    test("Edit the created job title", async () => {
        const updatedJobDescription = "This is an updated job description.";
        const uniqueJobTitleName = generateUniqueJobTitle("Test Job Title");
        await loadJobTitlesCRUD.clickAddJobTitle();
        await loadJobTitlesCRUD.addJobTitleForm(uniqueJobTitleName, jobDescription, Files.validJobSpecificationFile, jobNote);
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        await loadJobTitlesCRUD.verifyJobTitleAdded(uniqueJobTitleName);
        await loadJobTitlesCRUD.editJobTitle(uniqueJobTitleName);
        await Promise.all([loadJobTitlesCRUD.page.waitForLoadState("networkidle")]);
        await loadJobTitlesCRUD.JobTitleDescriptionInput().fill(updatedJobDescription);
        await loadJobTitlesCRUD.SaveButton().click();
        await Promise.all([loadJobTitlesCRUD.page.waitForURL(URLS.JOB_TITLES)]);
        await loadJobTitlesCRUD.JobTitlesPageUI();
        await loadJobTitlesCRUD.verifyJobTitleUpdated(uniqueJobTitleName, updatedJobDescription);
    });

    // Additional tests for edge cases and error scenarios can be added similarly
});