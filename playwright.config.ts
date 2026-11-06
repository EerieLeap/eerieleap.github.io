import { defineConfig } from '@playwright/test';

// The end-to-end checks run against the built site, served by Astro's preview. `pnpm test` builds it first, with the
// stretch test's language in it (scripts/pseudo-locale.ts). On a machine without Playwright's own browser, the Chrome
// that is installed will do: PLAYWRIGHT_CHANNEL=chrome pnpm test
const port = 4321;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    channel: process.env.PLAYWRIGHT_CHANNEL,
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `pnpm exec astro preview --port ${port}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
  },
});
