import { Page } from '@playwright/test';
import { Loginpage } from '../Pages/login';

export async function loginAsValidUser(page: Page) {
  const loginPage = new Loginpage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.ADMIN_USER!,
    process.env.ADMIN_PASSWORD!
  );
  await loginPage.verifySuccessfulLogin();
}