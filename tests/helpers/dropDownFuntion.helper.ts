import { Page } from "@playwright/test";

//Generic Dropdown function used for user role and status dropdowns
export async function selectDropdownOption(page: Page, optionText: string) {
    // await this.page.locator(".oxd-select-option", { hasText: optionText }).click();
    const listbox = page.locator('[role="listbox"]:visible');

    // wait for dropdown container
    await listbox.waitFor({ state: 'visible' });


    const option = listbox.getByRole('option', { name: optionText });

    // wait for specific option
    await option.waitFor({ state: 'visible' });

    await option.click();
}