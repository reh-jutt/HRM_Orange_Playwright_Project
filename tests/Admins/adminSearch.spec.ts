import { test } from '@playwright/test';
import { Adminpage } from "../Pages/Admin Pages/adminPage"


test.describe('Admin Search Section', () => {
  let admin: Adminpage;

  test.beforeEach(async ({ page }) => {
    //Initializing Admin page
    admin = new Adminpage(page);
    await admin.goto();
  });

  test('Search by Username', async () => {
    await admin.searchUser("Admin", "-- Select --", "", "-- Select --");
    await admin.verifyUserPresent('Admin');
  });


  test('Search with invalid username', async () => {
    await admin.searchUser('XYZ123', "-- Select --", "", "-- Select --");
    await admin.userNotFound();
  });


  test('Reset should clear search fields', async () => {
    await admin.searchUser('Admin', "-- Select --", "", "-- Select --");
    await admin.ResetUser();
    await admin.verifyResetButton();
  });

});