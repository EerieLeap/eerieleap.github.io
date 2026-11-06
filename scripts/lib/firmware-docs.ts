// How a page of a firmware repository becomes a page of the site's docs. Pure text in, text out, so that it is tested
// without a network (firmware-docs.test.ts); scripts/fetch-firmware-docs.ts does the fetching and the writing.

export type Repository = { commit?: string; license?: string };

export type PageSpec = {
  repo: string;
  /** The file's path in its repository. */
  file: string;
  /** The page's name in the site's address: /docs/firmware/<slug>/. */
  slug: string;
  /** For a page the index does not describe. */
  description?: string;
  /** Other paths this page is linked by, as "<repo>:<path>": a repository that holds another as a module. */
  aliases?: string[];
};

export type Pins = {
  repositories: Record<string, Repository>;
  /** The page that lists the others and says what each covers. */
  index: { repo: string; file: string };
  pages: PageSpec[];
};

export const ORGANISATION = 'EerieLeap';
export const DOCS_BASE = '/docs/firmware/';

const FENCE = /^(```|~~~)/;
const LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g;

/** What each page covers, as the index's table says it: file name to sentence. */
export function descriptionsOf(index: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const line of index.split('\n')) {
    const row = /^\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (row?.[1] && row[2]) found.set(row[1], row[2].replace(/`/g, ''));
  }
  return found;
}

/** A path made of a directory and a relative path, with its "." and ".." resolved. */
export function resolvePath(directory: string, relative: string): string {
  const parts = directory ? directory.split('/') : [];
  for (const part of relative.split('/')) {
    if (part === '..') parts.pop();
    else if (part !== '.' && part !== '') parts.push(part);
  }
  return parts.join('/');
}

/** Where a link of a page should point on the site: to another fetched page, or to the file on GitHub at the pin. */
export function rewriteLink(target: string, page: PageSpec, pins: Pins, image = false): string {
  if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) return target;
  const [path = '', anchor] = target.split('#');
  const directory = page.file.split('/').slice(0, -1).join('/');
  const resolved = resolvePath(directory, path);
  const key = `${page.repo}:${resolved}`;
  const other = pins.pages.find((one) => `${one.repo}:${one.file}` === key || one.aliases?.includes(key));
  if (other && !image) return `${DOCS_BASE}${other.slug}/${anchor ? `#${anchor}` : ''}`;
  const commit = pins.repositories[page.repo]?.commit ?? 'main';
  const host = image ? 'https://raw.githubusercontent.com' : 'https://github.com';
  const view = image ? '' : 'blob/';
  return `${host}/${ORGANISATION}/${page.repo}/${view}${commit}/${resolved}${anchor ? `#${anchor}` : ''}`;
}

/** The page's text with every link outside a code block pointed where it should go on the site. */
export function rewriteLinks(markdown: string, page: PageSpec, pins: Pins): string {
  let fenced = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (FENCE.test(line.trimStart())) {
        fenced = !fenced;
        return line;
      }
      if (fenced) return line;
      return line.replace(LINK, (_whole, bang: string, label: string, target: string, rest: string) => {
        return `${bang}[${label}](${rewriteLink(target, page, pins, bang === '!')}${rest})`;
      });
    })
    .join('\n');
}

/** The page's title, which is its first heading, and the text without it. */
export function splitTitle(markdown: string): { title: string; body: string } {
  const heading = /^# +(.+)$/m.exec(markdown);
  if (!heading?.[1]) return { title: '', body: markdown };
  return { title: heading[1].trim(), body: markdown.replace(heading[0], '').replace(/^\n+/, '') };
}

/** A page of a firmware repository as a page of the site's docs: its frontmatter, then its text with its links rewritten. */
export function toDocsPage(markdown: string, page: PageSpec, pins: Pins, description: string, order: number): string {
  const { title, body } = splitTitle(markdown);
  const commit = pins.repositories[page.repo]?.commit ?? '';
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title || page.slug)}`,
    `description: ${JSON.stringify(description)}`,
    `editUrl: ${JSON.stringify(`https://github.com/${ORGANISATION}/${page.repo}/edit/main/${page.file}`)}`,
    'sidebar:',
    `  order: ${order}`,
    'source:',
    `  repo: ${JSON.stringify(page.repo)}`,
    `  path: ${JSON.stringify(page.file)}`,
    `  commit: ${JSON.stringify(commit)}`,
    '---',
    '',
  ].join('\n');
  return `${frontmatter}${rewriteLinks(body, page, pins)}`;
}
