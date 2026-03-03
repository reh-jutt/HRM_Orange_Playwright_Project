import {Loginpage} from "../Pages/login"

export async function loginAsValidUser(page:any) {
    const loginCredentials = new Loginpage(page);
    await loginCredentials.goto();
    await loginCredentials.login("Admin", "admin123");
    await loginCredentials.verifySuccessfulLogin();
}