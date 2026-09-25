/* C-UI-1 scene runtime. Geometry and drawing are lifted from the approved
   2026-09-18 app/app.js; build.mjs supplies its four pinned data URLs. */

const VALID_SCREENS = new Set(["today", "workout", "coach"]);

/* The approved pack's device chrome (app/app.html), byte for byte; scene.test.mjs
   compares both strings with the pinned pack so a local edit cannot drift. */
const APPROVED_CHROME_STATUS = "<div class=\"chrome status\" aria-hidden=\"true\"><span class=\"time\">9:41</span><span class=\"island\"></span><span class=\"icons\"><svg viewBox=\"0 0 76 14\" fill=\"currentColor\"><rect x=\"0\" y=\"9\" width=\"3.5\" height=\"5\" rx=\"1\"/><rect x=\"5.5\" y=\"6.5\" width=\"3.5\" height=\"7.5\" rx=\"1\"/><rect x=\"11\" y=\"3.5\" width=\"3.5\" height=\"10.5\" rx=\"1\"/><rect x=\"16.5\" y=\"0.5\" width=\"3.5\" height=\"13.5\" rx=\"1\"/><path d=\"M33.5 3.6a10.5 10.5 0 0 1 13 0l-1.5 1.8a8.2 8.2 0 0 0-10 0zm2.6 3.1a6.6 6.6 0 0 1 7.8 0l-1.5 1.8a4.3 4.3 0 0 0-4.8 0zm2.6 3.1a2.7 2.7 0 0 1 2.6 0L40 12.2z\"/><rect x=\"52\" y=\"1\" width=\"21\" height=\"12\" rx=\"3.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" opacity=\"0.5\"/><rect x=\"53.5\" y=\"2.5\" width=\"18\" height=\"9\" rx=\"2.2\"/><path d=\"M74.3 5v4a2 2 0 0 0 0-4z\" opacity=\"0.5\"/></svg></span></div>";
const APPROVED_CHROME_HOME = "<div class=\"chrome home\" aria-hidden=\"true\"></div>";

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
  let handle = null, stopped = false, last = 0;
  const frame = (time = 0) => {
    if (stopped) return;
    if (reducedMotion || time === 0 || time - last > 40) {
      if (time > 0) last = time;
      draw(time);
    }
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

function emberZone(name, width, height) {
  if (name === "coach") return { x0: 0, x1: width, y0: height * 0.3, y1: height, n: 40 };
  if (name === "workout") return { x0: 0, x1: width, y0: height * 0.6, y1: height, n: 16 };
  return { x0: 0, x1: width, y0: height * 0.42, y1: height, n: 36 };
}

function particleSystem(name, width, height) {
  let seed = 11;
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const zone = emberZone(name, width, height);
  const spawn = (particle = {}, fresh = false) => {
    const kind = random();
    particle.near = kind < 0.42;
    particle.bokeh = kind > 0.88;
    particle.x = zone.x0 + random() * (zone.x1 - zone.x0);
    const u = random(), high = random() < 0.3;
    particle.y = high
      ? zone.y0 + (zone.y1 - zone.y0) * (0.05 + 0.45 * u)
      : zone.y0 + (zone.y1 - zone.y0) * (0.5 + 0.5 * u);
    particle.high = high;
    const q = random() * random();
    particle.life = particle.bokeh ? 2.5 + q * 5
      : (particle.near ? 0.9 + q * 3.6 : 1.1 + q * 4);
    particle.age = fresh ? random() * particle.life : 0;
    particle.r = particle.bokeh ? 4 + random() * 3.5
      : (particle.near ? 1.5 + random() * 1.4 : 0.7 + random() * 0.7);
    particle.a = particle.bokeh ? 0.14 + random() * 0.1
      : (particle.near ? 0.7 + random() * 0.3 : 0.38 + random() * 0.3);
    particle.v = particle.bokeh ? 0.12 + random() * 0.1
      : (particle.near ? 0.5 + random() * 0.45 : 0.3 + random() * 0.3);
    particle.sway = particle.near ? 0.18 + random() * 0.22 : 0.08 + random() * 0.12;
    particle.ph = random() * Math.PI * 2;
    particle.tw = 0.6 + random() * 1.2;
    particle.tph = random() * Math.PI * 2;
    particle.drift = (random() - 0.5) * 0.06;
    if (high) {
      particle.a *= 0.7; particle.r *= 0.85;
      particle.drift *= 2.2; particle.sway *= 1.4;
    }
    return particle;
  };
  return { zone, spawn, particles: Array.from({ length: zone.n }, () => spawn({}, true)) };
}

function makeParticles(name, width, height) {
  return particleSystem(name, width, height).particles;
}

function envelope(particle, zone) {
  const fraction = particle.age / particle.life;
  let value = fraction < 0.15 ? fraction / 0.15
    : (fraction > 0.55 ? Math.max(0, (1 - fraction) / 0.45) : 1);
  const rise = (zone.y1 - particle.y) / (zone.y1 - zone.y0);
  if (rise > 0.85) value *= Math.max(0, (1 - rise) / 0.15);
  return value;
}

function sceneRenderer({ frame, view, hooks, assets, counters }) {
  const canvas = frame.querySelector("canvas.embers");
  const context = canvas.getContext("2d");
  const doc = view.document || globalThis.document;
  const mist = new Image(), plateInk = new Image(), plateDawn = new Image();
  const tintCache = { dark: null, light: null };
  const maskCache = new Map();
  let particles = [], system = null, dimensions = "", pending = false, lastMilliseconds = 0;

  const selectedPlate = () => hooks.theme === "dawn" ? plateDawn : plateInk;
  const imagesReady = () => [mist, selectedPlate()].every((image) => image.complete && image.naturalWidth);
  let render;
  const awaken = () => {
    if (pending && imagesReady()) {
      pending = false;
      render(lastMilliseconds);
    }
  };
  for (const image of [mist, plateInk, plateDawn]) image.onload = awaken;
  mist.src = assets.mist;
  plateInk.src = assets.plateInk;
  plateDawn.src = assets.plateDawn;

  const tintMist = (rgb) => {
    const tinted = doc.createElement("canvas");
    tinted.width = mist.naturalWidth; tinted.height = mist.naturalHeight;
    const painter = tinted.getContext("2d");
    painter.drawImage(mist, 0, 0);
    painter.globalCompositeOperation = "source-in";
    painter.fillStyle = rgb;
    painter.fillRect(0, 0, tinted.width, tinted.height);
    return tinted;
  };
  const mistSheets = (dark) => {
    const key = dark ? "dark" : "light";
    if (!tintCache[key]) tintCache[key] = dark
      ? { far: tintMist("rgb(196,204,214)"), mid: tintMist("rgb(232,226,214)"),
        near: tintMist("rgb(255,232,200)") }
      : { far: tintMist("rgb(236,240,246)"), mid: tintMist("rgb(255,248,236)"),
        near: tintMist("rgb(255,238,212)") };
    return tintCache[key];
  };
  const occlusionMask = (name, dark, width, height) => {
    const key = `${name}:${dark}:${width}x${height}`;
    if (maskCache.has(key)) return maskCache.get(key);
    const geometry = plateGeometry(name, dark, width, height), scale = 0.25;
    const mask = doc.createElement("canvas");
    mask.width = Math.ceil(width * scale); mask.height = Math.ceil(height * scale);
    const painter = mask.getContext("2d");
    painter.fillStyle = "#fff";
    painter.fillRect(0, 0, mask.width, mask.height);
    painter.drawImage(selectedPlate(), geometry.x * scale, geometry.y * scale,
      geometry.w * scale, geometry.h * scale);
    let pixels;
    try { pixels = painter.getImageData(0, 0, mask.width, mask.height); }
    catch (_) { maskCache.set(key, null); return null; }
    const data = pixels.data, low = dark ? 0.1 : 0.5, high = dark ? 0.42 : 0.82;
    for (let at = 0; at < data.length; at += 4) {
      const luminance = (0.299 * data[at] + 0.587 * data[at + 1] + 0.114 * data[at + 2]) / 255;
      let value = Math.min(1, Math.max(0, (luminance - low) / (high - low)));
      value = value * value * (3 - 2 * value);
      data[at] = data[at + 1] = data[at + 2] = 255;
      data[at + 3] = Math.round(255 * (0.1 + 0.9 * value));
    }
    const width4 = mask.width, height4 = mask.height;
    const join = Math.round(geometry.y * scale + 700 * (geometry.h / 1755) * scale);
    const reference = Math.min(height4 - 1, join + 8);
    const ramp = Math.max(1, 0.3 * height * scale);
    if (reference > 0) {
      let sum = 0;
      for (let x = 0; x < width4; x += 1) sum += data[(reference * width4 + x) * 4 + 3];
      const mean = sum / width4;
      for (let y = 0; y < reference; y += 1) {
        let mix = Math.min(1, (reference - y) / ramp);
        mix = mix * mix * (3 - 2 * mix);
        const value = Math.round(mean * (1 - mix) + 255 * mix);
        for (let x = 0; x < width4; x += 1) data[(y * width4 + x) * 4 + 3] = value;
      }
      for (let y = reference; y < Math.min(height4, reference + 10); y += 1) {
        const mix = (y - reference) / 10;
        for (let x = 0; x < width4; x += 1) {
          const at = (y * width4 + x) * 4 + 3;
          data[at] = Math.round(data[at] * mix + mean * (1 - mix));
        }
      }
    }
    painter.putImageData(pixels, 0, 0);
    maskCache.set(key, mask);
    return mask;
  };
  const drawMist = (name, dark, width, height, zone, now) => {
    const still = counters.reduced ? 0 : now;
    const texture = mistSheets(dark);
    const base = width * 1.6 / mist.naturalWidth;
    const lowTop = zone.y0;
    const skyTop = name === "coach" ? height * 0.2 : (name === "workout" ? height * 0.3 : height * 0.26);
    const far = [
      { y: skyTop + (lowTop - skyTop) * 0.05, s: 2.3, v: 2.2, a: dark ? 0.2 : 0.22, ph: 0.3, pb: 2.2, bob: 4, t: texture.far },
      { y: skyTop + (lowTop - skyTop) * 0.55, s: 1.9, v: -3.2, a: dark ? 0.24 : 0.26, ph: 1.9, pb: 0.7, bob: 5, t: texture.far },
      { y: lowTop + (height - lowTop) * 0.05, s: 1.4, v: 6, a: dark ? 0.34 : 0.4, ph: 3.4, pb: 1.5, bob: 6, t: texture.mid },
    ];
    const near = [
      { y: lowTop + (height - lowTop) * 0.42, s: 1, v: -9, a: dark ? 0.42 : 0.46, ph: 5, pb: 3.3, bob: 7, t: texture.near },
      { y: lowTop + (height - lowTop) * 0.75, s: 0.7, v: 15, a: dark ? 0.24 : 0.26, ph: 0.9, pb: 4.4, bob: 8, t: texture.near },
    ];
    const sheet = (item) => {
      const widthPx = mist.naturalWidth * base * item.s;
      const heightPx = mist.naturalHeight * base * item.s;
      const offset = ((still * item.v) % widthPx + widthPx) % widthPx;
      const bob = counters.reduced ? 0 : Math.sin(still * 0.045 + item.ph) * item.bob;
      const swell = counters.reduced ? 1 : 0.78 + 0.22 * Math.sin(still * 0.028 + item.pb);
      context.globalAlpha = item.a * swell;
      for (let x = -offset; x < width; x += widthPx) {
        context.drawImage(item.t, x, item.y + bob - heightPx * 0.5, widthPx, heightPx);
      }
    };
    context.save();
    context.globalCompositeOperation = dark ? "screen" : "source-over";
    far.forEach(sheet);
    const mask = occlusionMask(name, dark, width, height);
    if (mask) {
      context.globalCompositeOperation = "destination-in";
      context.globalAlpha = 1;
      context.drawImage(mask, 0, 0, width, height);
    }
    context.globalCompositeOperation = dark ? "screen" : "source-over";
    near.forEach(sheet);
    context.globalCompositeOperation = "destination-in";
    context.globalAlpha = 1;
    const fade = context.createLinearGradient(0, height * 0.13, 0, skyTop + height * 0.14);
    for (let step = 0; step <= 8; step += 1) {
      const unit = step / 8, eased = unit * unit * (3 - 2 * unit);
      fade.addColorStop(unit, `rgba(0,0,0,${eased.toFixed(3)})`);
    }
    context.fillStyle = fade;
    context.fillRect(0, 0, width, height);
    context.restore();
  };

  render = (milliseconds) => {
    lastMilliseconds = milliseconds;
    if (!imagesReady()) { pending = true; return; }
    const width = frame.clientWidth, height = frame.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(view.devicePixelRatio || 1, 3);
    const next = `${hooks.screen}:${width}x${height}`;
    if (next !== dimensions) {
      dimensions = next;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      system = particleSystem(hooks.screen, width, height);
      particles = system.particles;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const dark = hooks.theme !== "dawn", zone = emberZone(hooks.screen, width, height);
    const now = milliseconds / 1000;
    drawMist(hooks.screen, dark, width, height, zone, now);
    const nearColor = dark ? "255,204,140" : "255,214,160";
    for (const particle of particles) {
      const twinkle = counters.reduced ? 1 : 0.82 + 0.18 * Math.sin(now * particle.tw + particle.tph);
      const alpha = particle.a * envelope(particle, zone) * twinkle;
      if (alpha > 0.005) {
        const radius = particle.r * (particle.bokeh ? 2.2 : (particle.near ? 7 : 5));
        const color = particle.near ? nearColor : (particle.high ? "235,215,190" : "250,225,180");
        const glow = context.createRadialGradient(particle.x, particle.y, 0,
          particle.x, particle.y, radius);
        glow.addColorStop(0, `rgba(${color},${alpha})`);
        glow.addColorStop(particle.bokeh ? 0.6 : 0.3,
          `rgba(${color},${alpha * (particle.bokeh ? 0.7 : 0.45)})`);
        glow.addColorStop(1, `rgba(${color},0)`);
        context.fillStyle = glow; context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2); context.fill();
        if (particle.near) {
          context.fillStyle = `rgba(255,246,226,${Math.min(1, alpha + 0.3)})`;
          context.beginPath(); context.arc(particle.x, particle.y, particle.r * 0.55, 0, Math.PI * 2); context.fill();
        }
      }
      if (!counters.reduced) {
        particle.age += 0.04; particle.y -= particle.v; particle.ph += 0.02;
        particle.x += Math.sin(particle.ph) * particle.sway * 0.5 + particle.drift;
        if (particle.age >= particle.life || particle.y < zone.y0 - 6
          || particle.x < -8 || particle.x > width + 8) {
          system.spawn(particle, false);
        }
      }
    }
    counters.draws += 1;
  };
  return render;
}

function installScene(view, doc) {
  const phone = doc.querySelector(".phone");
  const host = doc.getElementById("phone");
  if (!phone || !host || phone.querySelector(".scene-frame")) return null;
  const hooks = reviewHooks(view.location.search);
  const live = { ...hooks };
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

  /* CUI1 B1/B3 (7e25a69). The active screen is structured as the approved pack's:
     decoration layers each aria-hidden, then the REAL live application host as its
     .ui (controls and listeners move with the node), then the pinned device chrome,
     which the approved CSS draws only under body.with-chrome. The screen itself is
     not hidden from assistive technology; only its decoration and chrome are. */
  const frame = doc.createElement("div");
  frame.className = `scene-frame screen screen-${live.screen} is-active`;
  frame.innerHTML = '<div class="plate" aria-hidden="true"></div><canvas class="embers" aria-hidden="true"></canvas>'
    + '<div class="surface" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>'
    + APPROVED_CHROME_STATUS + APPROVED_CHROME_HOME;
  phone.insertBefore(frame, host);
  frame.insertBefore(host, frame.querySelector(".chrome.status"));
  host.classList.add("ui", "scrolls");
  scrollFades(host, view);

  const date = () => {
    if (hooks.date !== "board") return;
    const target = host.querySelector('[data-slot="date"]');
    if (target && target.textContent !== "Wed, Sep 16") target.textContent = "Wed, Sep 16";
  };
  const currentScreen = () => {
    if (host.querySelector('[data-slot="workout-detail"]')) return "workout";
    /* ==== C-UI-6 COACH (begin) ==== the coach screen is the pack's own markup now, so it
       is known by the pack's headline element, not by the stub's old h1 words. */
    if (host.querySelector(".coach-title")) return "coach";
    /* ==== C-UI-6 COACH (end) ==== */
    if (host.querySelector('[data-slot="instruction"]')) return "today";
    return live.screen;
  };

  const counters = { draws: 0, scheduled: 0,
    reduced: !!(view.matchMedia && view.matchMedia("(prefers-reduced-motion: reduce)").matches) };
  const requestFrame = (next) => { counters.scheduled += 1; return view.requestAnimationFrame(next); };
  const draw = sceneRenderer({ frame, view, hooks: live, assets, counters });
  const update = () => {
    date();
    const screen = currentScreen();
    if (screen === live.screen) return;
    frame.classList.remove(`screen-${live.screen}`);
    live.screen = screen;
    frame.classList.add(`screen-${live.screen}`);
    root.dataset.screen = live.screen;
    draw(0);
  };
  new view.MutationObserver(update).observe(host, { childList: true, subtree: true });
  update();
  const stop = startSceneFrames({ reducedMotion: counters.reduced, draw, requestFrame,
    cancelFrame: (handle) => view.cancelAnimationFrame(handle) });
  view.addEventListener("resize", () => draw(0));
  return Object.freeze({
    snapshot: () => ({ hooks: { ...live }, assets: required.length, ready: counters.draws > 0,
      draws: counters.draws, scheduled: counters.reduced ? 0 : counters.scheduled }),
    stop,
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.__earnedScene = installScene(window, document);
}
