import type { ThemeRegistration } from 'shiki';

// The one highlighting theme of the site, for the marketing pages' code block (src/components/ui/CodeBlock.astro) and the
// docs' code (astro.config.ts) alike: the site's greys, with the language's words in ink and two quiet accents, a peach for
// text and a mint for numbers. The values are the tokens of src/styles/tokens.css, written here because a Shiki theme is
// hexes, not custom properties.
const GROUND = '#121211';
const INK = '#f2f2ef';
const LEAD = '#d6d6d2';
const DIM = '#c9c9c5';
const FAINT = '#9a9a96';
const PEACH = '#ffb286';
const MINT = '#8fd3c7';

export const CODE_THEME: ThemeRegistration = {
  name: 'eerie-leap',
  type: 'dark',
  colors: {
    'editor.background': GROUND,
    'editor.foreground': LEAD,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: FAINT, fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'keyword.control', 'keyword.operator.logical'],
      settings: { foreground: INK, fontStyle: 'bold' },
    },
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: DIM } },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name'],
      settings: { foreground: INK },
    },
    { scope: ['string', 'punctuation.definition.string'], settings: { foreground: PEACH } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: MINT } },
    { scope: ['variable', 'variable.parameter', 'support.variable'], settings: { foreground: LEAD } },
    { scope: ['entity.name.type', 'support.type', 'support.class'], settings: { foreground: LEAD } },
  ],
};
