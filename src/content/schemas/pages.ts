import { z } from 'astro/zod';
import { figure, head, listOf, meta, pictured, row, text, titled } from './shared';

/** Waitlist (src/pages/[...lang]/waitlist.astro). */
export const waitlist = z.object({
  ...meta,
  ...head,
  status: text,
  card: text,
  cardNote: text,
  gets: listOf(titled),
  survey: z.object({
    title: text,
    lead: text,
    /** The ids of the questions, fields and choices alike, in the order they are asked. */
    order: z.array(text).min(1),
    fields: z.array(z.object({ id: text, question: text, label: text, hint: text })),
    choices: z.array(z.object({ id: text, question: text, options: z.array(text).min(2) })),
    send: text,
    sent: text,
    failed: text,
  }),
  address: listOf(row),
});

/**
 * Confirming a place on the waitlist (src/pages/[...lang]/waitlist/confirm.astro): the page the confirmation email links
 * to. The confirming button's words, and what it says once the relay has answered.
 */
export const confirm = z.object({
  ...meta,
  ...head,
  status: text,
  card: text,
  cardNote: text,
  button: text,
  sending: text,
  again: text,
  confirmed: text,
  expired: text,
  failed: text,
  missing: text,
  noscript: text,
});

/** Firmware (src/pages/[...lang]/firmware.astro). */
export const firmware = z.object({
  ...meta,
  ...head,
  actions: z.object({ docs: text, github: text }),
  codeTitle: text,
  does: listOf(titled),
  runs: listOf(titled),
  repositories: listOf(row),
  docs: listOf(titled.extend({ more: text, to: z.enum(['docs', 'reference']) })),
  part: listOf(titled.extend({ more: text, to: z.enum(['issues', 'code', 'discussions']) })),
});

/** Gefera, the app (src/pages/[...lang]/gefera.astro). */
export const gefera = z.object({
  ...meta,
  ...head,
  actions: z.object({ join: text, more: text }),
  tour: figure,
  does: listOf(pictured),
  also: listOf(row),
  both: z.object({ title: text, lead: text, desktop: figure, phone: figure }),
  stands: listOf(row.extend({ state: text })),
  band: text,
});

/** About, with contact (src/pages/[...lang]/about.astro). */
export const about = z.object({
  ...meta,
  ...head,
  project: z.object({ title: text, left: z.array(text).min(1), right: z.array(text).min(1) }),
  parts: listOf(row),
  contact: listOf(row),
});

/** Licenses (src/pages/[...lang]/legal/licenses.astro). The firmware's licenses themselves come from firmware.json. */
export const licenses = z.object({
  ...meta,
  ...head,
  firmware: listOf(row),
  site: listOf(row),
});

/** The page for an address that has nothing (src/pages/404.astro). */
export const notFound = z.object({
  ...meta,
  code: text,
  heading: text,
  lead: text,
  ways: z.array(titled.extend({ to: text })).min(1),
});
