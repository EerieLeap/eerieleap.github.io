// Takes a picture of every launch page at a phone's and a desktop's width, to look a change over before it is merged.
//
//   pnpm build && pnpm preview &          the site, served on http://localhost:4321
//   pnpm shots [folder]                   writes <page>-<width>.png into the folder (screenshots/ by default)
//
// Uses the Chrome on this computer if Playwright's own browser is not installed.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { LAUNCH_PAGES, WIDTHS } from '../tests/pages';

const base = process.env.SITE_URL ?? 'http://localhost:4321';
const folder = process.argv[2] ?? 'screenshots';
mkdirSync(folder, { recursive: true });

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const { name, path } of LAUNCH_PAGES) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // A picture below the first screen loads only when scrolled to; the whole page is wanted here.
    await page.evaluate(() =>
      document.querySelectorAll('img[loading="lazy"]').forEach((image) => image.setAttribute('loading', 'eager')),
    );
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: join(folder, `${name}-${width}.png`), fullPage: true });
    console.log(`${name} at ${width}`);
  }
  await context.close();
}
await browser.close();
