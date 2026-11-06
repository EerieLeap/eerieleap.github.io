import { z } from 'astro/zod';

// The shapes the pages' content files share. A page's own schema (one file each, beside this one) is built from them, so a
// content file that lacks a sentence, or misspells a key, fails the build and says where.

/** A sentence a visitor reads. */
export const text = z.string().min(1);

/** What every page has, for the browser's tab, a search result and a shared link. */
export const meta = { title: text, description: text };

/** The top of an inner page (PageHead). */
export const head = { crumbs: text, heading: text, lead: text };

/** A thing with a name and a sentence about it: a cell, a step. */
export const titled = z.object({ title: text, text });

/** A row of a sheet: a label, a sentence, and an optional mark at its end. */
export const row = z.object({ name: text, text, mark: text.optional(), on: z.boolean().optional() });

/** A picture of src/assets, by its file name. */
export const figure = z.object({ image: text, alt: text, caption: text });

/** The parts of a capture a small frame can be cut to (src/lib/images.ts). */
export const cut = z.enum(['gauge', 'can']);

/** A cell with a picture. */
export const pictured = titled.extend({ image: text, alt: text, cut: cut.optional() });

/** A section that is a heading over a list of one kind of thing. */
export const listOf = <Item extends z.ZodType>(item: Item) =>
  z.object({ title: text, lead: text.optional(), items: z.array(item).min(1) });
