// Renders the still of each sketch: the picture a page shows before the sketch starts, and the one a visitor who asked for
// reduced motion keeps. It is drawn by the sketch's own code (src/sketches) from a fixed seed, so a still and the live
// drawing can never drift apart, and rendering it again gives the same picture. The results are committed under
// src/assets/stills as WebP, a fifth of the PNG; the build does not run this.
//
//   pnpm stills
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { Ink, seeded } from '../src/sketches/ink';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The stills to render: the sketch, its seed, the size of the page it is drawn for, how many pixels a page's point gets
 * (a browser gives two on most screens, and the sketch is drawn in the page's points), and how far it is drawn.
 */
const STILLS = [{ name: 'ink', seed: 2026, width: 1280, height: 860, scale: 2, steps: 1800 }];

for (const still of STILLS) {
  const canvas = createCanvas(still.width * still.scale, still.height * still.scale);
  const context = canvas.getContext('2d');
  context.scale(still.scale, still.scale);
  const ink = new Ink(context, still.width, still.height, seeded(still.seed));
  ink.clear();
  for (let step = 0; step < still.steps; step++) ink.step();
  const file = join(root, 'src/assets/stills', `${still.name}.webp`);
  writeFileSync(file, await sharp(canvas.toBuffer('image/png')).webp({ quality: 92 }).toBuffer());
  console.log(`${still.name}: ${still.width * still.scale} × ${still.height * still.scale}, ${still.steps} steps`);
}
