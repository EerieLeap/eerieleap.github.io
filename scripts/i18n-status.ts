// What each language has, lacks or has fallen behind on: its dictionary against English's, and its content files against
// English's. Printed on every pull request; it fails only for a dictionary key or a launch page a language lacks, since
// an outdated page stays up with nothing said (a sentence wrong is better than a page gone).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import en from '../src/i18n/dict/en';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dictionaries = join(root, 'src/i18n/dict');
const folders = ['src/content/pages', 'src/content/legal'];

const languages = readdirSync(dictionaries)
  .map((file) => file.replace(/\.ts$/, ''))
  .filter((code) => code !== 'en' && code !== 'en-xa');

let failed = false;
for (const lang of languages) {
  const dictionary = join(dictionaries, `${lang}.ts`);
  const text = readFileSync(dictionary, 'utf8');
  const missingKeys = Object.keys(en).filter((key) => !text.includes(`'${key}'`) && !text.includes(`"${key}"`));
  const lines = [`${lang}: dictionary ${missingKeys.length === 0 ? 'whole' : `lacks ${missingKeys.length} keys`}`];
  if (missingKeys.length > 0) failed = true;
  for (const folder of folders) {
    for (const file of readdirSync(join(root, folder, 'en'))) {
      const own = join(root, folder, lang, file);
      if (!existsSync(own)) {
        lines.push(`  missing   ${folder}/${lang}/${file}`);
        failed = true;
      } else if (statSync(own).mtimeMs < statSync(join(root, folder, 'en', file)).mtimeMs) {
        lines.push(`  outdated  ${folder}/${lang}/${file} (English changed since)`);
      } else {
        lines.push(`  current   ${folder}/${lang}/${file}`);
      }
    }
  }
  console.log(lines.join('\n'));
}
if (languages.length === 0) console.log('English only: nothing to compare');
if (failed) process.exit(1);
