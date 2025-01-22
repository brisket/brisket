import { test, expect } from '@playwright/test';

test('brisket app starts in the browser', async ({ page }) => {
  await page.goto('/');

  const BrisketConfig = await page.evaluate(() => window['BrisketConfig']);

  expect(BrisketConfig).toBeDefined();
  expect(BrisketConfig.started).toBe(true);
});

test('onDOM callbacks fire', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('greens-link').click();
  await expect(page.getByTestId('side-image')).toBeAttached();
});