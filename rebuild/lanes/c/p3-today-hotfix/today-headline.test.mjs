/* P3-TODAY-HOTFIX, S1. DECISIONS:534 (a); P3-TODAY-COPY-DIAG section S1.

   THE DEFECT. rebuild/engine/today.cjs:568-582 makes nowModel().move the FIRST
   UNRESOLVED PROPOSAL'S CARD TITLE whenever the state carries one, on purpose: the
   frozen app had a decisions surface behind that headline. The rebuild's Today has no
   proposal card (state inventory T-40), and today-app.cjs:863 binds move.title into the
   slot the approved design labels "Your plan for today". So after the real import, which
   is the only path by which state.proposals is ever non-empty, a per-muscle volume
   proposal read as the day's session on the owner's own phone.

   WHY THIS FILE AND NOT adapter.test.mjs. today-model.cjs's own suite is
   rebuild/m3/w7-preview/today/test/adapter.test.mjs, and the S8 seal artifact
   (rebuild/m4/spec/acceptance-s8-real-shape.json) pins it, together with all thirteen
   files in that directory AND .github/workflows/rebuild.yml. A fourteenth file there
   also turns rebuild/m4/workout/test/h3-clean-init.test.cjs H3/13 red, because that cell
   requires the CI step's named set to equal the directory exactly. So there is no cell
   for this defect inside the seal, and no pinned byte moves to add one here. Nothing in
   the S8 artifact names this path or the workflow that runs it.

   THE FIX UNDER TEST is in rebuild/m3/w7-preview/today/today-model.cjs: Today's
   projection serves the headline from nowModel over the same state with its proposals
   set aside, so every word is still the engine's own. Nothing else is taken from that
   projection: the status face, the count, the workout and every figure stay the real
   state's. */

import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createTodayModel, createBasisState, SYNTHETIC_DAY } =
  require("../../../m3/w7-preview/today/today-model.cjs");

/* The owner's own string, built rather than written: DECISIONS:114 forbids U+2014 in a
   source file, and this is the exact title rebuild/engine/writers.cjs:1899 composes. */
const EM = String.fromCharCode(0x2014);
const ARROW = String.fromCharCode(0x2192);
const OWNER_TITLE = "Side delt " + EM + " EARNED VOLUME: 10 " + ARROW + " 12 WEEKLY SETS";

function stateWithOneProposal(day) {
  const state = createBasisState(day);
  state.proposals = [{
    id: "volpush_sidedelt_2026-08-31", rid: "volpush_sidedelt_2026-08-31",
    d: day, title: OWNER_TITLE, resolved: false,
    why: "Side delt has earned more weekly volume. Nothing else moves this week.",
  }];
  state.agentProposals = [];
  return state;
}

const headlineOf = (state, day) =>
  createTodayModel({ today: day, basisState: state }).read().nowModel.move.title;

test("S1 - an unresolved proposal is not the headline over 'Your plan for today'", () => {
  const day = SYNTHETIC_DAY;
  const state = stateWithOneProposal(day);
  const headline = headlineOf(state, day);

  /* The engine really does put the card title there, so the defect is reachable and this
     cell is not asserting into thin air. */
  const model = createTodayModel({ today: day, basisState: state });
  assert.equal(model.engine.nowModel(state).move.title, OWNER_TITLE,
    "the engine no longer chooses the proposal title, so this cell guards nothing");

  assert.notEqual(headline, OWNER_TITLE, "the proposal card title is still the headline");
  assert.equal(headline.includes("EARNED VOLUME"), false,
    "a capitalised engine phrase is still in the headline: " + headline);
  assert.equal(headline.includes(ARROW), false, "the headline still carries the proposal's arrow");
  assert.equal(headline.includes("Side delt"), false,
    "the headline still names a muscle that is not in today's session");

  /* It is the ENGINE's own next-best move over the same state, word for word, and not a
     sentence this adapter invented. */
  const bare = JSON.parse(JSON.stringify(state));
  bare.proposals = [];
  bare.agentProposals = [];
  assert.equal(headline, model.engine.nowModel(bare).move.title,
    "the headline is not the engine's own next-best move");
  assert(headline.length > 0, "the headline is empty");
});

test("S1 - the count of what is genuinely waiting is not hidden by the headline fix", () => {
  const day = SYNTHETIC_DAY;
  const view = createTodayModel({ today: day, basisState: stateWithOneProposal(day) }).read();
  assert.equal(view.nowModel.decisionsN, 1,
    "one proposal is open and the projection no longer says so");
});

test("S1 - the fixture render is byte-identical: with no proposal nothing is recomputed", () => {
  const day = SYNTHETIC_DAY;
  const fixture = createBasisState(day);
  assert.deepEqual(fixture.proposals || [], [], "the fixture basis carries a proposal");
  const model = createTodayModel({ today: day });
  const view = model.read();
  const reference = model.engine.nowModel(model.stateFromOps());
  assert.deepEqual(view.nowModel, JSON.parse(JSON.stringify(reference)),
    "the fixture's nowModel is no longer exactly the engine's own");
  assert.equal(headlineOf(fixture, day), reference.move.title);
});
