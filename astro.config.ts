import { readdirSync } from 'node:fs';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import en from './src/i18n/dict/en';

// A language is a file in src/i18n/dict. English alone at launch; the stretch test's build adds en-xa.
const languages = readdirSync(new URL('./src/i18n/dict', import.meta.url))
  .map((file) => file.replace(/\.ts$/, ''))
  .filter((code) => code !== 'en');

export default defineConfig({
  site: 'https://eerieleap.com',
  trailingSlash: 'always',
  redirects: {
    '/docs/': '/docs/start/what-eerieleap-is/',
    '/contact/': '/about/#contact',
  },
  integrations: [
    starlight({
      title: en['site.name'],
      favicon: '/favicon-32.png',
      // The site has its own page for an address that has nothing.
      disable404Route: true,
      customCss: ['./src/styles/docs.css'],
      components: {
        Header: './src/components/starlight/Header.astro',
        Footer: './src/components/starlight/Footer.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
      },
      ...(languages.length > 0 && {
        defaultLocale: 'root',
        locales: {
          root: { label: 'English', lang: 'en' },
          ...Object.fromEntries(
            languages.map((code) => [code, { label: code, lang: code === 'en-xa' ? 'en-XA' : code }]),
          ),
        },
      }),
      sidebar: [
        { label: en['docs.group.start'], items: [{ autogenerate: { directory: 'docs/start' } }] },
        { label: en['docs.group.firmware'], items: [{ autogenerate: { directory: 'docs/firmware' } }] },
      ],
      // The firmware's docs hold device tree snippets, which the highlighter does not know: shown as C.
      expressiveCode: { shiki: { langAlias: { dts: 'c' } } },
      lastUpdated: true,
      pagination: true,
      credits: false,
    }),
    react(),
  ],
  // The services the site plugs into. Each is optional: without its value that part is off (src/lib/env.ts).
  env: {
    schema: {
      PUBLIC_WAITLIST_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
      PUBLIC_CF_BEACON_TOKEN: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
