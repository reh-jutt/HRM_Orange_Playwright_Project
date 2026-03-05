import {test} from "@playwright/test"
import { AddUser } from "../Pages/Admin Pages/addUser"

test.describe("Test cases of adding users", () => {
    let adduser: AddUser;
      test.beforeEach(async ({ page }) => {
        //Initializing Admin page
        adduser = new AddUser(page);
      });

      test("Verify Add Users page is correctly open", async() =>{
        await adduser.verifyAddUserPage();
      });

      test("Fill all fields with data and save user", async() =>{
        await adduser.verifyAddUserPage();
        await adduser.addUserForm("Admin", "Ranga  Akunuri", "Enabled", "rj256", "rj12345", "rj12345");
        await adduser.verifyUserSuccessfullyAdd("rj256", "Admin", "Ranga  Akunuri", "Enabled");
      })
})