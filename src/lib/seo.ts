import { defaultLocale, href, tagOf } from '@/i18n';
import { SITE } from './site';

export type Seo = {
  /** The page's own title: the subject, without the site's name. */
  title: string;
  description: string;
  /** The page's address in English, with its slashes: "/firmware/". */
  path: string;
  lang: string;
  /** The languages this page exists in. */
  langs: string[];
  /** The front page names the site and not itself. */
  home?: boolean;
  /** For a page that should not be found by search, such as the page for an address that has nothing. */
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
};

export type Head = {
  title: string;
  description: string;
  canonical: string;
  alternates: { hreflang: string; href: string }[];
  locale: string;
  image: string;
  noindex: boolean;
  jsonLd: string[];
};

const SITE_NAME = 'Eerie Leap';
const url = (lang: string, path: string) => new URL(href(lang, path), SITE).href;

/** Everything a page's <head> says about it. A page passes data; no page writes its own tags. */
export function headOf(seo: Seo): Head {
  const alternates =
    seo.langs.length > 1
      ? [
          ...seo.langs.map((code) => ({ hreflang: tagOf(code), href: url(code, seo.path) })),
          { hreflang: 'x-default', href: url(defaultLocale, seo.path) },
        ]
      : [];
  return {
    title: seo.home ? `${SITE_NAME}: ${seo.title}` : `${seo.title} · ${SITE_NAME}`,
    description: seo.description,
    canonical: url(seo.lang, seo.path),
    alternates,
    locale: tagOf(seo.lang).replace('-', '_'),
    image: new URL('/og/site.png', SITE).href,
    noindex: seo.noindex ?? false,
    jsonLd: (seo.jsonLd ?? []).map((data) => JSON.stringify({ '@context': 'https://schema.org', ...data })),
  };
}

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: SITE_NAME,
  url: `${SITE}/`,
  sameAs: ['https://github.com/EerieLeap'],
};

export const website = {
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE}/`,
  publisher: { '@id': organization['@id'] },
};
