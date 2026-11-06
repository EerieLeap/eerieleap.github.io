import { useEffect, useRef, useState } from 'react';
import { Ink } from '@/sketches/ink';
import type { Picture } from '@/components/ui';

/** Steps a frame while the first drawing catches up with its still, then one a frame. */
const WARM_STEPS = 8;
const WARM_UNTIL = 700;
/** How long one drawing builds up before it fades and another begins. */
const DRAW_UNTIL = 2600;
const FADE_FRAMES = 110;
/** The still gives way to the sketch after this many frames of drawing. */
const HAND_OVER_AT = 30;

/**
 * The hero's artwork. What a visitor sees first is the still, a picture rendered ahead of time by the same sketch; once the
 * page is idle the sketch starts on a canvas above it and the still fades out beneath. It draws only while on screen and in
 * a visible tab, never above a pixel ratio of 2, and not at all for a visitor who asked for reduced motion: the still stays.
 */
export function InkSketch({ still }: { still: Picture }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ink: Ink | undefined;
    let width = 0;
    let height = 0;
    let fades = 0;
    let frames = 0;
    let onScreen = true;
    let request = 0;
    let resizing = 0;

    const attach = () => {
      width = element.offsetWidth;
      height = element.offsetHeight;
      if (width < 40 || height < 40) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      const context = element.getContext('2d');
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      ink = new Ink(context, width, height);
      fades = 0;
    };

    const tick = () => {
      request = requestAnimationFrame(tick);
      if (!ink || !onScreen || document.hidden) return;
      if (ink.frame < DRAW_UNTIL) {
        const steps = ink.frame < WARM_UNTIL ? WARM_STEPS : 1;
        for (let step = 0; step < steps; step++) ink.step();
        if (++frames === HAND_OVER_AT) setLive(true);
        return;
      }
      ink.fade();
      if (++fades > FADE_FRAMES) attach();
    };

    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
    });
    watcher.observe(element);

    const resized = () => {
      window.clearTimeout(resizing);
      resizing = window.setTimeout(() => {
        if (element.offsetWidth !== width || element.offsetHeight !== height) attach();
      }, 250);
    };
    window.addEventListener('resize', resized);

    attach();
    request = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(request);
      window.clearTimeout(resizing);
      window.removeEventListener('resize', resized);
      watcher.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src={still.src}
        srcSet={still.srcSet}
        sizes="100vw"
        width={still.width}
        height={still.height}
        alt=""
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-[2500ms] ${live ? 'opacity-0' : 'opacity-100'}`}
      />
      <canvas ref={canvas} className="absolute inset-0 block size-full" />
    </div>
  );
}
