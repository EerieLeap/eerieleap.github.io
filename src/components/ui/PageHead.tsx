import type { ReactNode } from 'react';

/**
 * The top of an inner page: where it is, its name, one paragraph and what to do, with room beside for a form, some code or
 * a picture. `wide` gives the side more of the row.
 */
export function PageHead({
  crumbs,
  status,
  title,
  lead,
  actions,
  aside,
  wide = false,
}: {
  crumbs: string;
  status?: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
}) {
  return (
    <header className="border-b border-soft">
      <div className="wrap flex flex-wrap items-end gap-x-16 gap-y-10 pt-[76px] pb-[68px]">
        <div className="flex min-w-0 flex-col gap-[22px]" style={{ flex: wide ? '1 1 440px' : '1.5 1 480px' }}>
          <p className="label flex flex-wrap items-center gap-[9px] text-dim">
            {crumbs}
            {status && (
              <>
                <span aria-hidden="true" className="ml-2 size-[7px] rounded-full bg-pip" />
                <span className="text-ink">{status}</span>
              </>
            )}
          </p>
          <h1 className="h-page">{title}</h1>
          <p className="max-w-[640px] text-lg text-lead">{lead}</p>
          {actions && <div className="mt-1 flex flex-wrap gap-2">{actions}</div>}
        </div>
        {aside && (
          <div className="min-w-0" style={{ flex: wide ? '1.15 1 480px' : '1 1 340px' }}>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
