import type { ReactNode } from 'react';
import { cx } from './types';

/**
 * A section with a heading. Its number is counted by the page (`.numbered` in global.css), so a page gains or loses a
 * section without renumbering the others; `plain` leaves the number out. A page has at most one `paper` section.
 */
export function Section({
  id,
  title,
  lead,
  children,
  paper = false,
  tight = false,
  plain = false,
}: {
  id?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  paper?: boolean;
  tight?: boolean;
  plain?: boolean;
}) {
  const quiet = paper ? 'text-paper-dim' : 'text-dim';
  return (
    <section id={id} className={paper ? 'bg-paper text-ground' : 'border-t border-soft'}>
      <div className={cx('wrap', tight ? 'pt-14 pb-[60px]' : 'pt-[84px] pb-[92px]')}>
        <div className={cx('flex items-baseline gap-[18px]', lead ? 'mb-3.5' : 'mb-9')}>
          {!plain && <p aria-hidden="true" className={cx('label section-number', quiet)} />}
          <h2 className="h-section">{title}</h2>
        </div>
        {lead && <p className={cx('mb-[38px] max-w-[660px] text-[17px]', quiet)}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}
