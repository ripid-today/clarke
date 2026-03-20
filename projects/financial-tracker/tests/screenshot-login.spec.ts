import { test } from '@playwright/test';

test('capture login page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '/tmp/login-page.png', fullPage: true });
});
