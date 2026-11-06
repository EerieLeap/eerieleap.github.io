// Ink in a noise field: a few hundred points drift through Perlin noise and leave faint strokes behind them, so that the
// drawing builds up like a long exposure. The page's sketch and its still are both this module (scripts/render-stills.ts).

/** What the sketch needs of a 2D canvas, so that a browser's context and a build script's both fit. */
export interface Surface {
  globalAlpha: number;
  fillStyle: unknown;
  strokeStyle: unknown;
  lineWidth: number;
  fillRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  stroke(): void;
}

export type Random = () => number;

/** A seeded random source, for a still that is the same picture every time it is rendered. */
export function seeded(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export const GROUND = '#0C0C0C';
const STROKE = 'rgba(242,242,239,0.06)';
const SPEED = 1.9;

export class Ink {
  /** How many steps have been drawn. */
  frame = 0;
  private readonly count: number;
  /** x, y and velocity of each point, four numbers a point. */
  private readonly points: Float32Array;
  private readonly perm = new Uint8Array(512);
  private depth: number;

  constructor(
    private readonly surface: Surface,
    private readonly width: number,
    private readonly height: number,
    private readonly random: Random = Math.random,
  ) {
    this.seedNoise();
    this.count = Math.round(Math.max(240, Math.min(2200, (900 * (width * height)) / (700 * 680))));
    this.points = new Float32Array(this.count * 4);
    this.depth = random() * 50;
    for (let index = 0; index < this.count; index++) this.place(index);
  }

  /** Covers the whole surface with the ground's color. */
  clear() {
    this.surface.globalAlpha = 1;
    this.surface.fillStyle = GROUND;
    this.surface.fillRect(0, 0, this.width, this.height);
  }

  /** One step of fading the drawing back into the ground. */
  fade() {
    this.surface.globalAlpha = 0.06;
    this.surface.fillStyle = GROUND;
    this.surface.fillRect(0, 0, this.width, this.height);
    this.surface.globalAlpha = 1;
  }

  /** Moves every point one step along the field and draws where it went. */
  step() {
    const { surface, points } = this;
    this.frame++;
    this.depth += 0.0007;
    surface.globalAlpha = 1;
    surface.strokeStyle = STROKE;
    surface.lineWidth = 0.8;
    surface.beginPath();
    for (let index = 0; index < this.count; index++) {
      const at = index * 4;
      const x = points[at]!;
      const y = points[at + 1]!;
      let vx = points[at + 2]!;
      let vy = points[at + 3]!;
      const angle =
        (this.noise(x * 0.0032, y * 0.0032, this.depth) +
          0.4 * this.noise(x * 0.009 + 17.3, y * 0.009 + 5.1, this.depth * 1.3)) *
        8.2;
      vx += Math.cos(angle) * 0.24;
      vy += Math.sin(angle) * 0.24;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > SPEED) {
        vx *= SPEED / speed;
        vy *= SPEED / speed;
      }
      const nx = x + vx;
      const ny = y + vy;
      if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height || this.random() < 0.0016) {
        this.place(index);
        continue;
      }
      surface.moveTo(x, y);
      surface.lineTo(nx, ny);
      points[at] = nx;
      points[at + 1] = ny;
      points[at + 2] = vx;
      points[at + 3] = vy;
    }
    surface.stroke();
  }

  /** Puts a point somewhere new, more often toward the right, where the page has no text. */
  private place(index: number) {
    const at = index * 4;
    this.points[at] = this.width * (1 - Math.pow(this.random(), 1.7));
    this.points[at + 1] = this.random() * this.height;
    this.points[at + 2] = 0;
    this.points[at + 3] = 0;
  }

  private seedNoise() {
    const source = new Uint8Array(256);
    for (let index = 0; index < 256; index++) source[index] = index;
    for (let index = 255; index > 0; index--) {
      const other = Math.floor(this.random() * (index + 1));
      const kept = source[index]!;
      source[index] = source[other]!;
      source[other] = kept;
    }
    for (let index = 0; index < 512; index++) this.perm[index] = source[index & 255]!;
  }

  /** Perlin's improved noise, in three dimensions. */
  private noise(x: number, y: number, z: number) {
    const p = this.perm;
    const xf = Math.floor(x);
    const yf = Math.floor(y);
    const zf = Math.floor(z);
    const X = xf & 255;
    const Y = yf & 255;
    const Z = zf & 255;
    x -= xf;
    y -= yf;
    z -= zf;
    const u = x * x * x * (x * (x * 6 - 15) + 10);
    const v = y * y * y * (y * (y * 6 - 15) + 10);
    const w = z * z * z * (z * (z * 6 - 15) + 10);
    const A = p[X]! + Y;
    const AA = p[A]! + Z;
    const AB = p[A + 1]! + Z;
    const B = p[X + 1]! + Y;
    const BA = p[B]! + Z;
    const BB = p[B + 1]! + Z;
    const x1 = grad(p[AA]!, x, y, z);
    const x2 = grad(p[BA]!, x - 1, y, z);
    const x3 = grad(p[AB]!, x, y - 1, z);
    const x4 = grad(p[BB]!, x - 1, y - 1, z);
    const x5 = grad(p[AA + 1]!, x, y, z - 1);
    const x6 = grad(p[BA + 1]!, x - 1, y, z - 1);
    const x7 = grad(p[AB + 1]!, x, y - 1, z - 1);
    const x8 = grad(p[BB + 1]!, x - 1, y - 1, z - 1);
    const y1 = x1 + u * (x2 - x1);
    const y2 = x3 + u * (x4 - x3);
    const y3 = x5 + u * (x6 - x5);
    const y4 = x7 + u * (x8 - x7);
    const z1 = y1 + v * (y2 - y1);
    const z2 = y3 + v * (y4 - y3);
    return z1 + w * (z2 - z1);
  }
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}
