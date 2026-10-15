/**
 * Generate the PWA icon set.
 *
 * Run with `npm run icons`. The output is committed, so a normal build and
 * CI never need to run this, it exists so the icons are reproducible from
 * source rather than being opaque binaries someone drew once.
 *
 * Written against node:zlib only. The icon is the national flag of The
 * Gambia on a dark field, the same mark used in the app's logo. Solid
 * horizontal bands rasterise directly and do not justify an image library.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');

const FIELD = [0x0d, 0x2b, 0x36];
const RED = [0xce, 0x11, 0x26];
const WHITE = [0xff, 0xff, 0xff];
const BLUE = [0x0c, 0x1c, 0x8c];
const GREEN = [0x3a, 0x77, 0x28];

/* ------------------------------------------------------------------ */
/* Minimal PNG writer                                                  */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

/** `pixels` is RGBA, width * height * 4 bytes. */
function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  // 10..12 stay zero: deflate, adaptive filtering, no interlace.

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter type 0
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------ */
/* The icon itself                                                     */
/* ------------------------------------------------------------------ */

function draw(size, { radius, inset }) {
  const pixels = Buffer.alloc(size * size * 4); // transparent
  const r = radius * size;
  const pad = inset * size;
  const field = size - pad * 2;

  // The national flag, in the official 2:3 proportion, with bands in the
  // 6:1:4:1:6 ratio: red, white, blue, white, green. The two white bands
  // are the fimbriations separating the three colours.
  const flagWidth = field * 0.72;
  const flagHeight = (flagWidth * 2) / 3;
  const flagLeft = pad + (field - flagWidth) / 2;
  const flagTop = pad + (field - flagHeight) / 2;
  const unit = flagHeight / 18;
  const bands = [
    [RED, 0, 6],
    [WHITE, 6, 1],
    [BLUE, 7, 4],
    [WHITE, 11, 1],
    [GREEN, 12, 6],
  ];

  const inRoundedRect = (x, y, left, top, width, height, rad) => {
    if (x < left || y < top || x >= left + width || y >= top + height) return false;
    const dx = Math.min(x - left, left + width - 1 - x);
    const dy = Math.min(y - top, top + height - 1 - y);
    if (dx >= rad || dy >= rad) return true;
    // Pick the nearest corner's centre. `dx`/`dy` are distances to the
    // closest edge, so they cannot say which side the pixel is on; compare
    // against the left/top edge directly instead.
    const cx = x - left < rad ? left + rad : left + width - 1 - rad;
    const cy = y - top < rad ? top + rad : top + height - 1 - rad;
    return (x - cx) ** 2 + (y - cy) ** 2 <= rad ** 2;
  };

  const set = (x, y, [red, green, blue], alpha = 255) => {
    const i = (y * size + x) * 4;
    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
    pixels[i + 3] = alpha;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!inRoundedRect(x, y, pad, pad, field, field, r)) continue;
      set(x, y, FIELD);
      for (const [colour, offset, span] of bands) {
        const top = flagTop + offset * unit;
        if (inRoundedRect(x, y, flagLeft, top, flagWidth, span * unit, 0)) {
          set(x, y, colour);
        }
      }
    }
  }

  return encodePng(size, size, pixels);
}

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  // `any` icons keep the rounded corners the platform expects.
  ['icon-192.png', 192, { radius: 0.22, inset: 0 }],
  ['icon-512.png', 512, { radius: 0.22, inset: 0 }],
  // A maskable icon is cropped by the platform, so it must bleed to the edge
  // and keep its content inside the central safe zone.
  ['icon-maskable-512.png', 512, { radius: 0, inset: 0 }],
  ['apple-touch-icon.png', 180, { radius: 0.0001, inset: 0 }],
];

for (const [name, size, options] of targets) {
  const file = join(OUT_DIR, name);
  writeFileSync(file, draw(size, options));
  console.log(`wrote ${name} (${size}×${size})`);
}
