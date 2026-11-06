import { getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale } from '@/i18n';

/** The marketing pages, each a collection of its own with its own schema (src/content.config.ts). */
export type PageName = 'home' | 'waitlist' | 'firmware' | 'gefera' | 'about' | 'licenses' | 'notFound';

/**
 * A page's copy in a language, typed by the page's schema. A launch page exists in every language the site has; English
 * stands in for a later page that a language does not have yet.
 */
export async function copy<Name extends PageName>(name: Name, lang: string): Promise<CollectionEntry<Name>['data']> {
  const entry = (await getEntry(name, lang)) ?? (await getEntry(name, defaultLocale));
  if (!entry) throw new Error(`No content for the page "${name}" in ${defaultLocale} (src/content/pages)`);
  return entry.data;
}
