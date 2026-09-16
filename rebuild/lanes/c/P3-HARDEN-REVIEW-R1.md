# P3-HARDEN - independent review, round 1

VERDICT: ACCEPT

Lane C, Opus, round 1. Subject `1f7198c2` over tip `c76fb7f5`, detached review
worktree, Node 24.19.0, junctions only, no npm. Every bundle below was INVENTED
by the reviewer from the PUBLIC fixture `preimage-2026-08-15.json`; no private
path, ledger, soak path or real bundle was read or referenced, and all `--out`
targets were under `%TEMP%\p3h-out\`.

## Re-proved independently

- Diff confined to custody (`port.cjs`, `port/README.md`, the new test,
  `P3-RUNBOOK.md`, the author report); nothing pinned touched; LF only; worktree
  clean, one commit ahead, not pushed, author and Co-Authored-By as specified.
- `shapeIssues()` matrix, 60+ reviewer cells: every guarded class deleted,
  nulled and wrong-typed; every class present-but-empty; 16 invalid and 6 valid
  calendar strings (2024-02-29, 2000-02-29 accepted; 2023-02-29, 1900-02-29,
  2026-02-29, 2026-04-31, 2026-11-00, 2026-1-5, 20260105 refused). All correct.
- Through the CLI: missing-class + impossible-date, a wrong-typed class, a nulled
  class and a bad date nested in a `corrLog` chain each exit 2 with an EMPTY
  `--out`; `exercises: []` still seals (exit 0), so the decrease rule still
  governs and the emptied-queue/exercises counts cells stay green.
- Synced guard refuses OneDrive, Dropbox, "Google Drive", iCloudDrive, Box and
  lower-case `onedrive`; allows `OneDriveBackup2` and a clean sibling. Bypasses
  all refused: junction from a clean name into OneDrive (and a nonexistent leaf
  below it), 8.3 short name, forward slashes, `..` detour, `\\?\` and
  `\\localhost\C$`. Each env var catches an innocently-named sync root.
- The three pre-existing refusal strings are BYTE-IDENTICAL to `c76fb7f5`
  (75, 91, 100 bytes) by `Buffer.compare` against `git show` of the tip.
- Happy path unchanged: one source through the tip's `port.cjs` and through HEAD
  gives IDENTICAL stdout (hashes and bundle name normalised), exit 0 both, ORACLE
  7/7 x2 PUBLIC, same two files; SHAPE prints only on failure, so step numbering
  is untouched. Mutant (i) reproduced: the absent-class push replaced by `void 0`
  gives 33 pass / 9 fail; reverted, 42/42, tree clean. No U+2013/U+2014 added.

## Findings

1. MAJOR - non-string dates escape the guard in 2 of the 5 named areas.
   `reads[].d` is validated unconditionally (a number, `null` or an absent `d`
   refuses), but nights and corrections are guarded by
   `typeof entry.d === 'string' &&`. So `sleep.nights[0].d = 20260230` and
   `corrLog[1].d = 20260230` both return `(clean)` and seal, while the same
   defect spelled as a string refuses. `validDay` already rejects a non-string,
   so the pre-guard is what defeats it; ticket (1)(b) asks that sleep nights and
   corrections meet the admission rule too. Measured safe to tighten: every night
   in both public fixtures carries a string `d` (59/59, 35/35) and no fixture
   `corrLog` entry exists, so `Object.hasOwn(entry, 'd') && !validDay(entry.d)`
   refuses nothing legitimate. Fix-forward: nothing that refused before passes.
2. MINOR - the `waist` deviation is real but forced, and correctly disclosed.
   Verified rather than taken on trust: `createCleanInitState()` from the pinned
   journey SETUP carries every other guarded class but not `waist`, and the
   pinned `local-source-consumer.test.mjs` seals exactly that state through the
   real `port.cjs`, so requiring `waist` would turn pinned cell P2-W1 red. Both
   public fixtures carry it, so a follow-up could require it when the source
   declares a legacy `v`. The README states the exception plainly.
3. MINOR - a nulled class is reported "got object" (`typeof null`), and for
   object-shaped `sleep.nights` the "position" is the KEY, not an index, unlike
   every other class. Correct refusals, cosmetic wording.
4. NOTE - a trailing dot or space escapes the SEGMENT rule (`...\OneDrive.` is
   ALLOWED), but is NOT exploitable: Node writes through `\\?\`, so that spelling
   creates a distinct directory beside the real one rather than resolving into
   it, and `%OneDrive%` containment refuses it anyway when set. The `rebuild`
   check behaves identically, so this is a shared pre-existing residual.
5. NOTE - no CI home, and the disclosure is accurate: `port.cjs` needs
   `conform/oracle/census.cjs` plus the gate over `rebuild/engine/**` and the
   pinned fixtures, which the single-commit sparse checkout cannot hermetically
   carry. The ticket said not to force it; nothing was changed there.

## Suite tails (this worktree, verbatim)

- port `test/*.test.cjs`: `tests 42 / suites 0 / pass 42 / fail 0 / cancelled 0`
- `local-source-consumer.test.mjs`: `tests 6 / pass 6 / fail 0` (P2-W1..W6 green)
- `rig187 => PASS - SUITE GAP: both subjects are 35 GREEN under run.cjs`
- `B PACKAGE S4 PUBLIC CI EVIDENCE PASS`, EXIT 0
- today 13 by name, clock/tz pinned: `tests 645 / pass 645 / fail 0 / cancelled 0`

ACCEPT. Nothing regresses, no law, guard or test is weakened, and every BAR cell
is an executed named cell the mutant proves load bearing. Finding 1 is a one-line
tightening, measured safe, that should land before the real day with finding 3.
