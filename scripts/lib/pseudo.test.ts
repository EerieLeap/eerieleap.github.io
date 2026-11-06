import { describe, expect, it } from 'vitest';
import { pseudo, pseudoData, pseudoMarkdown } from './pseudo';

describe('pseudo', () => {
  it('accents every letter and makes the text longer', () => {
    const made = pseudo('join the waitlist');
    expect(made).toMatch(/^\[.*( ~~~)+\]$/);
    expect(made).not.toMatch(/[aeiou]/);
  });

  it('keeps names, arguments, link addresses and code as they are', () => {
    const made = pseudo('Eerie Leap sent {email} to [the privacy page](/legal/privacy/) with `rt_core`.');
    expect(made).toContain('Eerie Leap');
    expect(made).toContain('{email}');
    expect(made).toContain('](/legal/privacy/)');
    expect(made).toContain('`rt_core`');
    expect(made).not.toContain('privacy page');
  });

  it('leaves a name alone even when it is the whole text', () => {
    expect(pseudo('GitHub')).toBe('GitHub');
  });
});

describe('pseudoData', () => {
  it('walks a content file and leaves what names a file, a cut or a route', () => {
    const made = pseudoData({
      title: 'the app',
      image: 'gauge.png',
      cut: 'gauge',
      ways: [{ to: '/docs/', text: 'docs' }],
    }) as {
      title: string;
      image: string;
      cut: string;
      ways: { to: string; text: string }[];
    };
    expect(made.title).not.toBe('the app');
    expect(made.image).toBe('gauge.png');
    expect(made.cut).toBe('gauge');
    expect(made.ways[0]?.to).toBe('/docs/');
    expect(made.ways[0]?.text).not.toBe('docs');
  });
});

describe('pseudoMarkdown', () => {
  it('translates the frontmatter and the text but not a date or a code block', () => {
    const made = pseudoMarkdown(
      `---\ntitle: 'Privacy'\nchanged: 2026-11-06\n---\n\n## What we keep\n\nYour address.\n\n\`\`\`\nkeep this\n\`\`\`\n`,
    );
    expect(made).toContain("title: '[");
    expect(made).toContain('changed: 2026-11-06');
    expect(made).toContain('## [');
    expect(made).toContain('keep this');
    expect(made).not.toContain('Your address');
  });
});
