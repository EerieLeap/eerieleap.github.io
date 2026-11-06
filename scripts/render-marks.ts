// Renders the marks the site is known by: the favicon (the wordmark's "e" with the orange pip) at the sizes a browser asks
// for, and the social card a link to the site unfolds into. They are drawn as HTML in the site's own type and shot with
// a browser, so they are made of the same tokens as the pages; the results are committed under public/.
//
//   pnpm marks     (uses Playwright's browser, or the Chrome on this computer)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public');
const scratch = join(root, '.astro/marks');
mkdirSync(join(out, 'og'), { recursive: true });
mkdirSync(scratch, { recursive: true });

const tokens = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
const archivo = pathToFileURL(
  join(root, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2'),
).href;
const mono = pathToFileURL(
  join(root, 'node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2'),
).href;
const still = pathToFileURL(join(root, 'src/assets/stills/ink.webp')).href;

const page = (body: string, width: number, height: number) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Archivo Variable'; src: url(${archivo}) format('woff2-variations'); font-weight: 100 900; }
@font-face { font-family: 'Martian Mono Variable'; src: url(${mono}) format('woff2-variations'); font-weight: 100 800; }
${tokens}
html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: var(--ground); color: var(--ink); font-family: var(--font-text); }
</style></head><body>${body}</body></html>`;

/** The favicon: one letter and the site's one orange mark, the only drawing of the wordmark that still reads at 16 px. */
const favicon = (size: number) =>
  page(
    `<div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${size * 0.8}px; line-height: 1; letter-spacing: -0.06em">
<span style="margin: ${-size * 0.1}px ${size * 0.14}px 0 0">e</span>
<span style="position: absolute; right: ${size * 0.11}px; top: ${size * 0.14}px; width: ${size * 0.2}px; height: ${size * 0.2}px; border-radius: 50%; background: var(--pip)"></span>
</div>`,
    size,
    size,
  );

/** The site's card: the sketch's still, the wordmark and the pitch, cut where a feed shows it. */
const card = page(
  `<div style="position: relative; width: 1200px; height: 630px; overflow: hidden">
<img src="${still}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover">
<div style="position: absolute; inset: 0; background: linear-gradient(90deg, rgb(12 12 12 / 0.95) 0%, rgb(12 12 12 / 0.84) 44%, rgb(12 12 12 / 0.05) 80%)"></div>
<div style="position: absolute; inset: 0; padding: 60px 65px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between">
<span style="font-size: 42px; font-weight: 700; letter-spacing: -0.03em; word-spacing: -0.06em; line-height: 1">eerie leap</span>
<div>
<p style="margin: 0; max-width: 744px; font-size: 73px; font-weight: 500; line-height: 0.98; letter-spacing: -0.04em">A CAN data logger and dash platform you can script.</p>
<p style="margin: 31px 0 0; display: flex; align-items: center; gap: 12px; font-family: var(--font-label); font-size: 18px"><span style="width: 11px; height: 11px; border-radius: 50%; background: var(--pip)"></span>open-source firmware · eerieleap.com</p>
</div>
</div>
</div>`,
  1200,
  630,
);

const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
async function shoot(html: string, width: number, height: number, file: string) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const tab = await context.newPage();
  // A page opened from a file may read the fonts and the still beside it; one set from a string may not.
  const draft = join(scratch, file.replace('/', '-').replace(/.png$/, '.html'));
  writeFileSync(draft, html);
  await tab.goto(pathToFileURL(draft).href, { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  writeFileSync(join(out, file), await tab.screenshot({ clip: { x: 0, y: 0, width, height } }));
  await context.close();
  console.log(`${file}: ${width} × ${height}`);
}

await shoot(favicon(32), 32, 32, 'favicon-32.png');
await shoot(favicon(180), 180, 180, 'apple-touch-icon.png');
await shoot(favicon(512), 512, 512, 'icon-512.png');
await shoot(card, 1200, 630, 'og/site.png');
await browser.close();
