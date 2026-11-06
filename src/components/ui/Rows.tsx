import { Inline } from './Inline';
import { Pill } from './Pill';
import { cx } from './types';

export type Row = {
  name: string;
  /** A sentence, which may hold links and marks as a content file writes them. */
  text: string;
  /** A mark at the row's end: a license, a status. `on` gives it the orange dot. */
  mark?: string;
  on?: boolean;
};

/** A sheet of rows: a small label, and what is true of it. */
export function Rows({
  items,
  lang,
  labelWidth = 200,
  paper = false,
}: {
  items: Row[];
  lang: string;
  labelWidth?: number;
  paper?: boolean;
}) {
  const line = paper ? 'border-paper-line' : 'border-line';
  return (
    <div className={cx('border-t', line)}>
      {items.map((item) => (
        <div key={item.name} className={cx('flex flex-wrap items-baseline gap-x-7 gap-y-1.5 border-b py-4', line)}>
          <p className={cx('label', paper ? 'text-ground' : 'text-ink')} style={{ flex: `0 0 ${labelWidth}px` }}>
            {item.name}
          </p>
          <p className={cx('min-w-0 flex-[1_1_320px] text-[15.5px]', paper ? 'text-paper-dim' : 'text-dim')}>
            <Inline text={item.text} lang={lang} />
          </p>
          {item.mark && (
            <span className="flex-none">
              <Pill on={item.on}>{item.mark}</Pill>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
