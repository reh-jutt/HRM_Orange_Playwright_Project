import { test } from '@playwright/test';
import { Adminpage } from '../Pages/adminPage';
import { loginAsValidUser } from '../helpers/validUserLogin';
// import { Loginpage } from '../Pages/login';

test.describe('Admin Search Section', () => {
  let admin: Adminpage;

  test.beforeEach(async ({ page }) => {

    //login helper injection here
    await loginAsValidUser(page);

    //Initializing Admin page
    admin = new Adminpage(page);
    await admin.goto();
  });

  test.skip('Search by Username', async () => {
    await admin.searchUser("Admin", "-- Select --", "", "-- Select --");
    await admin.verifyUserPresent('Admin');
  });


  test('Search with invalid username', async () => {
    await admin.searchUser('XYZ123', "-- Select --", "", "-- Select --");
    await admin.userNotFound();
  });


  test.skip('Reset should clear search fields', async () => {
    await admin.searchUser('Admin', "-- Select --", "", "-- Select --");
    await admin.ResetUser();
    await admin.verifyResetButton();
  });

});