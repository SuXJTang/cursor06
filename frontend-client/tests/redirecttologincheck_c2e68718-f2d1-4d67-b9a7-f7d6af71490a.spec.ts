
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('RedirectToLoginCheck_2025-04-03', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/career-library');

    // Take screenshot
    await page.screenshot({ path: 'redirect-check.png', { fullPage: true } });
});