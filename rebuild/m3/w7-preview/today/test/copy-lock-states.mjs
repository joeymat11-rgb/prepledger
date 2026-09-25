/* THE COPY LOCK, RUNTIME HALF: named states of the COMPOSED product, mounted.
 *
 * The released gym card (gym-app.mjs) is mounted into the real shell and the real
 * approved template (design.shellHtml + design.templateHtml), with the real durable
 * machine-settings host over fake-indexeddb, and driven into named states. Every text
 * node and every placeholder / aria-label / title / alt the document then carries is
 * harvested, so the lock judges what the composed page says, not a source fragment.
 *
 * GYM-SETTINGS-N2 is the state c6fb3017 N2 names (DECISIONS:780 Q5): a Save revised
 * while it was held is recorded, and the card keeps the earlier refusal's message. It is
 * driven exactly as gss-annex-timing.test.mjs D-GSS-G1 drives it, and the durable write
 * is proven here too, so "recorded" is measured, not assumed. The lock pins that message
 * as it is; changing it changes what the athlete reads and is not this file's to do.
 *
 * Public synthetic fixtures only. No engine module is loaded: the model is the synthetic
 * active view below. */
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import GymApp, { mountGym } from '../gym-app.mjs';
import { createMachineSettingsHost } from '../machine-settings-host.mjs';
import design from '../design.cjs';

const { IDBFactory } = createRequire(new URL('../../../w6/package.json', import.meta.url))('fake-indexeddb');

const DAY = '2026-09-03';
const LIFT = 'copy-lock-lift';
const EFFORT = Object.freeze({ label: '2', reserve: Object.freeze({ tag: 'known', value: 2 }) });
// The athlete's own data in these states. Anything else the page shows must be locked copy.
export const FIXTURE_VALUES = Object.freeze(['Synthetic workout', 'Synthetic lift', 'Synthetic reason',
  'Synthetic plan', 'Synthetic effort', 'Seat', 'four', 'six']);
export const STATE_IDS = Object.freeze(['GYM-ACTIVE-SET', 'GYM-SETTINGS-EDITOR-OPEN', 'GYM-SETTINGS-REFUSED-EMPTY',
  'GYM-SETTINGS-N2', 'GYM-SETTINGS-SAVED']);

const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
const copy = (value) => structuredClone(value);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async (rounds = 8) => { for (let i = 0; i < rounds; i += 1) await tick(); };
async function until(check, label) {
  for (let i = 0; i < 400; i += 1) { if (check()) return; await new Promise((r) => setTimeout(r, 1)); }
  throw new Error('COPY-LOCK-STATE-TIMEOUT: ' + label);
}
async function within(value, label, ms = 5000) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('COPY-LOCK-STATE-BOUNDED-WAIT: ' + label)), ms); });
  try { return await Promise.race([Promise.resolve(value), timeout]); } finally { clearTimeout(timer); }
}

function activeView() {
  return { phase: 'active', startId: 'copy-lock-start', title: 'Synthetic workout',
    session: { instruction: { display: 'Synthetic workout' } },
    lift: { id: LIFT, label: 'Synthetic lift', index: 1, count: 1 },
    set: { slot: 0, lift: LIFT, position: 1 },
    prescription: { reason: ['Synthetic reason'], setup: null, line: 'Synthetic plan', effort: 'Synthetic effort' },
    strip: [], entry: { load: null, reps: null, step: 2.5 }, previous: '', upNext: null, message: null };
}

/* Every string the document carries: text nodes (whitespace-collapsed), the four
   attributes a screen reader or a hover reads, and the current value of every input or
   textarea that shows its value as text (REVIEW-S10-COPYLOCK-l1 F3: the property, so what
   the athlete typed is read too; the same types copy-lock.cjs skips are skipped). Hidden
   nodes are included on purpose: a hidden sentence is one state away from shown.
   <template> contents are not in the tree. CSS-generated text (content:) is not in the DOM
   and is held by the static side only. */
const VALUE_NOT_SHOWN = new Set(['hidden', 'checkbox', 'radio', 'file', 'image', 'range', 'color', 'password']);
export function harvest(doc) {
  const out = [];
  const add = (s) => { const t = String(s).replace(/\s+/g, ' ').trim(); if (t) out.push(t); };
  if (doc.title) add(doc.title);
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) { add(child.textContent); continue; }
      if (child.nodeType !== 1) continue;
      if (/^(SCRIPT|STYLE|TEMPLATE)$/.test(child.tagName)) continue;
      for (const a of ['placeholder', 'aria-label', 'title', 'alt']) { const v = child.getAttribute(a); if (v) add(v); }
      if (child.tagName === 'TEXTAREA' || (child.tagName === 'INPUT' && !VALUE_NOT_SHOWN.has(child.type))) add(child.value);
      walk(child);
    }
  };
  walk(doc.body);
  return [...new Set(out)];
}

async function collections(repository) {
  const held = (await repository.load()).generation.collections;
  return copy({ ops: held.ops || {}, outbox: held.outbox || {} });
}

function holdable(host) {
  let hold = null;
  return {
    arm() { let reached, release; const r = new Promise((d) => { reached = d; }); const g = new Promise((d) => { release = d; });
      hold = { reached, release, r, g }; return hold; },
    settings: {
      latest: (...args) => host.latest(...args),
      save: async (machine) => {
        const h = hold; const result = await host.save(machine);
        if (h) { h.reached(); await h.g; }
        return result;
      },
    },
  };
}

/* Drives the five named states in one mounted page and returns, per state, the harvested
   strings and the settings-error slot. Also returns the durable op count added by the N2
   Save, which must be exactly one. */
export async function driveGymStates() {
  const indexedDB = new IDBFactory();
  const host = await createMachineSettingsHost({ day: DAY, indexedDB, crypto: webcrypto, databaseName: 'copy-lock-gym' });
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1/' });
  const doc = dom.window.document, phone = doc.getElementById('phone');
  const h = holdable(host);
  const view = activeView();
  const model = { day: DAY, read: async () => copy(view), effortChoices: () => [EFFORT], start: async () => ({ ok: true }) };
  const states = {};
  const pick = (s) => phone.querySelector(s);
  const snap = (id) => { states[id] = { texts: harvest(doc), error: pick('[data-slot="settings-error"]')?.textContent || '' }; };
  const click = (s) => { const c = pick(s); if (!c) throw new Error('COPY-LOCK-STATE-MISSING-CONTROL ' + s); c.click(); };
  const input = (s, v) => { const c = pick(s); if (!c) throw new Error('COPY-LOCK-STATE-MISSING-INPUT ' + s); c.value = v; c.dispatchEvent(new dom.window.Event('input', { bubbles: true })); };
  let mounted;
  try {
    mounted = mountGym(doc, phone, { model, settings: h.settings, onBack: () => {} });
    await mounted;
    if (mounted.settings.read()) await mounted.settings.read();
    await settle();
    snap('GYM-ACTIVE-SET');
    click('[data-action="settings-open"]');
    await until(() => pick('[data-slot="settings-editor"]')?.hidden === false && pick('[data-settings-value="0"]'), 'editor open');
    snap('GYM-SETTINGS-EDITOR-OPEN');
    click('[data-slot="settings-save"]');
    await within(mounted.settings.pending(), 'empty Save delivery');
    await settle();
    snap('GYM-SETTINGS-REFUSED-EMPTY');
    const before = await collections(host.repository);
    input('[data-settings-name="0"]', 'Seat');
    input('[data-settings-value="0"]', 'four');
    await settle();
    const held = h.arm();
    click('[data-slot="settings-save"]');
    const pending = mounted.settings.pending();
    await within(held.r, 'held Save acknowledgement');
    input('[data-settings-value="0"]', 'six');
    await until(() => pick('[data-settings-value="0"]')?.value === 'six', 'revised answer');
    held.release();
    await within(pending, 'held Save delivery');
    await settle();
    snap('GYM-SETTINGS-N2');
    const after = await collections(host.repository);
    const opsAdded = Object.keys(after.ops).filter((id) => !Object.hasOwn(before.ops, id)).length;
    const latest = await host.latest(LIFT);
    // leave N2: save the revision plainly, so the editor closes on a recorded save
    click('[data-slot="settings-save"]');
    await within(mounted.settings.pending(), 'plain Save delivery');
    await settle();
    snap('GYM-SETTINGS-SAVED');
    return { states, opsAdded, n2Latest: latest && latest.machine ? copy(latest.machine) : null };
  } finally {
    const p = mounted?.settings?.pending?.();
    if (p) await within(p, 'cleanup', 2000).catch(() => {});
    dom.window.close();
    host.close();
  }
}

export { GymApp };
