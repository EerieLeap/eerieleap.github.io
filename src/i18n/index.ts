import en, { type Dictionary, type Key } from './dict/en';

// A language is a file in dict/. English alone at launch; the stretch test's build adds en-xa, written by a script.
const files = import.meta.glob<{ default: Dictionary }>('./dict/*.ts', { eager: true });
const dictionaries: Record<string, Dictionary> = Object.fromEntries(
  Object.entries(files).map(([file, module]) => [file.slice('./dict/'.length, -'.ts'.length), module.default]),
);

export const defaultLocale = 'en';
export const locales = [defaultLocale, ...Object.keys(dictionaries).filter((code) => code !== defaultLocale)];

/** Each language under its own name, as its speakers write it. */
export const localeNames: Record<string, string> = { en: 'English', 'en-xa': '[Éñğľíšh ~~~]' };

export type Params = Record<string, string | number>;
export type Translate = (key: Key, params?: Params) => string;

const fill = (text: string, params?: Params) =>
  params ? text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in params ? String(params[name]) : whole)) : text;

/** The words of one language. */
export function useT(lang: string): Translate {
  const words = dictionaries[lang] ?? en;
  return (key, params) => fill(words[key], params);
}

/** The language a route's `lang` parameter names: none for English, which has no prefix. */
export const langOf = (param: string | undefined) => (param && locales.includes(param) ? param : defaultLocale);

/** A page's address in a language: English at the root, every other language under its code. */
export const href = (lang: string, path: string) =>
  lang === defaultLocale || !path.startsWith('/') ? path : `/${lang}${path}`;

/** The `lang` parameter of every language, for a route's `getStaticPaths`. */
export const localePaths = () =>
  locales.map((code) => ({ params: { lang: code === defaultLocale ? undefined : code } }));

/** BCP 47, as `lang` attributes and `hreflang` want it. */
export const tagOf = (lang: string) => (lang === 'en-xa' ? 'en-XA' : lang);

/** A date as the language writes it. A content file's date is a day, not a moment, so no time zone moves it. */
export const formatDate = (lang: string, date: Date) =>
  new Intl.DateTimeFormat(tagOf(lang), { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    date,
  );

export type { Key };
