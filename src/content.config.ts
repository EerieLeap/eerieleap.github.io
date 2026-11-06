import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { home } from './content/schemas/home';
import { about, firmware, gefera, licenses, notFound, waitlist } from './content/schemas/pages';
import { text } from './content/schemas/shared';

// Every text a visitor reads is in one of these collections or in the dictionary (src/i18n), by language.

/** A marketing page's copy: src/content/pages/<language>/<file>.yaml, one entry for each language, named by its code. */
const page = <Schema extends z.ZodType>(file: string, schema: Schema) =>
  defineCollection({
    loader: glob({
      pattern: `*/${file}.yaml`,
      base: './src/content/pages',
      generateId: ({ entry }) => entry.split('/')[0] ?? entry,
    }),
    schema,
  });

export const collections = {
  home: page('home', home),
  waitlist: page('waitlist', waitlist),
  firmware: page('firmware', firmware),
  gefera: page('gefera', gefera),
  about: page('about', about),
  licenses: page('licenses', licenses),
  notFound: page('not-found', notFound),

  /** Privacy and the like: running text, src/content/legal/<language>/<page>.md. */
  legal: defineCollection({
    loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
    schema: z.object({
      title: text,
      description: text,
      crumbs: text,
      heading: text,
      lead: text,
      changed: z.coerce.date(),
      changedLabel: text,
      whoLabel: text,
      who: text,
    }),
  }),

  /** The docs' own interface words, by language: src/content/i18n/<code>.json. English is Starlight's own, so en.json is empty. */
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),

  /** The docs: Starlight's. docs/start is written here; docs/firmware is fetched from the firmware's repositories. */
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** For a page fetched from a firmware repository: where its text lives. */
        source: z.object({ repo: z.string(), path: z.string(), commit: z.string() }).optional(),
      }),
    }),
  }),
};
