import type { ReactNode } from 'react';
import { cx } from './types';

/** A small mark: a status, a license, a file type. `on` adds the page's one orange dot. */
export function Pill({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return (
    <span
      className={cx(
        'label inline-flex items-center gap-[7px] border px-[9px] py-1 whitespace-nowrap',
        on ? 'border-ink text-ink' : 'border-line text-dim',
      )}
    >
      {on && <span aria-hidden="true" className="size-1.5 rounded-full bg-pip" />}
      {children}
    </span>
  );
}
