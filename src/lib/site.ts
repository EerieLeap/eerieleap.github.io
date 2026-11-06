// What the site knows about itself and the places it links to. Addresses, not words: nothing here is read by a visitor.
export const SITE = 'https://eerieleap.com';
export const GITHUB = 'https://github.com/EerieLeap';
export const DISCUSSIONS = 'https://github.com/orgs/EerieLeap/discussions';

export const repo = (name: string) => `${GITHUB}/${name}`;

/** The launch bar: a dictionary key and where it goes. */
export const NAV = [
  { key: 'nav.does', path: '/#does' },
  { key: 'nav.app', path: '/gefera/' },
  { key: 'nav.firmware', path: '/firmware/' },
  { key: 'nav.docs', path: '/docs/' },
] as const;

export type NavKey = (typeof NAV)[number]['key'];
