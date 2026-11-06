import { describe, expect, it } from 'vitest';
import { defaultLocale, formatDate, href, langOf, localePaths, locales, useT } from './index';

describe('the languages', () => {
  it('start with English', () => {
    expect(defaultLocale).toBe('en');
    expect(locales[0]).toBe('en');
  });

  it('give English the root and every other language its code first', () => {
    expect(href('en', '/firmware/')).toBe('/firmware/');
    expect(href('de', '/firmware/')).toBe('/de/firmware/');
    expect(href('de', 'https://github.com/EerieLeap')).toBe('https://github.com/EerieLeap');
  });

  it('read a route parameter as a language only when the site has it', () => {
    expect(langOf(undefined)).toBe('en');
    expect(langOf('xx')).toBe('en');
  });

  it('make a route for every language, English with no parameter', () => {
    expect(localePaths()[0]).toEqual({ params: { lang: undefined } });
  });
});

describe('the words', () => {
  it('fill an argument into a sentence and leave an unknown one visible', () => {
    const t = useT('en');
    expect(t('footer.copyright', { year: 2026 })).toBe('© 2026 Eerie Leap');
    expect(t('form.sent')).toContain('{email}');
  });

  it('fall back to English for a language that is not there', () => {
    expect(useT('xx')('nav.docs')).toBe('docs');
  });

  it('write a date the way the language does', () => {
    expect(formatDate('en', new Date('2026-11-06T00:00:00Z'))).toMatch(/Nov/);
  });
});
