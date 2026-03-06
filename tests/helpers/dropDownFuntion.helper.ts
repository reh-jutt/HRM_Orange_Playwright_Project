import { Page } from "@playwright/test";

// Generic helper to select dropdown option by text
export async function selectDropdownOption(page: Page, optionText: string) {
    // Trim the option text to ensure it matches the visible text in the dropdown, and validate it's not empty
    const targetText = optionText.trim();
    if (!targetText) {
        throw new Error("select Dropdown Option requires non-empty option text");
    }

    const listbox = page.locator('[role="listbox"]:visible');
    await listbox.waitFor({ state: 'visible' });
    const option = listbox.getByRole('option', { name: new RegExp(`^${targetText}$`, 'i') }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
}