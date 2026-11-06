import { href, localeNames, locales, useT } from '@/i18n';
import { Icon } from '@/components/ui';
import { NAV, type NavKey } from '@/lib/site';

/**
 * The bar at the top of every page. Below 860 px its links fold into a menu, which is a `<details>` and so opens with no
 * script. The language control is there only once the site has a second language.
 */
export function Nav({ lang, active, path = '/' }: { lang: string; active?: NavKey; path?: string }) {
  const t = useT(lang);
  const many = locales.length > 1;
  return (
    <nav
      aria-label={t('nav.label')}
      className="relative z-10 flex items-center gap-x-[26px] border-b border-soft px-gutter py-2 max-[520px]:gap-x-2.5"
    >
      <a href={href(lang, '/')} aria-label={t('nav.home')} className="wordmark mr-auto py-3 text-ink no-underline">
        {t('site.name').toLowerCase()}
      </a>
      <div className="hidden items-center gap-x-[26px] bar:flex">
        {NAV.map((item) => (
          <a
            key={item.key}
            href={href(lang, item.path)}
            aria-current={item.key === active ? 'page' : undefined}
            className={`py-[13px] text-[13.5px] text-ink no-underline ${item.key === active ? 'shadow-[inset_0_-1px_0_var(--ink)]' : ''}`}
          >
            {t(item.key)}
          </a>
        ))}
        {many && <LanguageControl lang={lang} path={path} />}
      </div>
      <details className="group bar:hidden" data-part="menu">
        <summary
          aria-label={t('nav.menu')}
          className="flex size-[46px] cursor-pointer list-none items-center justify-center border border-ink/35 text-ink group-open:border-ink [&::-webkit-details-marker]:hidden"
        >
          <Icon name="menu" />
        </summary>
        <div className="absolute inset-x-0 top-full border-b border-soft bg-ground">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={href(lang, item.path)}
              className="block border-b border-line px-gutter py-[17px] text-2xl font-medium tracking-[-0.03em] text-ink no-underline"
            >
              {t(item.key)}
            </a>
          ))}
          {many && (
            <div className="px-gutter pt-[18px] pb-5">
              <p className="label mb-2.5 text-faint">{t('nav.language')}</p>
              <div className="flex flex-wrap gap-2">
                {locales.map((code) => (
                  <a
                    key={code}
                    href={href(code, path)}
                    lang={code}
                    hrefLang={code}
                    translate="no"
                    className={`inline-flex h-11 items-center border px-4 text-[15px] text-ink no-underline ${code === lang ? 'border-ink font-semibold' : 'border-line'}`}
                  >
                    {localeNames[code] ?? code}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
      <a
        href={href(lang, '/waitlist/')}
        className="min-w-0 bg-ink px-[18px] py-[13px] text-center text-[13.5px] leading-tight font-semibold text-ground no-underline hover:bg-pip hover:text-ground bar:whitespace-nowrap max-[520px]:px-3"
      >
        {t('nav.join')}
      </a>
    </nav>
  );
}

/** The language's code, and the list of languages, each under its own name and each a link to this page in it. */
function LanguageControl({ lang, path }: { lang: string; path: string }) {
  const t = useT(lang);
  return (
    <details className="group relative">
      <summary
        translate="no"
        aria-label={`${t('nav.language')}: ${localeNames[lang] ?? lang}`}
        className="label flex h-[46px] cursor-pointer list-none items-center gap-[7px] border border-ink/35 px-3 text-ink group-open:border-ink [&::-webkit-details-marker]:hidden"
      >
        {lang}
        <Icon name="caret" />
      </summary>
      <div className="absolute top-[52px] right-0 z-20 min-w-[210px] border border-line bg-panel py-1.5">
        {locales.map((code) => (
          <a
            key={code}
            href={href(code, path)}
            lang={code}
            hrefLang={code}
            translate="no"
            className={`flex h-11 items-center gap-3 px-3.5 text-[14.5px] text-ink no-underline ${code === lang ? 'font-semibold' : ''}`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${code === lang ? 'bg-ink' : 'bg-transparent'}`}
            />
            <span className="flex-1">{localeNames[code] ?? code}</span>
            <span className="label font-normal text-faint">{code}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
