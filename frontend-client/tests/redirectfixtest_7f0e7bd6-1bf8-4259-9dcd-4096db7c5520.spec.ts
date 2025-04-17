
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('RedirectFixTest_2025-04-03', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173/career');

    // Take screenshot
    await page.screenshot({ path: 'career-redirect-test.png', { fullPage: true } });
});