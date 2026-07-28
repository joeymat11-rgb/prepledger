// ERROR BEACON
//
// The problem this solves: every test in this repo runs in jsdom. Her phone
// runs iOS Safari. If the app throws there, nobody ever finds out — she just
// quietly stops opening it, and the next session sees a green suite and a
// silent user. This is the only channel through which an iOS-only failure
// can ever reach a future session.
//
// How it files: the same way the app files everything else — the GitHub
// contents API, with the token already in localStorage, into ledger/errors.json.
// No new service, no new secret, no new endpoint to keep alive. /ledger/* is
// already 404'd and no-store on the public site, so the file inherits the
// existing lockdown.
//
// THE RULE THIS MODULE LIVES BY: it must never be able to break the app.
// Every entry point is wrapped. Every failure is swallowed. If localStorage is
// unavailable, if the token is missing, if GitHub is down, if the JSON is
// corrupt — the app carries on exactly as if this file did not exist. It
// records to localStorage first and uploads later, so a crash that happens
// before the network is ready still surfaces on the next launch.

/* global __APP_V__ */
const VERSION = typeof __APP_V__ === "string" ? __APP_V__ : "unknown";

const BUFFER_KEY = "prep-ledger-errlog";
const LASTPUSH_KEY = "prep-ledger-errpush";
const TOKEN_KEY = "prep-ledger-ghtoken";
const REPO = "joeymat11-rgb/prepledger";
const FILE = "ledger/errors.json";

const MAX_BUFFERED = 20;          // per device, before the oldest is dropped
const MAX_IN_FILE = 100;          // total kept in the repo
const DEDUPE_MS = 6 * 60 * 60 * 1000;   // same fault twice in 6h counts once
const MIN_PUSH_GAP_MS = 30 * 60 * 1000; // at most one commit per half hour
const FLUSH_DELAY_MS = 5000;      // never compete with first paint

// -- helpers that cannot throw ---------------------------------------------
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};

/** Never let a credential reach the repo, even inside an error message. */
function redact(text) {
  let s = String(text == null ? "" : text);
  try {
    const tok = ls.get(TOKEN_KEY);
    if (tok && tok.length > 8) s = s.split(tok).join("<redacted>");
  } catch (e) {}
  return s
    .replace(/(github_pat_|gh[pousr]_)[A-Za-z0-9_]{10,}/g, "<redacted>")
    .replace(/(sk-ant-)[A-Za-z0-9_-]{10,}/g, "<redacted>");
}

const clip = (s, n) => redact(s).slice(0, n);

function readBuffer() {
  try {
    const raw = ls.get(BUFFER_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function writeBuffer(arr) {
  try { ls.set(BUFFER_KEY, JSON.stringify(arr.slice(-MAX_BUFFERED))); } catch (e) {}
}

// -- recording --------------------------------------------------------------
/**
 * Record one fault. Deliberately carries no app state: message, stack, browser,
 * version. Nothing about her weight, her training, or anything else in the
 * ledger ever enters this payload.
 */
export function report(err, kind, extra) {
  try {
    const msg = clip((err && (err.message || err.reason || err)) || "unknown", 300);
    const stack = clip((err && err.stack) || extra || "", 800);
    const print = kind + "|" + msg + "|" + stack.split("\n")[0];
    const now = Date.now();

    const buf = readBuffer();
    const seen = buf.find((e) => e.print === print && now - (e.last || 0) < DEDUPE_MS);
    if (seen) {
      seen.n = (seen.n || 1) + 1;
      seen.last = now;
    } else {
      buf.push({
        print,
        at: new Date(now).toISOString(),
        last: now,
        n: 1,
        v: VERSION,
        kind: String(kind || "error"),
        msg,
        stack,
        ua: clip((typeof navigator !== "undefined" && navigator.userAgent) || "", 200),
        page: clip((typeof location !== "undefined" && location.pathname) || "", 80),
      });
    }
    writeBuffer(buf);
  } catch (e) { /* a broken beacon must never become a broken app */ }
}

// -- uploading --------------------------------------------------------------
async function flush() {
  try {
    const buf = readBuffer();
    if (!buf.length) return;

    const last = Number(ls.get(LASTPUSH_KEY) || 0);
    if (Date.now() - last < MIN_PUSH_GAP_MS) return;

    const tok = ls.get(TOKEN_KEY);
    if (!tok) return; // stay buffered; a later session with a token will file it

    const url = "https://api.github.com/repos/" + REPO + "/contents/" + FILE;
    // Never send a Cache-Control *request* header to the GitHub API — the CORS
    // preflight it triggers kills the fetch silently. Cache-bust in the query.
    const auth = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json" };

    let sha = null;
    let existing = [];
    try {
      const g = await fetch(url + "?t=" + Date.now(), { cache: "no-store", headers: auth });
      if (g.ok) {
        const j = await g.json();
        sha = j.sha;
        try {
          const parsed = JSON.parse(decodeURIComponent(escape(atob(j.content || ""))));
          if (Array.isArray(parsed)) existing = parsed;
          else if (parsed && Array.isArray(parsed.errors)) existing = parsed.errors;
        } catch (e) { existing = []; }
      }
    } catch (e) { /* first write, or offline */ }

    const merged = existing
      .concat(buf.map(({ print, last: _l, ...keep }) => keep))
      .slice(-MAX_IN_FILE);

    const body = {
      message: "[skip ci] error beacon: " + buf.length + " fault(s) from " + VERSION,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(merged, null, 1)))),
    };
    if (sha) body.sha = sha;

    const put = await fetch(url, {
      method: "PUT",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (put.ok) {
      ls.del(BUFFER_KEY);
      ls.set(LASTPUSH_KEY, String(Date.now()));
    }
    // On failure: leave the buffer alone and try again next launch.
  } catch (e) { /* swallowed on purpose */ }
}

// -- installation -----------------------------------------------------------
let installed = false;

export function installBeacon() {
  try {
    if (installed || typeof window === "undefined") return;
    installed = true;

    window.addEventListener("error", (e) => {
      report(e && (e.error || e), "window.onerror",
             e && e.filename ? e.filename + ":" + e.lineno : "");
    });

    window.addEventListener("unhandledrejection", (e) => {
      report(e && (e.reason || e), "unhandledrejection", "");
    });

    // Deferred so it can never sit in front of first paint, and so a boot-time
    // crash has already been buffered by the time we upload.
    setTimeout(() => { flush(); }, FLUSH_DELAY_MS);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
  } catch (e) { /* see the rule at the top of this file */ }
}

export const __beacon = { report, flush, readBuffer, redact, VERSION };
