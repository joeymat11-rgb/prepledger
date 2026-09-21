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
  callback(40);
  assert.deepEqual({ movingDraws, movingSchedules }, { movingDraws: 2, movingSchedules: 2 });
  stop();
  assert.equal(cancelled, 2);
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
