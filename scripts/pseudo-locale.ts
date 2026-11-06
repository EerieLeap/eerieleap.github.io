// Writes the stretch test's language, en-xa: the dictionary, the pages' copy and the legal pages, each made from English by
// scripts/lib/pseudo.ts. The files are not committed; `--remove` takes them away again.
//
//   tsx scripts/pseudo-locale.ts            write src/i18n/dict/en-xa.ts, src/content/pages/en-xa, src/content/legal/en-xa
//   tsx scripts/pseudo-locale.ts --remove   remove them
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';
import en from '../src/i18n/dict/en';
import { pseudo, pseudoData, pseudoMarkdown } from './lib/pseudo';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = 'en-xa';
const dictionary = join(root, 'src/i18n/dict', `${LANG}.ts`);
const pages = join(root, 'src/content/pages');
const legal = join(root, 'src/content/legal');

if (process.argv.includes('--remove')) {
  rmSync(dictionary, { force: true });
  rmSync(join(pages, LANG), { recursive: true, force: true });
  rmSync(join(legal, LANG), { recursive: true, force: true });
  console.log(`${LANG}: removed`);
} else {
  const words = Object.fromEntries(Object.entries(en).map(([key, text]) => [key, pseudo(text)]));
  writeFileSync(
    dictionary,
    `// Written by scripts/pseudo-locale.ts: the stretch test's language. Not committed.\nimport type { Dictionary } from './en';\n\nconst xa: Dictionary = ${JSON.stringify(words, null, 2)};\n\nexport default xa;\n`,
  );
  for (const [folder, transform] of [
    [pages, (text: string) => stringify(pseudoData(parse(text)))],
    [legal, pseudoMarkdown],
  ] as const) {
    mkdirSync(join(folder, LANG), { recursive: true });
    for (const file of readdirSync(join(folder, 'en'))) {
      writeFileSync(join(folder, LANG, file), transform(readFileSync(join(folder, 'en', file), 'utf8')));
    }
  }
  console.log(`${LANG}: written (${Object.keys(words).length} words, the pages and the legal texts)`);
}
