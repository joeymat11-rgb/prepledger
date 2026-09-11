"use strict";

/* icons.cjs — the app icon, AUTHORED HERE, drawn from the approved design's own tokens.

   No artwork is copied from anywhere. The mark is two facts of the approved 2026-09-08
   design put together: its green (--green #2E5A3C) as the field, its paper (--paper
   #F4F0E8) as the figure, and the figure itself is a plain check — the one thing Today
   says when the morning is logged ("This morning ✓"). Geometry is declared once in
   normalised coordinates and used by BOTH the SVG and the PNG rasteriser, so the two can
   never drift apart.

   The PNG encoder is written here rather than pulled in: a 512x512 RGBA image is an
   IHDR, one deflated IDAT and an IEND, and node:zlib already ships the only hard part.
   This file depends on node:zlib and nothing else, so the tests that use it run under the
   repository's own lockfile. */

const assert = require("node:assert/strict");
const zlib = require("node:zlib");

// The approved design's own custom properties, read back as literals here (the source of
// truth stays rebuild/m1/approved-2026-09-08/*; pwa.cjs asserts these two occur there).
const GREEN = Object.freeze([0x2e, 0x5a, 0x3c]);
const PAPER = Object.freeze([0xf4, 0xf0, 0xe8]);
const GREEN_HEX = "#2E5A3C";
const PAPER_HEX = "#F4F0E8";

/* The mark, in a 0..1 square. A three-point polyline stroked with round caps and round
   joins — the same path the SVG draws with stroke-linecap="round". */
const CHECK = Object.freeze([
  Object.freeze([0.2800, 0.5250]),
  Object.freeze([0.4350, 0.6800]),
  Object.freeze([0.7400, 0.3300]),
]);
const STROKE = 0.0950;   // stroke width, in the same 0..1 units
const RADIUS = 0.2200;   // corner radius of the field, in the same 0..1 units

// How much of the canvas the mark occupies. A maskable icon must survive a circular or
// squircle crop, so its content is drawn inside the 80% safe zone the spec names.
const INSET = Object.freeze({ any: 1.0, maskable: 0.8 });

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = dx * dx + dy * dy;
  const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / length));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

// Distance from a point to the rounded-square field, negative inside.
function roundedSquare(px, py, radius) {
  const qx = Math.abs(px - 0.5) - (0.5 - radius);
  const qy = Math.abs(py - 0.5) - (0.5 - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - radius;
}

function markCoverage(px, py, inset) {
  // Map the canvas point into the mark's own 0..1 space.
  const scale = 1 / inset;
  const mx = (px - (1 - inset) / 2) * scale;
  const my = (py - (1 - inset) / 2) * scale;
  if (mx < 0 || mx > 1 || my < 0 || my > 1) return { field: false, figure: false };
  let nearest = Infinity;
  for (let i = 0; i + 1 < CHECK.length; i++) {
    nearest = Math.min(nearest, distanceToSegment(mx, my, CHECK[i][0], CHECK[i][1], CHECK[i + 1][0], CHECK[i + 1][1]));
  }
  return { field: roundedSquare(mx, my, RADIUS) <= 0, figure: nearest <= STROKE / 2 };
}

/* The raster. Three-by-three supersampling is enough anti-aliasing for a mark this
   simple, and it is deterministic: the same size always produces the same bytes, which
   is what lets the service worker pin the icons by content hash. */
function raster(size, { purpose = "any" } = {}) {
  assert(Number.isInteger(size) && size >= 16 && size <= 1024, "ICON-SIZE FAIL");
  const inset = INSET[purpose];
  assert(inset, `ICON-PURPOSE FAIL: ${purpose}`);
  const pixels = Buffer.alloc(size * size * 4);
  const samples = 3;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let field = 0;
      let figure = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const px = (x + (sx + 0.5) / samples) / size;
          const py = (y + (sy + 0.5) / samples) / size;
          const hit = markCoverage(px, py, inset);
          if (hit.field) field++;
          if (hit.field && hit.figure) figure++;
        }
      }
      const total = samples * samples;
      const fieldAlpha = field / total;
      const figureAlpha = figure / total;
      const offset = (y * size + x) * 4;
      // Paper behind everything (the design's own page colour), then the green field,
      // then the paper figure. A full-bleed opaque icon: iOS gives no transparency.
      for (let c = 0; c < 3; c++) {
        const base = PAPER[c];
        const withField = base + (GREEN[c] - base) * fieldAlpha;
        pixels[offset + c] = Math.round(withField + (PAPER[c] - withField) * figureAlpha);
      }
      pixels[offset + 3] = 255;
    }
  }
  return { size, pixels };
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "latin1");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePng({ size, pixels }) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter type 0 (None): deterministic, and small enough here
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // 8 bits per channel
  ihdr[9] = 6;   // truecolour with alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function png(size, options) {
  return encodePng(raster(size, options));
}

function svg() {
  const points = CHECK.map(([x, y]) => `${(x * 512).toFixed(1)} ${(y * 512).toFixed(1)}`);
  const radius = (RADIUS * 512).toFixed(1);
  const stroke = (STROKE * 512).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Earned">\n`
    + `  <rect x="0" y="0" width="512" height="512" rx="${radius}" ry="${radius}" fill="${GREEN_HEX}"/>\n`
    + `  <path d="M ${points[0]} L ${points[1]} L ${points[2]}" fill="none" stroke="${PAPER_HEX}"\n`
    + `        stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>\n`
    + `</svg>\n`;
}

module.exports = { GREEN, PAPER, GREEN_HEX, PAPER_HEX, CHECK, STROKE, RADIUS, INSET,
  raster, encodePng, png, svg, crc32, chunk, roundedSquare, distanceToSegment, markCoverage };
