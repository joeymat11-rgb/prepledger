"use strict";

/* plain-copy.cjs — the one place an em dash or an en dash can be taken out of something
   the athlete is about to read.

   THE RULE. DECISIONS:114 (1), the owner verbatim: "no ai dashes are allowed in the ui".
   No U+2014 and no U+2013 in any text a person can see on these screens. Code comments,
   test names and console output are not the athlete's text and keep whatever they have.

   WHY A FUNCTION AND NOT A SWEEP. Most of the words on Today are not this page's. The
   instruction title, the sentence under it, the reading note beside a weigh-in and the
   capture layer's refusals are all written by rebuild/engine and rebuild/client, which
   are frozen for this brief (P1-NO-DASHES-BRIEF.md, "How to rewrite"). So the page takes
   the dash out at the boundary where the text stops being data and becomes a pixel:
   every string these screens write into the DOM goes through plainCopy() first.

   THREE SHAPES, AND NOTHING ELSE:
     aside or label suffix   "spike — damped in trend"   -> "spike: damped in trend"
     range between numbers   "60–400 lb"                 -> "60 to 400 lb"
     leading/trailing dash   "— recorded today"          -> "recorded today"
   A dash in any other shape is REFUSED with AI_DASH_IN_UI instead of guessed at: a
   silent rewrite that changed the engine's meaning would be worse than a loud failure,
   and this brief's whole point is that the athlete never sees the character.

   A minus sign (U+2212) and a hyphen-minus are NOT dashes. They are never touched. */

/* The two characters, written out: U+2013 EN DASH and U+2014 EM DASH. */
const AI_DASH = /[–—]/;
const AI_DASH_ALL = /[–—]/g;

/* The named refusal the render boundary throws. `code` is what callers and tests match
   on; the message names the text so a failure is diagnosable without a debugger. */
class AiDashRefused extends Error {
  constructor(message, where) {
    super(message);
    this.name = "AiDashRefused";
    this.code = "AI_DASH_IN_UI";
    this.where = where || null;
  }
}

const hasAiDash = (value) => typeof value === "string" && AI_DASH.test(value);

/* THE NORMALISER. Null and undefined pass through untouched so a caller can keep using
   them to mean "no value"; everything else is read as text. */
function plainCopy(value, where) {
  if (value === null || value === undefined) return value;
  let text = String(value);
  if (!AI_DASH.test(text)) return text;

  // A dash with nothing before it, or nothing after it, is decoration. Drop it.
  text = text.replace(/^[\s ]*[–—][\s ]*/, "");
  text = text.replace(/[\s ]*[–—][\s ]*$/, "");
  // A dash between two figures is a range, and a range is the word "to".
  text = text.replace(/(\d)[\s ]*[–—][\s ]*(?=\d)/g, "$1 to ");
  // Every other dash with white space after it opens an aside or follows a label, and a
  // colon says the same thing. The white space in front of it goes with it.
  text = text.replace(/[\s ]*[–—][\s ]+/g, ": ");

  if (AI_DASH.test(text)) {
    throw new AiDashRefused(
      `AI_DASH_IN_UI: a dash this page cannot rewrite reached the screen${where ? " at " + where : ""}: `
      + JSON.stringify(String(value).slice(0, 200)), where);
  }
  return text;
}

module.exports = { plainCopy, hasAiDash, AiDashRefused, AI_DASH, AI_DASH_ALL };

/* ---------------------------------------------------------------------------
   THE BUILD-TIME REFUSAL (P1 amendment, DECISIONS:117 (1)).
   ---------------------------------------------------------------------------
   build.mjs will not write an asset that carries the character. "Carries" has to be
   defined against what actually ships, because two things inside the built bytes are
   not the athlete's text:

     * COMMENTS. The brief exempts them by name and tells the builder not to churn
       them. The page bundle is not minified, so every comment of every bundled module
       ships verbatim; refusing on those would refuse on rebuild/engine's comments.
     * THE FROZEN SOURCES' OWN PROSE. rebuild/engine and rebuild/client are bundled
       into app.js and their strings carry dashes. This brief does not edit them
       (P1-NO-DASHES-BRIEF.md, "How to rewrite"); they reach the DOM only through
       plainCopy() above. They are COUNTED here, so the number is on the build line,
       never waved through in silence.

   So the scan is: every byte of the built HTML and CSS outside a comment, plus every
   string literal of the built JS that came from a module this page owns. esbuild writes
   a `// <path>` banner in front of each bundled module and that banner is what says who
   owns a literal, so the guard refuses to run at all when it cannot see them. */

const OWNED = "rebuild/m3/w7-preview/today/";
const BANNER = /^ (\S+\.(?:cjs|mjs|js))$/;

class AiDashInBuild extends Error {
  constructor(message, code, offences) {
    super(message);
    this.name = "AiDashInBuild";
    this.code = code || "AI_DASH_IN_BUILD";
    this.offences = offences || [];
  }
}

/* `—` in the built bytes is seven ASCII characters, not a dash — esbuild escapes
   every non-ASCII character it puts inside a string literal. A scan that did not decode
   them would report a clean bundle and be wrong about every word the engine wrote. */
function decodeEscapes(raw) {
  return raw
    .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, hex) => {
      const point = parseInt(hex, 16);
      return point <= 0x10ffff ? String.fromCodePoint(point) : _;
    })
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const canStartRegExp = (previous) => previous === "" || !/[\w$)\]'"`]/.test(previous);

/* One pass over the bundle: comments are recognised (and read for module banners),
   string and template literals are collected with the module that wrote them, regular
   expression literals are stepped over so a `"` inside a character class cannot open a
   phantom string, and anything left is bare code. */
function scanJavaScript(source) {
  const literals = [];
  const bare = [];
  let module = null;
  let banners = 0;
  let owned = 0;
  let previous = "";
  let i = 0;
  const n = source.length;
  while (i < n) {
    const c = source[i];
    if (c === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      const hit = BANNER.exec(source.slice(i + 2, stop).replace(/\r$/, ""));
      if (hit) { module = hit[1]; banners += 1; if (module.startsWith(OWNED)) owned += 1; }
      i = stop;
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      let j = i + 1;
      let raw = "";
      while (j < n) {
        if (source[j] === "\\") { raw += source[j] + (source[j + 1] || ""); j += 2; continue; }
        if (source[j] === quote) break;
        if (quote !== "`" && source[j] === "\n") break;
        raw += source[j];
        j += 1;
      }
      literals.push({ raw, module });
      previous = quote;
      i = j + 1;
      continue;
    }
    if (c === "/" && canStartRegExp(previous)) {
      let j = i + 1;
      let inClass = false;
      while (j < n) {
        const d = source[j];
        if (d === "\\") { j += 2; continue; }
        if (d === "\n") break;
        if (d === "[") inClass = true;
        else if (d === "]") inClass = false;
        else if (d === "/" && !inClass) break;
        j += 1;
      }
      previous = "/";
      i = j + 1;
      continue;
    }
    if (!/\s/.test(c)) {
      if (AI_DASH.test(c)) bare.push({ index: i, module });
      previous = c;
    }
    i += 1;
  }
  return { literals, bare, banners, owned };
}

const excerpt = (text, index) =>
  text.slice(Math.max(0, index - 60), Math.min(text.length, index + 60)).replace(/\s+/g, " ").trim();

function collectPlainText(offences, asset, text, what) {
  let hit;
  const finder = new RegExp(AI_DASH_ALL.source, "g");
  while ((hit = finder.exec(text)) !== null) {
    offences.push({ asset, what, excerpt: excerpt(text, hit.index) });
  }
}

/* `assets` is [name, bytes] pairs, exactly as build.mjs already holds them. */
function scanBuiltAssets(assets) {
  const offences = [];
  let admitted = 0;
  let scannedLiterals = 0;
  for (const [name, bytes] of assets) {
    const text = typeof bytes === "string" ? bytes : bytes.toString("utf8");
    if (/\.html?$/.test(name)) {
      collectPlainText(offences, name, text.replace(/<!--[\s\S]*?-->/g, " "), "markup outside a comment");
      continue;
    }
    if (/\.css$/.test(name)) {
      collectPlainText(offences, name, text.replace(/\/\*[\s\S]*?\*\//g, " "), "stylesheet outside a comment");
      continue;
    }
    if (/\.(m|c)?js$/.test(name)) {
      const scan = scanJavaScript(text);
      if (scan.owned === 0) {
        throw new AiDashInBuild(
          `AI_DASH_GUARD_BLIND: ${name} carries no module banner for ${OWNED}, so a literal cannot be `
          + "attributed to the page's own sources and the guard would pass on anything",
          "AI_DASH_GUARD_BLIND", []);
      }
      for (const literal of scan.literals) {
        const value = decodeEscapes(literal.raw);
        if (!AI_DASH.test(value)) continue;
        scannedLiterals += 1;
        if (literal.module && literal.module.startsWith(OWNED)) {
          offences.push({ asset: name, what: `a string literal of ${literal.module}`,
            excerpt: value.length > 120 ? value.slice(0, 120) + "..." : value });
        } else {
          // Frozen prose. plainCopy() is the only way it reaches the DOM.
          admitted += 1;
        }
      }
      for (const stray of scan.bare) {
        offences.push({ asset: name, what: `bare code of ${stray.module || "the bundle"}`,
          excerpt: excerpt(text, stray.index) });
      }
      continue;
    }
    throw new AiDashInBuild(`AI_DASH_GUARD_BLIND: ${name} is not an asset kind this guard can read`,
      "AI_DASH_GUARD_BLIND", []);
  }
  return { offences, admitted, scannedLiterals };
}

function assertNoAiDashesInAssets(assets) {
  const report = scanBuiltAssets(assets);
  if (report.offences.length > 0) {
    const first = report.offences.slice(0, 4)
      .map((o) => `${o.asset}: ${o.what}: "${o.excerpt}"`).join(" | ");
    throw new AiDashInBuild(
      `AI_DASH_IN_BUILD: ${report.offences.length} em/en dash(es) in text the athlete can see (DECISIONS:114): ${first}`,
      "AI_DASH_IN_BUILD", report.offences);
  }
  return report;
}

module.exports.OWNED = OWNED;
module.exports.AiDashInBuild = AiDashInBuild;
module.exports.decodeEscapes = decodeEscapes;
module.exports.scanJavaScript = scanJavaScript;
module.exports.scanBuiltAssets = scanBuiltAssets;
module.exports.assertNoAiDashesInAssets = assertNoAiDashesInAssets;
