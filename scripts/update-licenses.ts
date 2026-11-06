// Reads each firmware repository's license from GitHub into firmware.json, which the Firmware and Licenses pages show.
// A license is a claim the site makes, so it is read here and committed, not looked up at build time.
//
//   pnpm licenses:update
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORGANISATION = 'EerieLeap';
const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'firmware.json');
const pins: { repositories: Record<string, { license?: string }> } = JSON.parse(readFileSync(file, 'utf8'));
const headers: Record<string, string> = process.env.GITHUB_TOKEN
  ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
  : {};

for (const [name, repository] of Object.entries(pins.repositories)) {
  const url = `https://api.github.com/repos/${ORGANISATION}/${name}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const about: { license: { spdx_id: string } | null } = await response.json();
  if (about.license) repository.license = about.license.spdx_id;
  else delete repository.license;
  console.log(`${name}: ${repository.license ?? 'no license'}`);
}
writeFileSync(file, `${JSON.stringify(pins, null, 2)}\n`);
