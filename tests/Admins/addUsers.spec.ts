import {test} from "@playwright/test"
import { AddUser } from "../Pages/Admin Pages/addUser"

// Test suite for adding new users
test.describe("Test cases of adding users", () => {
    let adduser: AddUser;
      test.beforeEach(async ({ page }) => {
        adduser = new AddUser(page);
      });

      test("Verify Add Users page is correctly open", async() =>{
        await adduser.verifyAddUserPage();
      });

      test("Fill all fields with data and save user", async() =>{
        const uniqueUsername = `rj${Date.now().toString().slice(-6)}`;

        await adduser.verifyAddUserPage();
        await adduser.addUserForm("Admin", "Ranga Akunuri", "Enabled", uniqueUsername, "rj12345", "rj12345");
        await adduser.verifyUserSuccessfullyAdd(uniqueUsername, "Admin", "Ranga Akunuri", "Enabled");
      })
})