// The interface's words in English, the source of every other language. A key added here must be added to each language's
// file, or the type check fails. One entry is one whole sentence: `{name}` marks an argument, never a place to join pieces.
const en = {
  'site.name': 'Eerie Leap',
  'site.tagline': 'A CAN data logger and dash platform you can script, with open-source firmware.',
  'site.skip': 'Skip to the text',

  'nav.label': 'Main',
  'nav.does': 'what it does',
  'nav.app': 'the app',
  'nav.firmware': 'firmware',
  'nav.docs': 'docs',
  'nav.menu': 'Menu',
  'nav.join': 'join the waitlist',
  'nav.language': 'language',
  'nav.home': 'Eerie Leap, the front page',

  'footer.product': 'product',
  'footer.project': 'project',
  'footer.small': 'the small print',
  'footer.does': 'what it does',
  'footer.app': 'Gefera, the app',
  'footer.firmware': 'firmware',
  'footer.status': 'where it stands',
  'footer.docs': 'docs',
  'footer.github': 'GitHub',
  'footer.about': 'about',
  'footer.contact': 'contact',
  'footer.privacy': 'privacy',
  'footer.licenses': 'licenses',
  'footer.copyright': '© {year} Eerie Leap',
  'footer.noCookies': 'no cookies',

  'form.email': 'email',
  'form.emailHint': 'you@example.com',
  'form.join': 'join the waitlist',
  'form.joining': 'joining…',
  'form.note': 'One update a month from the build. Leave any time.',
  'form.invalid': 'That doesn’t look like an email address.',
  'form.sent': 'Almost there. We sent a link to {email}: one click on it confirms your place.',
  'form.already': 'You’re already on the list, and nothing has changed.',
  'form.failed': 'That didn’t go through, and nothing was saved. Try again in a moment.',
  'form.again': 'try again',

  'band.title': 'follow the build',

  'docs.source': 'from {repo} · {path}',
  'docs.sourceAt': 'at the commit the site was built from',
  'docs.edit': 'edit on GitHub',
  'docs.group.start': 'start',
  'docs.group.firmware': 'firmware',

  'offer.close': 'Close',
} as const;

export type Key = keyof typeof en;
export type Dictionary = Record<Key, string>;

export default en satisfies Dictionary;
