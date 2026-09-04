# AGENTS.md — for any coding agent working in this repository (Codex, Claude Code, others)

1. Read `NEXT.md`, then `rebuild/ROADMAP.md`. Tasks arrive as FILES in the repo (a brief under `rebuild/<tranche>/BRIEF.md`),
   never as chat prose. The owner's only chat input is one word; the brief carries the whole instruction.
2. The frozen app (`src/`, `index.html`, `ledger/`, `scripts/`, `tools/`, `app.js`) is FROZEN as the owner's personal
   instrument: do not modify it unless a brief says so explicitly. `ledger/` is the owner's health data.
3. The public rebuild lives under `rebuild/`. Its gate is the conformance suite: `cd rebuild/conform && MEASURED_TEST_NOW=2026-09-03
   TZ=America/New_York node run.cjs` must end with `SUITE CONSISTENT`, and `node run.cjs --selftest` with `SELFTEST PASS`.
   The suite itself (laws, reference models, oracle, runner) is frozen for a tranche: build the product to the laws;
   never edit a law to make it pass — write the objection in your report.
4. Before the gate: `node engines/build-engines.mjs <repo root>` (old-engine artifacts, gitignored) and regenerate the
   private fixture locally (`git show a0009c3:ledger/state.json > rebuild/conform/private/live.json`, then the golden
   step in the brief). Never commit `rebuild/conform/private/` or `rebuild/conform/engines/*.cjs`; never paste their
   contents anywhere; verdict lines only in reports.
5. Never print, log or commit a token or secret. Never delete data. No `package-lock.json` churn. Commit on the branch
   the brief names; open a PR; do not merge.
6. Report format: `rebuild/t2/REPORT.txt` is the template — factual, short, every claim executed.
