import { cx, type Cut, type Picture } from './types';

/**
 * A capture of the app in a small frame. A capture of a whole window is unreadable below about 600 px, so a small frame
 * shows a part of it: `cut` says which.
 */
export function Shot({
  picture,
  alt,
  cut,
  className,
}: {
  picture: Picture;
  alt: string;
  cut?: Cut;
  className?: string;
}) {
  return (
    <div className={cx('relative aspect-[16/10] overflow-hidden border border-line', className)}>
      <img
        src={picture.src}
        srcSet={picture.srcSet}
        sizes="(max-width: 700px) 92vw, 440px"
        width={picture.width}
        height={picture.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={cut ? { transform: `scale(${cut.zoom})`, transformOrigin: cut.at } : undefined}
      />
    </div>
  );
}
