import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { LAUNCH_PAGES } from './pages';

// Every launch page, in English: it loads with no error, says what it is, and passes an accessibility check.

for (const { name, path } of LAUNCH_PAGES) {
  test(`${name} loads clean and is accessible`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      // The 404 page's own status is logged as a failed load; that one is the point.
      if (message.type() === 'error' && !(name === 'not-found' && message.text().includes('404')))
        errors.push(message.text());
    });

    // An address that has nothing gets the 404 page with its status; the page's own file is served as any file is.
    const response = await page.goto(name === 'not-found' ? '/nothing-here/' : path);
    expect(response?.status()).toBe(name === 'not-found' ? 404 : 200);
    await expect(page).toHaveTitle(/Eerie Leap/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('h1').count()).toBeGreaterThanOrEqual(1);
    expect(errors).toEqual([]);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(
      serious.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.html).join(' | ')}`),
    ).toEqual([]);
  });
}

test('the waitlist form says when an address is not one', async ({ page }) => {
  await page.goto('/waitlist/');
  const form = page.locator('aside, [slot], header').locator('form').first();
  await form.getByRole('textbox').fill('sam@');
  await form.getByRole('button').click();
  await expect(form.getByRole('alert')).toBeVisible();
});

test('the bar folds into a menu on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/firmware/');
  const menu = page.locator('nav details[data-part="menu"]');
  await expect(menu.locator('summary')).toBeVisible();
  await menu.locator('summary').click();
  await expect(menu.getByRole('link').first()).toBeVisible();
});
