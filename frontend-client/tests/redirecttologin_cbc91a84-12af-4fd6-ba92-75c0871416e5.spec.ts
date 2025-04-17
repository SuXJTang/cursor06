
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('RedirectToLogin_2025-04-03', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/career');

    // Take screenshot
    await page.screenshot({ path: '404-page.png', { fullPage: true } });
});