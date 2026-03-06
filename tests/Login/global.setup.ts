import { chromium } from '@playwright/test';
import { Loginpage } from '../Pages/login';
import { BASE_URL } from '../helpers/urls.helper';

// Global setup: authenticate once and save session state for all tests
async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const loginPage = new Loginpage(page);
  await loginPage.goto(BASE_URL);
  await loginPage.login(process.env.ADMIN_USER!, process.env.ADMIN_PASSWORD!);
  await loginPage.verifySuccessfulLogin();

  // Save authenticated state for reuse in tests
  await context.storageState({ path: 'tests/auth/auth.json' });

  await browser.close();
}

export default globalSetup;