/* C-UI-1 scene runtime. Geometry and drawing are lifted from the approved
   2026-09-18 app/app.js; build.mjs supplies its four pinned data URLs. */

const VALID_SCREENS = new Set(["today", "workout", "coach"]);

export function reviewHooks(search = "") {
  const qs = new URLSearchParams(search);
  const theme = qs.get("theme") === "dawn" ? "dawn" : "ink";
  const asked = qs.get("screen");
  return Object.freeze({
    theme,
    screen: VALID_SCREENS.has(asked) ? asked : "today",
    chrome: qs.get("chrome") === "1",
    date: qs.get("date") === "board" ? "board" : (qs.get("date") || null),
    state: qs.get("state") || null,
  });
}

export function startSceneFrames({ reducedMotion, draw, requestFrame, cancelFrame }) {
  let handle = null;
  let stopped = false;
  const frame = (time = 0) => {
    if (stopped) return;
    draw(time);
    if (!reducedMotion) handle = requestFrame(frame);
  };
  frame(0);
  return () => {
    stopped = true;
    if (handle !== null) cancelFrame(handle);
  };
}

function scrollFades(el, view) {
  if (!el || el.__earnedFades) return;
  const update = () => {
    const can = el.scrollHeight > el.clientHeight + 1;
    const end = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    el.classList.toggle("can-scroll", can);
    el.classList.toggle("at-end", !can || end);
    el.classList.toggle("at-start", !can || el.scrollTop <= 1);
  };
  el.__earnedFades = update;
  el.addEventListener("scroll", update, { passive: true });
  view.addEventListener("resize", update);
  if (view.document.fonts) view.document.fonts.ready.then(update);
  new view.MutationObserver(update).observe(el, { attributes: true, subtree: true,
    childList: true, characterData: true });
  update();
}

function plateGeometry(name, dark, width, height) {
  let share, x, offset;
  if (name === "today") { share = 0.797; x = 0.476; offset = 207; }
  else if (name === "coach") {
    share = dark ? 0.747 : 0.797;
    x = dark ? 0.789 : 0.635;
    offset = dark ? 35 : 27;
  } else { share = 0.747; x = 0.592; offset = 215; }
  share *= 1755 / 1055;
  const h = height * share;
  const w = h * 1491 / 1755;
  return { x: (width - w) * x, y: height - h + offset, w, h };
}

function makeParticles(name, width, height) {
  let seed = name === "coach" ? 31 : name === "workout" ? 23 : 11;
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const top = name === "coach" ? height * 0.3 : name === "workout" ? height * 0.6 : height * 0.42;
  const count = name === "coach" ? 40 : name === "workout" ? 16 : 36;
  return Array.from({ length: count }, () => ({
    x: random() * width, y: top + random() * (height - top),
    radius: 0.7 + random() * 2.2, speed: 0.12 + random() * 0.75,
    alpha: 0.25 + random() * 0.65, phase: random() * Math.PI * 2,
  }));
}

function drawMist(ctx, image, plate, name, dark, width, height, time, still) {
  if (!image.complete || !image.naturalWidth) return;
  ctx.save();
  ctx.globalCompositeOperation = dark ? "screen" : "source-over";
  const scale = width * 1.6 / image.naturalWidth;
  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;
  const offset = still ? 0 : ((time * 0.004) % w);
  ctx.globalAlpha = dark ? 0.22 : 0.28;
  for (let x = -w - offset; x < width + w; x += w) {
    ctx.drawImage(image, x, height * 0.34 - h * 0.5, w, h);
  }
  if (plate.complete && plate.naturalWidth) {
    const geometry = plateGeometry(name, dark, width, height);
    ctx.globalCompositeOperation = "destination-in";
    ctx.globalAlpha = 0.72;
    ctx.drawImage(plate, geometry.x, geometry.y, geometry.w, geometry.h);
  }
  ctx.restore();
}

function sceneRenderer({ frame, view, hooks, assets, counters }) {
  const canvas = frame.querySelector("canvas.embers");
  const context = canvas.getContext("2d");
  const mist = new Image();
  const plateInk = new Image();
  const plateDawn = new Image();
  mist.src = assets.mist;
  plateInk.src = assets.plateInk;
  plateDawn.src = assets.plateDawn;
  let particles = [];
  let dimensions = "";
  return (milliseconds) => {
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(view.devicePixelRatio || 1, 3);
    const next = `${hooks.screen}:${width}x${height}`;
    if (next !== dimensions) {
      dimensions = next;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      particles = makeParticles(hooks.screen, width, height);
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const dark = hooks.theme !== "dawn";
    drawMist(context, mist, dark ? plateInk : plateDawn, hooks.screen, dark, width, height,
      milliseconds, counters.reduced);
    const rgb = dark ? "255,204,140" : "255,214,160";
    for (const ember of particles) {
      const glow = context.createRadialGradient(ember.x, ember.y, 0,
        ember.x, ember.y, ember.radius * 6);
      const pulse = counters.reduced ? 1 : 0.82 + 0.18 * Math.sin(milliseconds / 700 + ember.phase);
      glow.addColorStop(0, `rgba(${rgb},${ember.alpha * pulse})`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(ember.x, ember.y, ember.radius * 6, 0, Math.PI * 2);
      context.fill();
      if (!counters.reduced) {
        ember.y -= ember.speed;
        ember.x += Math.sin(milliseconds / 900 + ember.phase) * 0.08;
        if (ember.y < -8) ember.y = height + 8;
      }
    }
    counters.draws += 1;
  };
}

function installScene(view, doc) {
  const phone = doc.querySelector(".phone");
  const host = doc.getElementById("phone");
  if (!phone || !host || phone.querySelector(".scene-frame")) return null;
  const hooks = reviewHooks(view.location.search);
  const assets = view.__earnedSceneAssets || {};
  const required = ["plateInk", "plateDawn", "mist", "grain"];
  if (!required.every((key) => typeof assets[key] === "string" && assets[key].startsWith("data:image/"))) {
    throw new Error("C-UI-1 SCENE-ASSETS-MISSING");
  }
  const root = doc.documentElement;
  root.dataset.theme = hooks.theme;
  root.dataset.fade = "full";
  root.dataset.scene = "strong";
  root.dataset.screen = hooks.screen;
  if (hooks.state) root.dataset.reviewState = hooks.state;
  doc.body.classList.toggle("with-chrome", hooks.chrome);
  const meta = doc.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = hooks.theme === "dawn" ? "#f7f2e7" : "#0c0b0a";

  const frame = doc.createElement("div");
  frame.className = `scene-frame screen screen-${hooks.screen} is-active`;
  frame.setAttribute("aria-hidden", "true");
  frame.innerHTML = '<div class="plate"></div><canvas class="embers"></canvas>'
    + '<div class="surface"></div><div class="grain"></div>';
  phone.insertBefore(frame, host);
  host.classList.add("scrolls");
  scrollFades(host, view);

  const date = () => {
    if (hooks.date !== "board") return;
    const target = host.querySelector('[data-slot="date"]');
    if (target) target.textContent = "Wed, Sep 16";
  };
  new view.MutationObserver(date).observe(host, { childList: true, subtree: true });
  date();

  const counters = { draws: 0, scheduled: 0,
    reduced: !!(view.matchMedia && view.matchMedia("(prefers-reduced-motion: reduce)").matches) };
  const requestFrame = (next) => { counters.scheduled += 1; return view.requestAnimationFrame(next); };
  const draw = sceneRenderer({ frame, view, hooks, assets, counters });
  const stop = startSceneFrames({ reducedMotion: counters.reduced, draw, requestFrame,
    cancelFrame: (handle) => view.cancelAnimationFrame(handle) });
  view.addEventListener("resize", () => draw(0));
  return Object.freeze({
    snapshot: () => ({ hooks, assets: required.length, draws: counters.draws,
      scheduled: counters.reduced ? 0 : counters.scheduled }),
    stop,
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.__earnedScene = installScene(window, document);
}
