import { cx, type Picture } from './types';

const TICKS = [
  '-left-px -top-px border-l border-t',
  '-right-px -top-px border-r border-t',
  '-left-px -bottom-px border-l border-b',
  '-right-px -bottom-px border-r border-b',
];

/**
 * A picture in the site's frame: corner ticks and a caption on its lower left. A `phone`'s capture stands upright in the
 * frame, which is then as tall as the row it is in.
 */
export function Figure({
  picture,
  alt,
  caption,
  phone = false,
  eager = false,
}: {
  picture: Picture;
  alt: string;
  caption: string;
  phone?: boolean;
  /** For a picture a visitor sees before scrolling. */
  eager?: boolean;
}) {
  return (
    <figure className={cx('relative border border-line bg-panel', phone ? 'h-full min-h-[440px]' : 'aspect-[16/10]')}>
      <img
        src={picture.src}
        srcSet={picture.srcSet}
        sizes={phone ? '260px' : '(max-width: 900px) 92vw, 900px'}
        width={picture.width}
        height={picture.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={
          phone
            ? 'absolute top-[22px] left-1/2 aspect-[9/20] h-[calc(100%-76px)] w-auto -translate-x-1/2 rounded-lg border border-line object-cover object-top'
            : 'absolute inset-0 size-full object-cover'
        }
      />
      {TICKS.map((tick) => (
        <span key={tick} aria-hidden="true" className={cx('absolute size-3.5 border-ink', tick)} />
      ))}
      <figcaption className="label absolute bottom-0 left-0 border-t border-r border-line bg-ground px-3.5 py-[9px] text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}
