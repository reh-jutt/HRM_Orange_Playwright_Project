import { test } from '@playwright/test';
import { userSearch } from "../Pages/Admin Pages/userSearch";

// Test suite for admin search functionality
test.describe('Admin Search Section', () => {
  let searchUser: userSearch;

  test.beforeEach(async ({ page }) => {
    searchUser = new userSearch(page);
    await searchUser.goto();
  });

  test('Search by Username', async () => {
    await searchUser.searchUser("Admin", "-- Select --", "", "-- Select --");
    await searchUser.verifyUserPresent('Admin');
  });


  test('Search with invalid username', async () => {
    await searchUser.searchUser('XYZ123', "-- Select --", "", "-- Select --");
    await searchUser.userNotFound();
  });


  test('Reset should clear search fields', async () => {
    await searchUser.searchUser('Admin', "-- Select --", "", "-- Select --");
    await searchUser.ResetUser();
    await searchUser.verifyResetButton();
  });

});