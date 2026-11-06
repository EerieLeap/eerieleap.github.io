import { describe, expect, it } from 'vitest';
import { Ink, seeded, type Surface } from './ink';

/** A surface that remembers what was drawn on it. */
function recorder(): Surface & { strokes: string[] } {
  const strokes: string[] = [];
  return {
    strokes,
    globalAlpha: 1,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    fillRect: (x, y, w, h) => strokes.push(`fill ${x} ${y} ${w} ${h}`),
    beginPath: () => undefined,
    moveTo: (x, y) => strokes.push(`move ${x.toFixed(2)} ${y.toFixed(2)}`),
    lineTo: (x, y) => strokes.push(`line ${x.toFixed(2)} ${y.toFixed(2)}`),
    stroke: () => undefined,
  };
}

describe('the ink sketch', () => {
  it('draws the same picture from the same seed, so a still can be rendered again', () => {
    const one = recorder();
    const two = recorder();
    const first = new Ink(one, 400, 300, seeded(7));
    const second = new Ink(two, 400, 300, seeded(7));
    for (let step = 0; step < 20; step++) {
      first.step();
      second.step();
    }
    expect(one.strokes).toEqual(two.strokes);
    expect(one.strokes.length).toBeGreaterThan(200);
  });

  it('keeps every point inside the surface', () => {
    const surface = recorder();
    const ink = new Ink(surface, 200, 100, seeded(1));
    for (let step = 0; step < 200; step++) ink.step();
    for (const stroke of surface.strokes) {
      const [kind, x, y] = stroke.split(' ');
      if (kind === 'fill') continue;
      expect(Number(x)).toBeGreaterThanOrEqual(0);
      expect(Number(x)).toBeLessThanOrEqual(200);
      expect(Number(y)).toBeGreaterThanOrEqual(0);
      expect(Number(y)).toBeLessThanOrEqual(100);
    }
    expect(ink.frame).toBe(200);
  });

  it('fades toward the ground with a faint fill', () => {
    const surface = recorder();
    new Ink(surface, 10, 10, seeded(1)).fade();
    expect(surface.strokes).toEqual(['fill 0 0 10 10']);
  });
});
