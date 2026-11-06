import { href, localeNames, locales, useT, type Key } from '@/i18n';
import { DISCUSSIONS, GITHUB } from '@/lib/site';

type FooterLink = { key: Key; to: string };

const PRODUCT: FooterLink[] = [
  { key: 'footer.does', to: '/#does' },
  { key: 'footer.app', to: '/gefera/' },
  { key: 'footer.firmware', to: '/firmware/' },
  { key: 'footer.status', to: '/#status' },
];
const PROJECT: FooterLink[] = [
  { key: 'footer.docs', to: '/docs/' },
  { key: 'footer.github', to: GITHUB },
  { key: 'footer.about', to: '/about/' },
  { key: 'footer.contact', to: DISCUSSIONS },
];
const SMALL: FooterLink[] = [
  { key: 'footer.privacy', to: '/legal/privacy/' },
  { key: 'footer.licenses', to: '/legal/licenses/' },
];

/** The foot of every page. It lists only pages that exist, and the languages once there is more than one. */
export function Footer({ lang, path = '/', year }: { lang: string; path?: string; year: number }) {
  const t = useT(lang);
  const column = (name: Key, links: FooterLink[]) => (
    <nav aria-label={t(name)} className="flex flex-[1_1_140px] flex-col">
      <p className="label mb-1.5 text-faint">{t(name)}</p>
      {links.map((link) => (
        <a key={link.key} href={href(lang, link.to)} className="py-[9px] text-sm text-ink no-underline">
          {t(link.key)}
        </a>
      ))}
    </nav>
  );
  return (
    <footer className="border-t border-soft">
      <div className="wrap flex flex-wrap gap-x-12 gap-y-9 pt-14 pb-7">
        <div className="flex min-w-0 flex-[2_1_280px] flex-col gap-3.5">
          <span className="wordmark">{t('site.name').toLowerCase()}</span>
          <p className="max-w-[340px] text-sm text-dim">{t('site.tagline')}</p>
        </div>
        {column('footer.product', PRODUCT)}
        {column('footer.project', PROJECT)}
        {column('footer.small', SMALL)}
        {locales.length > 1 && (
          <nav aria-label={t('nav.language')} className="flex flex-[1_1_140px] flex-col">
            <p className="label mb-1.5 text-faint">{t('nav.language')}</p>
            {locales.map((code) => (
              <a
                key={code}
                href={href(code, path)}
                lang={code}
                hrefLang={code}
                translate="no"
                className={`py-[9px] text-sm text-ink ${code === lang ? 'underline underline-offset-4' : 'no-underline'}`}
              >
                {localeNames[code] ?? code}
              </a>
            ))}
          </nav>
        )}
      </div>
      <div className="wrap pb-7">
        <p className="label flex flex-wrap gap-x-7 gap-y-1.5 border-t border-soft pt-[18px] text-faint">
          <span>{t('footer.copyright', { year })}</span>
          <span>{t('footer.noCookies')}</span>
        </p>
      </div>
    </footer>
  );
}
