import { describe, expect, it } from 'vitest';
import {
  descriptionsOf,
  resolvePath,
  rewriteLink,
  rewriteLinks,
  splitTitle,
  toDocsPage,
  type Pins,
} from './firmware-docs';

const pins: Pins = {
  repositories: { rt_core: { commit: 'abc123', license: 'Apache-2.0' }, expression_engine: { commit: 'def456' } },
  index: { repo: 'rt_core', file: 'docs/README.md' },
  pages: [
    { repo: 'rt_core', file: 'docs/sensors.md', slug: 'sensors' },
    { repo: 'rt_core', file: 'docs/scripting.md', slug: 'scripting' },
    {
      repo: 'expression_engine',
      file: 'docs/LANGUAGE.md',
      slug: 'expression-language',
      aliases: ['rt_core:modules/expression_engine/docs/LANGUAGE.md'],
    },
  ],
};
const sensors = pins.pages[0]!;

describe('descriptionsOf', () => {
  it('reads what each page covers from the index table', () => {
    const found = descriptionsOf(
      '| Page | Covers |\n| --- | --- |\n| [sensors.md](sensors.md) | Sensor types, `rate` groups |\n',
    );
    expect(found.get('sensors.md')).toBe('Sensor types, rate groups');
  });
});

describe('rewriteLink', () => {
  it('leaves an absolute address or an anchor alone', () => {
    expect(rewriteLink('https://zephyrproject.org/', sensors, pins)).toBe('https://zephyrproject.org/');
    expect(rewriteLink('#rate-groups', sensors, pins)).toBe('#rate-groups');
  });

  it('points a link to another fetched page at that page on the site, anchor and all', () => {
    expect(rewriteLink('scripting.md#lua', sensors, pins)).toBe('/docs/firmware/scripting/#lua');
  });

  it('finds a page a repository holds as a module by its alias', () => {
    expect(rewriteLink('../modules/expression_engine/docs/LANGUAGE.md', sensors, pins)).toBe(
      '/docs/firmware/expression-language/',
    );
  });

  it('points a link to a file that is not a page at the file on GitHub, at the pinned commit', () => {
    expect(rewriteLink('../src/domain/sensor_domain/', sensors, pins)).toBe(
      'https://github.com/EerieLeap/rt_core/blob/abc123/src/domain/sensor_domain',
    );
  });

  it('serves a picture from the repository as a file', () => {
    expect(rewriteLink('pictures/frame.png', sensors, pins, true)).toBe(
      'https://raw.githubusercontent.com/EerieLeap/rt_core/abc123/docs/pictures/frame.png',
    );
  });
});

describe('rewriteLinks', () => {
  it('rewrites links in text and not in code', () => {
    const text = 'See [scripting](scripting.md).\n```\n[not a link](scripting.md)\n```\n';
    expect(rewriteLinks(text, sensors, pins)).toBe(
      'See [scripting](/docs/firmware/scripting/).\n```\n[not a link](scripting.md)\n```\n',
    );
  });
});

describe('toDocsPage', () => {
  it('takes the title from the first heading and writes the frontmatter the docs need', () => {
    const page = toDocsPage('# Sensors\n\nThe sensor domain.\n', sensors, pins, 'What a sensor is', 1);
    expect(page).toContain('title: "Sensors"');
    expect(page).toContain('description: "What a sensor is"');
    expect(page).toContain('editUrl: "https://github.com/EerieLeap/rt_core/edit/main/docs/sensors.md"');
    expect(page).toContain('commit: "abc123"');
    expect(page.endsWith('---\nThe sensor domain.\n')).toBe(true);
  });

  it('resolves dots in a path', () => {
    expect(resolvePath('docs', '../src/./x.md')).toBe('src/x.md');
    expect(splitTitle('no heading').title).toBe('');
  });
});
