import { test, expect } from "@playwright/test"
import { UserManagementCrud } from "../Pages/Admin Pages/userManagement"
import { URLS } from "../helpers/urls.helper";

// Test suite for adding new users
test.describe("Test cases of users Cruds", () => {
  let loadUserManagementCrud: UserManagementCrud;

  // Generate a unique username for testing
  const uniqueUsername = `rj${Date.now().toString().slice(-6)}`;

  // Existing username for duplicate user test
  const existingUsername = "Admin";

  // Before each test, navigate to the Add User page
  test.beforeEach(async ({ page }) => {
    loadUserManagementCrud = new UserManagementCrud(page);
  });

  test.skip("Verify Add Users page is correctly open", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await expect(page).toHaveURL(URLS.ADD_USER);
    await expect(page.getByRole("heading", { name: "Add User" })).toBeVisible();
  });

  test("Fill all fields with data and save user", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "rj12345");
    await loadUserManagementCrud.SaveButton().click();

    // Wait until save flow completes and user list page is ready.
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
      // Loader may not appear on every run.
    });
    await loadUserManagementCrud.verifyUserAdded(uniqueUsername, "Admin", "Ranga Akunuri", "Enabled");
  })

  test.skip("Verify error message when trying to add user with existing username", async () => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", existingUsername, "rj12345", "rj12345", false);
    await loadUserManagementCrud.DuplicateUsernameError().waitFor({ state: "visible" });
    await expect(loadUserManagementCrud.DuplicateUsernameError()).toBeVisible();
  });

  test.skip("Verify Cancel button functionality on Add User page", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.cancelButtonFunctionality();
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
      // Loader may not appear on every run.
    });
    await expect(page).toHaveURL(URLS.ADMIN_USERS);
  });

  test.skip("Verify form validation for mandatory fields on Add User page", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.SaveButton().click();
    // await expect(loadUserManagementCrud.RequiredFieldError()).toBeVisible();
    await expect(loadUserManagementCrud.RequiredFieldError()).toHaveCount(6); // Expecting 6 required field errors for each mandatory field
    await expect(loadUserManagementCrud.RequiredFieldError()).toHaveText(["Required", "Required", "Required", "Required" , "Required", "Passwords do not match"]); // Verify that all error messages have the text "Required";
  });

  test.skip("Verify form validation for password mismatch on Add User page", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "differentPassword", false);
    await expect(loadUserManagementCrud.MismatchPasswordError()).toBeVisible();
    await expect(loadUserManagementCrud.MismatchPasswordError()).toHaveText("Passwords do not match");
    await expect(loadUserManagementCrud.MismatchPasswordError()).toHaveCount(1); // Expecting 1 error message for password mismatch
  });

  test.skip("Verify that user is not added when form validation fails on Add User page", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "differentPassword", false);
    await expect(loadUserManagementCrud.MismatchPasswordError()).toBeVisible();
    await loadUserManagementCrud.SaveButton().click();
    await expect(page).toHaveURL(URLS.ADD_USER); // Should remain on Add User page due to validation error
  });

  test.skip("Verify that User is deleted successfully", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "rj12345");
    await loadUserManagementCrud.SaveButton().click();
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await loadUserManagementCrud.verifyUserAdded(uniqueUsername, "Admin", "Ranga Akunuri", "Enabled");
    await loadUserManagementCrud.DeleteUser(uniqueUsername);
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await expect(page.getByText(uniqueUsername)).toHaveCount(0); // Verify user is no longer present in the list
  });

  test.skip("Click on the Cancel button and verify that the user is not deleted", async ({ page }) => {
    await loadUserManagementCrud.AddUserPageUI();
    await loadUserManagementCrud.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "rj12345");
    await loadUserManagementCrud.SaveButton().click();
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await loadUserManagementCrud.verifyUserAdded(uniqueUsername, "Admin", "Ranga Akunuri", "Enabled");
    await loadUserManagementCrud.cancelButtonFunctionality();
    await page.waitForURL(URLS.ADMIN_USERS, { timeout: 30_000 });
    await expect(page.getByText(uniqueUsername)).toBeVisible(); // Verify user is still present in the list
  });
});