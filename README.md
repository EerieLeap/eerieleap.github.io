# eerieleap.com

The web site of Eerie Leap: a CAN data logger and dash platform you can script, with open-source firmware. Built with Astro, React and Starlight, published on GitHub Pages.

## Working on it

```sh
corepack pnpm install        # pnpm, at the version package.json names
pnpm dev                     # http://localhost:4321
pnpm build && pnpm preview   # the site as it is published
```

Before a pull request, what CI runs:

```sh
pnpm check                   # types, in .astro and .ts files alike
pnpm lint                    # ESLint and Prettier (pnpm format writes the fixes)
pnpm test:unit               # the pure parts: src/lib, src/i18n, src/sketches, scripts/lib
pnpm test                    # the unit tests, then a build in the stretch test's language and the end-to-end checks
```

`dev_docs/` (git-ignored) holds the working notes: the plan the site was built from, where it stands and what comes next, and the deployment steps.

`pnpm test` needs a browser: Playwright's own (`pnpm exec playwright install chromium`), or the Chrome on the computer with `PLAYWRIGHT_CHANNEL=chrome pnpm test`. It leaves the stretch test's language behind; `pnpm i18n:pseudo:remove` takes it away, and `pnpm build` then builds English alone again.

Node 22 or later. The `.env.example` file lists the two values the site plugs services into; without them the site builds and runs, with the waitlist form answering by itself while developing and saying it could not send in a build.

## How it is put together

Every text a visitor reads lives in one of two places, never in a component or a page:

- **`src/i18n/dict/<language>.ts`**: the interface's words (the bar, the buttons, the forms and their messages, the footer). English (`en.ts`) defines the keys; another language is a file with the same keys, and a missing key fails the type check.
- **`src/content/`**: the pages' copy. A marketing page is `pages/<language>/<page>.yaml`, checked against its schema in `content/schemas` (a missing sentence or a misspelled key fails the build and says where). A legal page is `legal/<language>/<page>.md`. The docs are Starlight's, under `docs/docs/<group>/`: `start` (what the system is and how it works), `configure` (what each part of a configuration is and what you set) and `scripting` (the math expression engine and Lua scripts). They are written for the person who uses a unit; the firmware's developer reference stays in rt_core's repository and the site links to it.

A linter rule (`eslint.config.js`) refuses text in markup, and the stretch test (below) catches what a linter can't see. That is what makes a later language a set of files and nothing else.

```
src/
  components/
    ui/          the parts every page is made of: Button, Section, Cells, Rows, Steps, Figure, Shot, CodeBlock, Inline, Icon
    layout/      the bar (Nav), the footer, the band with the form, the skip link, a legal page's head
    forms/       the islands: the waitlist form and the questions after joining
    art/         the hero's sketch as an island
    home/        the front page's sections, one file each, in the order they are on the page
    starlight/   what the docs override of Starlight: header, footer, page title, no theme switch
  content/       the copy, by language (above), and the schemas it is checked against
  i18n/          the dictionary, the languages, t(), href(), and the names that are never translated
  layouts/       Base (the <head>, from src/lib/seo.ts) and Marketing (bar, main, band, footer)
  lib/           pure logic: seo, images, inline markup, content access, the environment, site addresses
  pages/         the routes, one file each and thin: [...lang]/ makes every page once for each language
  sketches/      the ink sketch, pure, drawn by the island and by scripts/render-stills.ts alike
  styles/        tokens.css (the values), global.css (Tailwind over them), docs.css (Starlight over them)
  assets/        the app's captures and the sketch's still
scripts/         write the stretch language, read the firmware's licenses, render the still and the marks, screenshots
tests/           Playwright: the stretch test and the smoke test, over the pages listed in tests/pages.ts
```

Design tokens are plain custom properties in `src/styles/tokens.css`; Tailwind's theme and Starlight's variables are both set from them, and a component never names a color or a font of its own.

## Adding a page

1. A schema in `src/content/schemas/pages.ts`, built from the shapes in `shared.ts`, and a collection for it in `src/content.config.ts` (`page('<file>', schema)`), plus its name in `src/lib/content.ts`.
2. Its copy in `src/content/pages/en/<file>.yaml`, with a `title` and a `description`.
3. A route in `src/pages/[...lang]/<page>.astro`: `export const getStaticPaths = localePaths`, `copy('<page>', lang)`, the `Marketing` layout and the parts of `src/components/ui`.
4. Its row in `tests/pages.ts`, so that every check covers it, and a link to it from where it belongs. A page is added when it has its content, never before.

## Adding a language

1. `src/i18n/dict/<code>.ts`, every key of `en.ts` in that language; `localeNames` in `src/i18n/index.ts` gets its name as its speakers write it.
2. `src/content/pages/<code>/` and `src/content/legal/<code>/`, a file for each English one, and the docs under `src/content/docs/<code>/docs/`; Starlight's own words in `src/content/i18n/<code>.json`.
3. `pnpm i18n:status` says what is missing. The language appears in the bar and the footer by itself once its dictionary file exists, so the file is added last, when the pages are whole.

Addresses keep their English words after the language's code (`/de/firmware/`). A page a language does not have is served in English under its address, with a line that says so, by Starlight for the docs and by `copy()`'s fallback for a marketing page.

## The stretch test

Before any translation exists, `pnpm i18n:pseudo` writes a language that is not one: English with accents and a third more length (`scripts/lib/pseudo.ts`). `tests/stretch.spec.ts` opens every launch page in it at a phone's and a desktop's width and fails on a page that is wider than the window, or that still shows a plain English word. Names that are never translated (`src/i18n/names.ts`), code, dates and what is marked `translate="no"` are allowed.

## The firmware's licenses

The Firmware and Licenses pages say what license each firmware repository is under. That is a claim the site makes, so it is not looked up at build time: `firmware.json` holds it, `pnpm licenses:update` reads it again from GitHub, and the change is committed and seen.

## The waitlist

The form (`src/components/forms/EmailForm.tsx`) posts to `PUBLIC_WAITLIST_ENDPOINT`, a relay in front of the list service, which holds the service's token and keeps no copy of the address. The relay is not in this repository. What the form expects of it:

```
POST <endpoint>            { "email": "...", "page": "/firmware/", "lang": "en" }
  200 { "status": "pending" }   the address was taken and a confirmation sent
  200 { "status": "already" }   it was on the list already
  any other answer              the form says it could not be sent, and nothing was saved
POST <endpoint>/answers    { "email": "...", "answers": { "<question id>": "..." | ["..."] } }
  200                           the answers are in
```

The questions and their ids are in `src/content/pages/en/waitlist.yaml`. Without a script the form posts the same fields, form-encoded, to the endpoint. The publish job refuses to run without the endpoint, so the site never goes live with a form that leads nowhere.

## Pictures and marks

The app's captures are in `src/assets/app/`; a page names one by its file and `src/lib/images.ts` re-encodes it in the widths the page needs. `pnpm stills` renders the hero's still from the sketch itself, `pnpm marks` the favicon and the social card from the site's own type and tokens; both are committed. `pnpm shots` takes a picture of every launch page at both widths from a running preview, to look a change over.
