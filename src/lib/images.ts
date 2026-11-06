import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import type { Cell, Cut, Picture } from '@/components/ui';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{png,webp,jpg}', { eager: true });

/** Where a whole-window capture is cut to for a small frame: the gauge editor's canvas, a channel's document. */
export const CUTS = {
  gauge: { zoom: 1.6, at: '57% 45%' },
  can: { zoom: 1.7, at: '78% 12%' },
} satisfies Record<string, Cut>;

/** The recordings: animated pictures, served as they are. */
const MOVING = /-(tour|clip)\.webp$/;

/**
 * A picture of src/assets by its file name, re-encoded and in the widths a page needs. A content file names a picture so,
 * and the page asks for it here.
 */
export async function picture(name: string, widths: number[] = [640, 960, 1440]): Promise<Picture> {
  const found = Object.entries(files).find(([file]) => file.endsWith(`/${name}`));
  if (!found) throw new Error(`No picture named ${name} in src/assets`);
  const source = found[1].default;
  if (MOVING.test(name)) return { src: source.src, width: source.width, height: source.height };
  const fitting = widths.filter((width) => width <= source.width);
  const image = await getImage({ src: source, widths: fitting.length > 0 ? fitting : [source.width], format: 'webp' });
  return {
    src: image.src,
    srcSet: image.srcSet.attribute,
    width: Number(image.attributes.width ?? source.width),
    height: Number(image.attributes.height ?? source.height),
  };
}

/** The cells of a content file with their pictures found and cut, ready for <Cells>. */
export function pictured(
  items: { title: string; text: string; image: string; alt: string; cut?: keyof typeof CUTS }[],
): Promise<Cell[]> {
  return Promise.all(
    items.map(async (item) => ({
      title: item.title,
      text: item.text,
      alt: item.alt,
      picture: await picture(item.image, [480, 800]),
      cut: item.cut && CUTS[item.cut],
    })),
  );
}
