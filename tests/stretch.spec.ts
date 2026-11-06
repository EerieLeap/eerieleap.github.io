import { expect, test } from '@playwright/test';
import { NAMES } from '../src/i18n/names';
import { LAUNCH_PAGES, WIDTHS } from './pages';

// The stretch test: every launch page in a language that is not one, English with accents and a third more length
// (scripts/pseudo-locale.ts), at a phone's and a desktop's width. A page that overflows sideways, or still shows a plain
// English word, would break in a real second language, so it fails here first.
//
// The docs are left out of the word check: the firmware's pages are English by design, and a docs page without a
// translation is shown in English with a line that says so.

const LANG = 'en-xa';
const DOCS = /^docs-/;
/** Where English is allowed: names, code, and what a screen reader is not read. */
const KEPT = new RegExp(
  [...NAMES]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'gi',
);
/** Two letters or more with a plain vowel among them: a word English would spell so, which the test language never does. */
const ENGLISH_WORD = /\b(?=[a-z]*[aeiou])[a-z]{2,}\b/i;

for (const width of WIDTHS) {
  test.describe(`at ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const { name, path } of LAUNCH_PAGES) {
      test(`${name} holds its width and shows no English`, async ({ page }) => {
        const address = name === 'not-found' ? `/${LANG}/nothing-here/` : `/${LANG}${path}`;
        await page.goto(address);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en-XA');

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, 'the page is wider than the window').toBeLessThanOrEqual(0);

        if (DOCS.test(name)) return;
        const texts = await page.evaluate(() => {
          // A date is the browser's to write for a language, not the dictionary's.
          const skip = 'script, style, code, pre, time, [translate="no"], [hidden], [aria-hidden="true"]';
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) =>
              node.parentElement?.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
          });
          const found: string[] = [];
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node.textContent?.trim();
            if (text) found.push(text);
          }
          return found;
        });
        const english = texts.filter((text) => ENGLISH_WORD.test(text.replace(KEPT, '')));
        expect(english, 'English left on the page').toEqual([]);
      });
    }
  });
}
