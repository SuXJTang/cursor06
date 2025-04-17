
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('LoginAccessTest_2025-04-03', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/career-library');

    // Take screenshot
    await page.screenshot({ path: 'fixed-redirect-test.png', { fullPage: true } });

    // Fill input field
    await page.fill('input[placeholder='用户名']', 'admin@example.com');
});