import { PUBLIC_CF_BEACON_TOKEN, PUBLIC_WAITLIST_ENDPOINT } from 'astro:env/client';

// The services the site plugs into, each named by an environment value that astro.config.ts declares and checks. A value
// left out turns its part off: the site builds and runs without any of them.

/** Where the waitlist form posts, or nothing until the list service exists (README.md, "The waitlist"). */
export const WAITLIST_ENDPOINT = PUBLIC_WAITLIST_ENDPOINT ?? '';

/** The Cloudflare Web Analytics token, or nothing: then no analytics script is on the page. */
export const ANALYTICS_TOKEN = PUBLIC_CF_BEACON_TOKEN ?? '';
