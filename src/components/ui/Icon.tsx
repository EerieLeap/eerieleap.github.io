// The site's few drawings, in its own line: a hairline stroke, square ends, no fill.
const ICONS = {
  menu: { box: 20, d: 'M2 6h16M2 14h16' },
  caret: { box: 10, d: 'M1.5 3.5L5 7l3.5-3.5' },
  arrow: { box: 40, d: 'M6 20h26M24 12l8 8-8 8' },
  chip: {
    box: 44,
    d: 'M12 12h20v20H12zM17 12V6M22 12V6M27 12V6M17 38v-6M22 38v-6M27 38v-6M12 17H6M12 22H6M12 27H6M38 17h-6M38 22h-6M38 27h-6',
  },
  desktop: { box: 44, d: 'M5 8h34v24H5zM5 14h34M16 38h12M22 32v6' },
  phone: { box: 44, d: 'M15 5h14a2 2 0 0 1 2 2v30a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19 34h6' },
  unit: { box: 44, d: 'M5 11h34v22H5zM9.5 22a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M22 17h11M22 22h11M22 27h7' },
} as const;

export type IconName = keyof typeof ICONS;

/** One of the site's drawings, `size` px square, in the color of the text around it. It says nothing to a screen reader. */
export function Icon({ name, size, className }: { name: IconName; size?: number; className?: string }) {
  const icon = ICONS[name];
  return (
    <svg
      aria-hidden="true"
      width={size ?? icon.box}
      height={size ?? icon.box}
      viewBox={`0 0 ${icon.box} ${icon.box}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.box > 20 ? 1.3 : 1.4}
      className={className}
    >
      <path d={icon.d} />
    </svg>
  );
}
