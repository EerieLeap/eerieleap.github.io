import type { ReactNode } from 'react';
import { href } from '@/i18n';

// A sentence of a content file may hold a link, a strong word or a piece of code, written as in Markdown:
// [the privacy page](/legal/privacy/), **a strong word**, `a_name`. Nothing else is read.
const PART = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

/** A sentence with its links and marks, as React nodes. A link that starts with "/" goes to that page in `lang`. */
export function inline(text: string, lang: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let from = 0;
  for (const match of text.matchAll(PART)) {
    const [whole, label, target, strong, code] = match;
    if (match.index > from) nodes.push(text.slice(from, match.index));
    const key = `${match.index}`;
    if (label !== undefined && target !== undefined) {
      const external = /^https?:/.test(target);
      nodes.push(
        <a
          key={key}
          href={href(lang, target)}
          className="text-ink underline underline-offset-[3px]"
          {...(external ? { rel: 'noopener' } : {})}
        >
          {label}
        </a>,
      );
    } else if (strong !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {strong}
        </strong>,
      );
    } else if (code !== undefined) {
      nodes.push(
        <code key={key} className="font-mono text-[0.8em] text-ink">
          {code}
        </code>,
      );
    }
    from = match.index + whole.length;
  }
  if (from < text.length) nodes.push(text.slice(from));
  return nodes;
}
