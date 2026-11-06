import type { ReactNode } from 'react';

const LUA_WORDS = /\b(function|if|then|else|end|local|return|for|do|while|nil|not|and|or)\b/g;
const COMMENT = '--';

/** A block of Lua with a small heading. The language's words stand out, and a comment is dimmed. */
export function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="flex flex-col border border-line bg-panel">
      <p className="label border-b border-line px-4 py-2.5 text-dim">{title}</p>
      <pre className="overflow-x-auto px-[22px] pt-[18px] pb-[22px] font-mono text-xs leading-[1.75] text-dim">
        <code>
          {code.split('\n').map((line, index) => {
            const at = line.indexOf(COMMENT);
            const text = at < 0 ? line : line.slice(0, at);
            return (
              <span key={index} className="block min-h-[1.75em]">
                {withWords(text)}
                {at >= 0 && <span className="text-faint">{line.slice(at)}</span>}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function withWords(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let from = 0;
  for (const match of text.matchAll(LUA_WORDS)) {
    if (match.index > from) nodes.push(text.slice(from, match.index));
    nodes.push(
      <span key={match.index} className="font-medium text-ink">
        {match[0]}
      </span>,
    );
    from = match.index + match[0].length;
  }
  if (from < text.length) nodes.push(text.slice(from));
  return nodes;
}
