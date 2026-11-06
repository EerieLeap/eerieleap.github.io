import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { inline } from './inline';

const html = (text: string, lang = 'en') => renderToStaticMarkup(<>{inline(text, lang)}</>);

describe('inline', () => {
  it('leaves a plain sentence as it is', () => {
    expect(html('One update a month.')).toBe('One update a month.');
  });

  it('makes a link, a strong word and a piece of code', () => {
    expect(html('See [the privacy page](/legal/privacy/), **now**, in `rt_core`.')).toBe(
      'See <a href="/legal/privacy/" class="text-ink underline underline-offset-[3px]">the privacy page</a>, <strong class="font-semibold text-ink">now</strong>, in <code class="font-mono text-[0.8em] text-ink">rt_core</code>.',
    );
  });

  it('puts a link to a page of the site under the language, and leaves one to another site alone', () => {
    expect(html('[docs](/docs/) and [GitHub](https://github.com/EerieLeap)', 'de')).toBe(
      '<a href="/de/docs/" class="text-ink underline underline-offset-[3px]">docs</a> and <a href="https://github.com/EerieLeap" class="text-ink underline underline-offset-[3px]" rel="noopener">GitHub</a>',
    );
  });
});
