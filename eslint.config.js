import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// A word a visitor reads never lives in a component or a page: it comes from the dictionary (src/i18n) or from a content
// file (src/content), so that another language is added as files. These rules are what holds that line; the stretch test
// (tests/stretch.spec.ts) catches what a linter can't see.
const WORD = '/[A-Za-z]{2,}/';
const noWordsInMarkup = [
  {
    selector: `:matches(JSXElement, JSXFragment) > JSXText[value=${WORD}]`,
    message: 'Text in markup. Take it from the dictionary (useT) or from the page’s content file.',
  },
  {
    selector: `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=${WORD}]`,
    message: 'A literal sentence in markup. Take it from the dictionary (useT) or from the page’s content file.',
  },
  {
    selector: `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=${WORD}]`,
    message: 'A literal sentence in markup. Take it from the dictionary (useT) or from the page’s content file.',
  },
  {
    selector: `JSXAttribute[name.name=/^(alt|title|placeholder|aria-label|aria-description)$/] > Literal[value=${WORD}]`,
    message:
      'A literal sentence in an attribute a visitor reads or hears. Take it from the dictionary or the content file.',
  },
];

export default defineConfig(
  {
    ignores: [
      'dist/',
      'dist-stretch/',
      '.astro/',
      'playwright-report/',
      'test-results/',
      'screenshots/',
      'src/content/docs/docs/firmware/',
      'src/i18n/dict/en-xa.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // A non-null assertion marks an index that the line above has made sure of; the compiler asks for it (strict).
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['src/components/**/*.{tsx,astro}', 'src/layouts/**/*.astro', 'src/pages/**/*.astro'],
    rules: { 'no-restricted-syntax': ['error', ...noWordsInMarkup] },
  },
);
