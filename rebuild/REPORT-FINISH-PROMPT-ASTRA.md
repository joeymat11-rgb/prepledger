# FINISH-PROMPT publication — ASTRA builder report

Date: 2026-09-06. Branch: `rebuild/finish-prompt-v1`. Base: `df09f438a93cb9548ef3f66b28b39deecc7fb347`. Documentation only; repository publication and status corrections await independent cowork review. This report records the pre-publication checks; no merge or independent acceptance is claimed.

## 1. What and why

Publish the owner's activated comprehensive execution prompt so progress can survive a chat interruption. The operational body from `EARNED-COMPREHENSIVE-PROMPT.txt` is unchanged. Added publication metadata and the owner's requirement for frequent active updates containing **estimated time remaining**, scoped to the current step and honest about uncertainty. The root coordinator reported activation of one native same-task heartbeat, `earned-development-follow-up`, every 30 minutes after its manual checkpoint; this is an operational receipt, not independent acceptance or proof that blocked work is running.

Five files: `rebuild/FINISH-PROMPT.md` (new), `rebuild/QUEUE.md`, `rebuild/DECISIONS.md` (one appended proposed record), `rebuild/ROADMAP.md`, and this report. Current roles follow DECISIONS:26; W6 instructions/refinement and W7 preview follow accepted DECISIONS:33–37. All D1–D45 remain; no gate or rule changes. Corrected the inherited roadmap phrase that conflated the accepted preview with full I1: full I1 still needs durable offline synthetic use through the real backend and two physical phones.

## 2. Executed checks

`node rebuild/m3/w0/scope-package.mjs`:

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
```

Targeted read-only document assertions:

```text
PROMPT-FIDELITY PASS — original operational body unchanged; publication metadata and owner update amendment added
QUEUE-STRUCTURE PASS — 78/120 lines; 54 unique items; accepted W6/preview statuses explicit
LEDGER-APPEND PASS — original bytes preserved modulo line endings; one proposed record appended
DOC-SECRET-SCAN PASS — changed/publication text contains no supported credential-shaped matches; not a universal secrecy proof
DOC-SCOPE PASS — exactly five Markdown files under rebuild; protected paths and both implementation worktrees untouched
DIFF-CHECK PASS — git diff --check
```

The first local scan helper incorrectly used a tracked-file assertion for the two new files and stopped; the helper was corrected to distinguish untracked files, then the complete five-file scan passed. No product failure or gate was hidden.

The document checks compare the prompt body from its first `You are ASTRA` instruction to the activated source, count queue lines/unique IDs, require the three evidenced DONE rows, compare the complete base ledger prefix, restrict changed/untracked files to the five listed paths, and scan only new/changed text for common token/private-key shapes. The scan is a narrow additional check; manual source/diff review remains necessary. No runtime test, private fixture preparation or private oracle was run for this documentation change. The full milestone gates remain required for their implementation work.

## 3. Independence and scope

No product, test law, manifest, oracle, lockfile, frozen app or seeded-soak edits. No private ledger file was opened or regenerated; public task/acceptance documents supplied the status evidence. This agent edited only its assigned isolated worktree. Builder challenge review and the root's review are same-family checks; they do not replace cowork's independent verification. No bite mutation is appropriate for unchanged product behavior. A supplementary Claude Code document-review attempt returned an expired OAuth-session error, so it produced no review verdict and is not counted as verification. The activated source prompt's SHA256 is `a0472bd27716f4d34c6fdf474f126197e8b3093fe5890afbd4989e1895a0b8df`.

## 4. Claims and seams

Coordinator task: `01a06e0c-39ea-7591-9666-eead44de251c`. It alone serializes new claims; a Markdown row is not an atomic lock. Keep the existing W5 and audit claims/branches at their original `ef83543` bases. The coordinator startup snapshot on 2026-09-06 reported audit active without a pending approval; its reported law/control results were still builder output while LIVE/gates finished. W5 reported installed tools/runtime checking with an approval flag still present. Refresh both before dispatch; this publication does not freeze those transient states or certify either result.

W6's independent storage/staging slice is READY but unclaimed and needs proven execution capacity. W5/audit retain the two reserved implementation streams. W6 wire integration needs a published immutable W5 contract; CLOCK needs v1.1, sufficient W5 time bounds and the proven knowledge-loss fence. W7 preview is DONE only as a memory preview; real W7 must use the engine writer and remove the copied morning-write branch.

## 5. What is unsure

Live task flags may change after the snapshot. The root must reconcile them through supported task tools. The prompt's repository publication, queue correction and singleton mechanism await cowork review. Actual W5 contract/acceptance, W6 implementation, remote setup, private port, physical tests and M2 closure are not established by this PR. Subtask wall-clock was not separately instrumented; no development-speed estimate is claimed.

## 6. NEXT

NEXT: this publication makes the activated coordination instructions durable and exposes the accepted W6/preview status; it unblocks no previously forbidden product action. Root reviews and opens one documentation PR, cowork independently checks it, and the integrator merges only after acceptance. Existing M2-REGISTER/W5 continue under their original claims. Next proposed Astra build is W6's independent storage/staging slice when the coordinator proves capacity; no W6 claim is made here.
