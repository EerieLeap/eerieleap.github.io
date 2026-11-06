// The pages the site launches with, and the two widths every one of them is checked at. A page added to the site is added
// here, and every end-to-end check then covers it.
export const LAUNCH_PAGES = [
  { name: 'home', path: '/' },
  { name: 'waitlist', path: '/waitlist/' },
  { name: 'firmware', path: '/firmware/' },
  { name: 'gefera', path: '/gefera/' },
  { name: 'about', path: '/about/' },
  { name: 'privacy', path: '/legal/privacy/' },
  { name: 'licenses', path: '/legal/licenses/' },
  { name: 'not-found', path: '/404.html' },
  { name: 'docs-start', path: '/docs/start/what-eerieleap-is/' },
  { name: 'docs-firmware', path: '/docs/firmware/sensors/' },
] as const;

/** A phone, and a desktop. */
export const WIDTHS = [390, 1280] as const;
