import { z } from 'astro/zod';
import { figure, listOf, meta, pictured, text, titled } from './shared';

const column = z.object({ label: text, items: z.array(titled).min(1) });

/** The front page (src/pages/[...lang]/index.astro, with its sections in src/components/home). */
export const home = z.object({
  ...meta,
  hero: z.object({ status: text, heading: text, lead: text, more: text, caption: text }),
  verbs: z.array(titled).min(1),
  jobs: listOf(titled.extend({ where: text })),
  system: z.object({ title: text, caption: text, in: column, units: column, out: column, app: titled }),
  app: z.object({ title: text, lead: text, desktop: figure, phone: figure, cells: z.array(pictured).min(1) }),
  deep: z.object({
    title: text,
    codeTitle: text,
    steps: z.array(titled.extend({ samples: z.array(text).optional(), more: text.optional() })).min(1),
  }),
  can: z.object({
    title: text,
    planned: text,
    items: z.array(z.object({ name: text, text, planned: z.boolean().optional() })).min(1),
  }),
  status: z.object({
    title: text,
    note: text,
    items: z
      .array(
        titled.extend({
          state: text,
          icon: z.enum(['chip', 'desktop', 'phone', 'unit']),
          pending: z.boolean().optional(),
        }),
      )
      .min(1),
  }),
  follow: z.object({ reasons: z.array(text).min(1) }),
});
