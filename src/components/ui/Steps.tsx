import { Inline } from './Inline';

const TWO_DIGITS = 2;

/** Steps in order: a number, a title, a sentence or two. A row holds as many as are at least `min` wide. */
export function Steps({
  items,
  lang,
  min = 260,
}: {
  items: { title: string; text: string }[];
  lang: string;
  min?: number;
}) {
  return (
    <ol className="flex flex-wrap gap-x-10">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="flex min-w-0 flex-col gap-2 border-t border-ink/35 pt-[18px] pb-1.5"
          style={{ flex: `1 1 ${min}px` }}
        >
          <span aria-hidden="true" className="label text-dim">
            {String(index + 1).padStart(TWO_DIGITS, '0')}
          </span>
          <h3 className="h-cell">{item.title}</h3>
          <p className="text-[14.5px] text-dim">
            <Inline text={item.text} lang={lang} />
          </p>
        </li>
      ))}
    </ol>
  );
}
