import { href } from '@/i18n';
import { Inline } from './Inline';
import { Shot } from './Shot';
import { cx, type Cut, type Picture } from './types';

export type Cell = {
  /** A small label above the title: a letter, a number, a word. */
  mark?: string;
  title: string;
  /** A sentence, which may hold links and marks as a content file writes them. */
  text: string;
  picture?: Picture;
  alt?: string;
  cut?: Cut;
  more?: { label: string; to: string };
};

/** A grid of cells on hairlines. Cells are at least `min` wide and share a row's width evenly. */
export function Cells({
  items,
  lang,
  min = 280,
  paper = false,
}: {
  items: Cell[];
  lang: string;
  min?: number;
  paper?: boolean;
}) {
  const quiet = paper ? 'text-paper-dim' : 'text-dim';
  return (
    <div
      className={cx('flex flex-wrap gap-px border', paper ? 'border-paper-line bg-paper-line' : 'border-line bg-line')}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className={cx('flex min-w-0 flex-col gap-2 px-6 pt-[22px] pb-[26px]', paper ? 'bg-paper' : 'bg-ground')}
          style={{ flex: `1 1 ${min}px` }}
        >
          {item.picture && <Shot picture={item.picture} alt={item.alt ?? ''} cut={item.cut} className="mb-2.5" />}
          {item.mark && <p className={cx('label', paper ? 'text-paper-dim' : 'text-faint')}>{item.mark}</p>}
          <h3 className="h-cell">{item.title}</h3>
          <p className={cx('text-[14.5px]', quiet)}>
            <Inline text={item.text} lang={lang} />
          </p>
          {item.more && (
            <p className="mt-auto pt-2.5 text-sm">
              <a href={href(lang, item.more.to)}>{item.more.label}</a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
