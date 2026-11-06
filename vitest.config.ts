import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The unit tests: the pure parts of the site (src/lib, src/i18n, src/sketches, scripts/lib), run with no browser and no
// Astro. The pages themselves are checked end to end by Playwright (tests/).
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
});
