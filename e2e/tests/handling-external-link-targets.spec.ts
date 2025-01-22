import { test, expect } from '@playwright/test';

test('handles _blank links natively', async ({ page, context }) => {
  await page.goto('/');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId('_blank-link').click(),
  ]);

  expect(newPage.url()).toMatch(/\/sides\/vegetables\/sweet-potato$/);
});

test('handles _parent links natively', async ({ page }) => {
  await page.goto('/non-brisket-routes/parent');

  await page
    .frameLocator('#frame-for-brisket-app')
    .getByTestId('_parent-link').click();

  await page.waitForURL('/sides/bread');

  expect(page.url()).toMatch(/\/sides\/bread$/);
});

test('handles _top links natively', async ({ page }) => {
  await page.goto('/non-brisket-routes/top');

  await page
    .frameLocator('#frame-for-parent')
    .frameLocator('#frame-for-brisket-app')
    .getByTestId('_top-link').click();

  await page.waitForURL('/sides/baked-beans');

  expect(page.url()).toMatch(/\/sides\/baked-beans$/);
});

test('handles named window links natively', async ({ page, context }) => {
  await page.goto('/');

  const [newNamedPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId('named-window-1-link').click(),
  ]);

  expect(newNamedPage.url()).toMatch(/\/sides\/fries$/);

  await page.getByTestId('named-window-2-link').click();
  await newNamedPage.waitForURL('/sides/vegetables/pickles');

  expect(newNamedPage.url()).toMatch(/\/sides\/vegetables\/pickles$/);
});