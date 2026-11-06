// Brings the firmware's documentation into the docs. The pages stay written and reviewed in the firmware's repositories;
// the site shows them at a pinned commit (firmware-docs.json), so a change there is seen in a pull request that moves the
// pin before it is published. What this writes is not committed.
//
//   tsx scripts/fetch-firmware-docs.ts                 fetch what the pins name (skips pages already there at that commit)
//   tsx scripts/fetch-firmware-docs.ts --update-pins   move the pins to each repository's latest commit and license
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORGANISATION, descriptionsOf, toDocsPage, type Pins } from './lib/firmware-docs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pinsFile = join(root, 'firmware-docs.json');
const target = join(root, 'src/content/docs/docs/firmware');

const pins: Pins = JSON.parse(readFileSync(pinsFile, 'utf8'));
const headers: Record<string, string> = process.env.GITHUB_TOKEN
  ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
  : {};

async function get(url: string): Promise<Response> {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}

const raw = (repo: string, commit: string, file: string) =>
  get(`https://raw.githubusercontent.com/${ORGANISATION}/${repo}/${commit}/${file}`).then((response) =>
    response.text(),
  );

async function updatePins() {
  for (const [name, repository] of Object.entries(pins.repositories)) {
    const about: { default_branch: string; license: { spdx_id: string } | null } = await get(
      `https://api.github.com/repos/${ORGANISATION}/${name}`,
    ).then((response) => response.json());
    if (about.license) repository.license = about.license.spdx_id;
    if (repository.commit) {
      const head: { sha: string } = await get(
        `https://api.github.com/repos/${ORGANISATION}/${name}/commits/${about.default_branch}`,
      ).then((response) => response.json());
      repository.commit = head.sha;
    }
    console.log(`${name}: ${repository.commit?.slice(0, 7) ?? 'no docs'} · ${repository.license ?? 'no license'}`);
  }
  writeFileSync(pinsFile, `${JSON.stringify(pins, null, 2)}\n`);
}

/** Whether the page on disk was made from the pinned commit already. */
function isCurrent(file: string, commit: string) {
  return existsSync(file) && readFileSync(file, 'utf8').includes(`commit: "${commit}"`);
}

async function fetchPages() {
  mkdirSync(target, { recursive: true });
  const pending = pins.pages.filter(
    (page) => !isCurrent(join(target, `${page.slug}.md`), pins.repositories[page.repo]?.commit ?? ''),
  );
  if (pending.length === 0) {
    console.log(`firmware docs: ${pins.pages.length} pages, all at their pins`);
    return;
  }
  const indexCommit = pins.repositories[pins.index.repo]?.commit;
  if (!indexCommit) throw new Error(`firmware-docs.json pins no commit for ${pins.index.repo}`);
  const descriptions = descriptionsOf(await raw(pins.index.repo, indexCommit, pins.index.file));
  for (const page of pending) {
    const commit = pins.repositories[page.repo]?.commit;
    if (!commit) throw new Error(`firmware-docs.json pins no commit for ${page.repo}`);
    const description = page.description ?? descriptions.get(page.file.split('/').pop() ?? '') ?? '';
    if (!description) throw new Error(`No description for ${page.repo}/${page.file}: add one to firmware-docs.json`);
    const order = pins.pages.indexOf(page) + 1;
    writeFileSync(
      join(target, `${page.slug}.md`),
      toDocsPage(await raw(page.repo, commit, page.file), page, pins, description, order),
    );
    console.log(`firmware docs: ${page.slug} from ${page.repo}@${commit.slice(0, 7)}`);
  }
}

try {
  if (process.argv.includes('--update-pins')) await updatePins();
  await fetchPages();
} catch (error) {
  // A build with no network still works when every page is on disk from an earlier fetch, whatever its commit.
  const missing = pins.pages.filter((page) => !existsSync(join(target, `${page.slug}.md`)));
  if (missing.length > 0 || process.argv.includes('--update-pins')) throw error;
  console.warn(
    `firmware docs: could not fetch (${error instanceof Error ? error.message : error}); using the pages on disk`,
  );
}
