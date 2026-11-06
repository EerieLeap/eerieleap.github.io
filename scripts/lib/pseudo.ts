// A language that is not one: English with accents and a third more length, so that an English-only site finds what a
// real second language would break. Pure text in, text out (pseudo.test.ts); scripts/pseudo-locale.ts writes the files.
import { NAMES } from '../../src/i18n/names';

const ACCENTS: Record<string, string> = {
  a: 'á',
  e: 'é',
  i: 'í',
  o: 'ö',
  u: 'ü',
  c: 'ç',
  n: 'ñ',
  s: 'š',
  z: 'ž',
  y: 'ý',
  t: 'ť',
  l: 'ľ',
  r: 'ř',
  d: 'ď',
  g: 'ğ',
  A: 'Á',
  E: 'É',
  I: 'Í',
  O: 'Ö',
  U: 'Ü',
  C: 'Ç',
  N: 'Ñ',
  S: 'Š',
  Z: 'Ž',
  Y: 'Ý',
  T: 'Ť',
  L: 'Ľ',
  R: 'Ř',
  D: 'Ď',
  G: 'Ğ',
};

/** How much longer than English a translation is allowed to be before the layout has to cope. */
export const STRETCH = 0.35;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** What is kept as it is: a name, an argument, a link's address, a piece of code, a tag. */
const KEPT = new RegExp(
  [
    ...[...NAMES].sort((a, b) => b.length - a.length).map(escape),
    '\\{\\w+\\}',
    '\\]\\([^)]*\\)',
    '`[^`]*`',
    '<[^>]+>',
    '&[a-z]+;',
    'https?://\\S+',
  ].join('|'),
  'g',
);

/** Stands in for a kept part while the letters are accented: a character no text has. */
const MARK = String.fromCharCode(0xe000);
const MARKED = new RegExp(`${MARK}(\\d+)${MARK}`, 'g');

/** The text with every letter accented, but for what is kept, and a third longer. */
export function pseudo(text: string): string {
  const kept: string[] = [];
  const marked = text.replace(KEPT, (match) => {
    kept.push(match);
    return `${MARK}${kept.length - 1}${MARK}`;
  });
  const accented = marked.replace(/[A-Za-z]/g, (letter) => ACCENTS[letter] ?? letter);
  const restored = accented.replace(MARKED, (whole, index: string) => kept[Number(index)] ?? whole);
  const letters = text.replace(KEPT, '').replace(/[^A-Za-z]/g, '').length;
  // The padding wraps as words do, in short runs, so that it stretches a line and never a page.
  const padding = Math.ceil(letters * STRETCH);
  const runs = Array.from({ length: Math.ceil(padding / 3) }, () => '~~~').join(' ');
  return padding > 0 ? `[${restored} ${runs}]` : restored;
}

/** The same, applied to every string in a content file's data, however nested. Keys that name files or ids are left. */
export function pseudoData(value: unknown, key = ''): unknown {
  if (typeof value === 'string') return NOT_WORDS.has(key) ? value : pseudo(value);
  if (Array.isArray(value)) return value.map((item) => pseudoData(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([name, inner]) => [name, pseudoData(inner, name)]));
  }
  return value;
}

/** The keys of a content file whose values are not words: a picture's file, a cut's name, a route, an id. */
export const NOT_WORDS = new Set(['image', 'cut', 'icon', 'id', 'to', 'order', 'changed']);

/** A Markdown page: its frontmatter's strings and its text, but not its code. */
export function pseudoMarkdown(markdown: string): string {
  const parts = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(markdown);
  if (!parts) return pseudoBody(markdown);
  const frontmatter = parts[1]!.replace(/^(\w+): (['"])(.*)\2$/gm, (whole, key: string, quote: string, text: string) =>
    NOT_WORDS.has(key) ? whole : `${key}: ${quote}${pseudo(text).replace(quote, '')}${quote}`,
  );
  return `---\n${frontmatter}\n---\n${pseudoBody(parts[2]!)}`;
}

function pseudoBody(markdown: string): string {
  let fenced = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced || line.startsWith('```') || line.startsWith(':::')) return line;
      const heading = /^(#+\s+)(.*)$/.exec(line);
      if (heading) return `${heading[1]}${pseudo(heading[2]!)}`;
      const item = /^(\s*(?:[-*]|\d+\.)\s+)(.*)$/.exec(line);
      if (item) return `${item[1]}${pseudo(item[2]!)}`;
      return line.trim() ? pseudo(line) : line;
    })
    .join('\n');
}
