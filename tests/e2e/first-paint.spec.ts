import { expect, test } from '@playwright/test';

const WELCOME = 'Welcome to Code and No Code Solutions';

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('still shows the welcome heading, because it ships in the HTML itself', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(WELCOME);
  });
});

test('hydrates the prerendered page without console errors', async ({ page }) => {
  // A hydration mismatch is reported only as a console error, so collecting them is the check.
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(WELCOME);
  await page.waitForLoadState('networkidle');

  expect(errors).toEqual([]);
});
