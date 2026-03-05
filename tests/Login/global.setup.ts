import { chromium } from '@playwright/test';
import { Loginpage } from '../Pages/login';


async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const loginPage = new Loginpage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.ADMIN_USER!,
    process.env.ADMIN_PASSWORD!
  );
  await loginPage.verifySuccessfulLogin();

    // Save the authenticated state
  await context.storageState({ path: 'tests/auth/auth.json' });

  await browser.close();
}

export default globalSetup;