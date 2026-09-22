import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const SOURCE = path.resolve(import.meta.dirname, "..");
const SCENE = path.join(SOURCE, "scene.mjs");

async function scene() {
  assert(fs.existsSync(SCENE), "C-UI-1 SCENE-MODULE-MISSING: scene.mjs");
  return import(pathToFileURL(SCENE).href);
}

async function instrumentedScene() {
  const source = fs.readFileSync(SCENE, "utf8")
    + "\nexport { makeParticles, sceneRenderer };\n";
  return import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
}

test("C-UI-1 review hooks normalize theme, screen, chrome, date and state", async () => {
  const { reviewHooks } = await scene();
  assert.deepEqual(reviewHooks("?theme=dawn&screen=workout&chrome=1&date=board&state=W-18"), {
    theme: "dawn", screen: "workout", chrome: true, date: "board", state: "W-18",
  });
  assert.deepEqual(reviewHooks("?theme=wrong&screen=wrong&chrome=0&date=2026-09-03&state="), {
    theme: "ink", screen: "today", chrome: false, date: "2026-09-03", state: null,
  });
});

test("C-UI-1 reduced motion draws one actual frame and never schedules another", async () => {
  const { startSceneFrames } = await scene();
  let reducedDraws = 0, reducedSchedules = 0;
  startSceneFrames({ reducedMotion: true, draw: () => { reducedDraws += 1; },
    requestFrame: () => { reducedSchedules += 1; return 1; }, cancelFrame: () => {} });
  assert.deepEqual({ reducedDraws, reducedSchedules }, { reducedDraws: 1, reducedSchedules: 0 });

  let movingDraws = 0, movingSchedules = 0, callback = null, cancelled = null;
  const stop = startSceneFrames({ reducedMotion: false, draw: () => { movingDraws += 1; },
    requestFrame: (next) => { movingSchedules += 1; callback = next; return movingSchedules; },
    cancelFrame: (id) => { cancelled = id; } });
  assert.deepEqual({ movingDraws, movingSchedules }, { movingDraws: 1, movingSchedules: 1 });
  callback(16);
  assert.equal(movingDraws, 1, "the approved 40ms cadence does not redraw at 16ms");
  callback(39);
  assert.equal(movingDraws, 1, "the approved 40ms cadence does not redraw at 39ms");
  callback(41);
  assert.deepEqual({ movingDraws, movingSchedules }, { movingDraws: 2, movingSchedules: 4 });
  stop();
  assert.equal(cancelled, 4);
});

test("C-UI-1 keeps the approved near, far and bokeh ember life model", async () => {
  const { makeParticles } = await instrumentedScene();
  const particles = makeParticles("today", 390, 844);
  assert.equal(particles.length, 36);
  assert(particles.some((particle) => particle.near), "near embers are present");
  assert(particles.some((particle) => !particle.near && !particle.bokeh), "far sparks are present");
  assert(particles.some((particle) => particle.bokeh), "bokeh motes are present");
  for (const particle of particles) {
    assert(Number.isFinite(particle.life) && Number.isFinite(particle.age),
      "every ember has the approved finite life envelope");
  }
});

test("C-UI-1 reduced motion waits for assets and paints five depth sheets with a luminance mask", async () => {
  const { sceneRenderer } = await instrumentedScene();
  const images = [];
  const PreviousImage = globalThis.Image;
  const PreviousDocument = globalThis.document;
  class PendingImage {
    constructor() { this.complete = false; this.naturalWidth = 0; this.naturalHeight = 0; images.push(this); }
    set src(value) { this.url = value; }
    finish() {
      this.complete = true; this.naturalWidth = 100; this.naturalHeight = 50;
      if (typeof this.onload === "function") this.onload();
    }
  }
  const trace = { mainImages: 0, pixelReads: 0, pixelWrites: 0 };
  const gradient = { addColorStop() {} };
  const context = { setTransform() {}, clearRect() {}, save() {}, restore() {}, fillRect() {},
    beginPath() {}, arc() {}, fill() {}, createRadialGradient: () => gradient,
    createLinearGradient: () => gradient,
    drawImage() { trace.mainImages += 1; },
    getImageData() { trace.pixelReads += 1; return { data: new Uint8ClampedArray(4 * 100 * 100) }; },
    putImageData() { trace.pixelWrites += 1; } };
  const canvas = { width: 0, height: 0, style: {}, getContext: () => context };
  const frame = { clientWidth: 390, clientHeight: 844,
    querySelector: (selector) => selector === "canvas.embers" ? canvas : null };
  const counters = { draws: 0, scheduled: 0, reduced: true };
  globalThis.Image = PendingImage;
  globalThis.document = { createElement: (name) => {
    assert.equal(name, "canvas");
    return { width: 0, height: 0, getContext: () => context };
  } };
  try {
    const draw = sceneRenderer({ frame, view: { devicePixelRatio: 1 },
      hooks: { theme: "ink", screen: "today" },
      assets: { mist: "data:image/png;base64,AA", plateInk: "data:image/jpeg;base64,AA",
        plateDawn: "data:image/jpeg;base64,AA" }, counters });
    draw(0);
    assert.equal(counters.draws, 0, "a reduced-motion still is not counted before its images load");
    for (const image of images) image.finish();
    assert.equal(counters.draws, 1, "asset readiness triggers the one reduced-motion still frame");
    assert(trace.mainImages >= 6, "five independently placed mist sheets and their mask were painted");
    assert(trace.pixelReads >= 1 && trace.pixelWrites >= 1,
      "the plate luminance becomes an eased occlusion mask rather than JPEG alpha");
  } finally {
    globalThis.Image = PreviousImage;
    globalThis.document = PreviousDocument;
  }
});

test("C-UI-1 build reaches the scene through the actual offline preview bundle", async () => {
  const ROOT = path.resolve(SOURCE, "../../../..");
  const holder = path.join(ROOT, ".tmp");
  fs.mkdirSync(holder, { recursive: true });
  const room = fs.mkdtempSync(path.join(holder, "cui1-scene-build-"));
  try {
    const { buildToday } = await import(pathToFileURL(path.join(SOURCE, "build.mjs")).href);
    const result = await buildToday({ dist: path.join(room, "dist"), scratch: path.join(room, "scratch") });
    assert.deepEqual(result.assets, ["index.html", "styles.css", "app.js"],
      "the offline package keeps its three-file allowlist");
    const app = fs.readFileSync(path.join(room, "dist/app.js"), "utf8");
    assert.equal(/__earnedScene/.test(app), true, "the actual browser bundle installs the scene witness");
    const css = fs.readFileSync(path.join(room, "dist/styles.css"), "utf8");
    assert.equal((css.match(/data:image\/(?:jpeg|png);base64,/g) || []).length, 4,
      "the actual stylesheet embeds all four scene assets");
  } finally {
    fs.rmSync(room, { recursive: true, force: true });
  }
});
