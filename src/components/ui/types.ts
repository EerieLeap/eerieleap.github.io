/** A picture ready for a page: its address, its widths, and the size that keeps the page from shifting as it loads. */
export type Picture = { src: string; srcSet?: string; width: number; height: number };

/** A part of a whole-window capture to show in a small frame: how far in, and about which point. */
export type Cut = { zoom: number; at: string };

/** Joins class names, leaving out what is not there. */
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');
