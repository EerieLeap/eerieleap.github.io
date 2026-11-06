import { describe, expect, it } from 'vitest';
import { headOf } from './seo';

describe('headOf', () => {
  it('puts the subject first and the site last, and the site first on the front page', () => {
    expect(
      headOf({ title: 'Open-source firmware', description: 'd', path: '/firmware/', lang: 'en', langs: ['en'] }).title,
    ).toBe('Open-source firmware · Eerie Leap');
    expect(
      headOf({ title: 'a dash platform', description: 'd', path: '/', lang: 'en', langs: ['en'], home: true }).title,
    ).toBe('Eerie Leap: a dash platform');
  });

  it('names no other language while there is one, and every language with x-default once there are two', () => {
    expect(headOf({ title: 't', description: 'd', path: '/about/', lang: 'en', langs: ['en'] }).alternates).toEqual([]);
    const two = headOf({ title: 't', description: 'd', path: '/about/', lang: 'de', langs: ['en', 'de'] });
    expect(two.canonical).toBe('https://eerieleap.com/de/about/');
    expect(two.alternates).toEqual([
      { hreflang: 'en', href: 'https://eerieleap.com/about/' },
      { hreflang: 'de', href: 'https://eerieleap.com/de/about/' },
      { hreflang: 'x-default', href: 'https://eerieleap.com/about/' },
    ]);
  });

  it('writes structured data with its context', () => {
    const head = headOf({
      title: 't',
      description: 'd',
      path: '/',
      lang: 'en',
      langs: ['en'],
      jsonLd: [{ '@type': 'Thing' }],
    });
    expect(JSON.parse(head.jsonLd[0]!)).toEqual({ '@context': 'https://schema.org', '@type': 'Thing' });
  });
});
