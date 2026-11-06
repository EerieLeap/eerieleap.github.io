import type { ReactNode } from 'react';
import { cx } from './types';

/** A link that looks like a button. The first of a group is plain; a `secondary` one is outlined. */
export function Button({
  href,
  children,
  secondary = false,
  className,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cx(
        'inline-flex h-[50px] items-center text-sm font-semibold no-underline',
        secondary
          ? 'border border-ink/50 px-[22px] text-ink hover:border-pip'
          : 'bg-ink px-6 text-ground hover:bg-pip hover:text-ground',
        className,
      )}
    >
      {children}
    </a>
  );
}
