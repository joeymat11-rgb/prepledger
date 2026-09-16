# P3-HARDEN - independent review, round 3 (FINAL)

VERDICT: ACCEPT (four MAJOR follow-ups for the PM; no bypass found)

Reviewer Fable 5.1, lane C, adversarial (DECISIONS:439/454). Reviewed sha
`1f7198c26fae8a45a97f42d684ba0ef231e00e00` (one commit over c76fb7f5) in a
detached worktree, junctioned node_modules. Invented bundles only, cloned in
memory from the PUBLIC `preimage-2026-08-15` fixture; nothing private, real or
soak was read; --out only under %TEMP%. Own probes: 296 cells, 0 real fails.
Hygiene: 5 files, all in custody, no pinned path touched, LF only, commit
author + Co-Authored-By as required, not pushed; U+2013/U+2014 absent from
every new code string (five new README lines carry U+2014, that file's style).

## Executed (own cells, CLI unless noted)
- Shape: reads/dailyLogs/sessionLog/exercises/queue/feed(earned)/events/
  sleep.nights x {missing, null, wrong type, string}: exit 2, `SHAPE FAIL`,
  right code and class, --out never created (124 ok); `sleep` absent or null
  refuses as class nights.
- Dates at reads[7].d: 15 bad (02-30, 00-10, 1-5, 20260105, 2023-02-29,
  1900-02-29, 2100-02-29, 04-31, 06-00, 12-32, 13-01, T-suffix, leading
  space, slashes, 0000-00-00) refused naming `position 7` and the string only;
  2024-02-29, 2000-02-29, 04-30, 12-31, 01-01 accepted. dailyLogs key,
  sessionLog key, nights[4].d, nights-as-object["2"].d, corrLog[1].d refused
  at the right index; reads[3] without / numeric d refused.
- exercises: [] passes SHAPE (decrease rule untouched, 21 old cells green).
  waist absent tolerated: verified as forced by the PINNED local-source-
  consumer witness (no-waist clean-init state through the real port).
- Happy: exit 0, steps 1 SOURCE .. 6 WRITE unchanged (no SHAPE step), ORACLE
  PASS PUBLIC, unseal round-trip verdict PASS, dataLoss safe=true.
- Synced --out (50 cells): the five names refused naming the segment; --out ==
  the folder itself refused; OneDriveBackup2 / plain sibling not refused.
  Bypasses ALL CLOSED: junction clean->OneDrive, junction into OneDrive\inner,
  mixed case, forward slashes, `..`, `\\?\`, UNC admin share, UNC+junction,
  `subst Q:`, 8.3 GOOGLE~1 / ICLOUD~1 (OneDrive is its own 8.3 name). Each of
  %OneDrive%/%OneDriveCommercial%/%OneDriveConsumer%: unset -> not refused;
  set -> refused incl. trailing backslash, upper-case, forward slashes, --out
  == root, junction into root, lower-case env NAME; missing target: no crash.
- Three pre-existing refusal template literals, c76fb7f5 vs HEAD: identical.
- Mutant: CLASS_MISSING push commented -> harden suite 12 pass / 9 fail (cell
  (a) + 8 missing-class cells red); reverted with git checkout, tree clean.

## Findings
1. MAJOR - `--local` is not shape-checked. Clean source + a --local with
   reads[9].d=2026-13-40 and NO exercises key, confirmed: exit 0, WRITE PASS;
   the unsealed migrated.state carries one read d=2026-13-40 and the local's
   exercises 0 is invisible to the decrease rule (17 -> 17). Gap-1 class via
   the phone-export door; --local is not a RUNBOOK step, so not blocking.
2. MAJOR - the "corrections" date check is vacuous: it reads `entry.d`, but
   _fileCorr (engine/migrate.cjs:2501) writes {op:"kind:YYYY-MM-DD:id", kind,
   id?, at:ISO, to?} with no `d`; a corrLog op day 2026-02-30 seals PASS
   (verified). README claims corrections coverage: validate the op day (and
   that `at` parses) or drop the word. sessionLog KEYS are checked.
3. MAJOR - looser than validDay on nights/corrections: `typeof entry.d ===
   'string'` skips a night with no `d` or numeric `d` (nights[4]={h:7} and
   {d:20250931,h:7} both seal PASS) while a read without `d` is refused. Both
   fixtures give every night a `d`; refusing there breaks nothing pinned.
4. MAJOR (privacy hygiene) - DATE_INVALID echoes JSON.stringify(value) for a
   NON-string value: reads[2].d={secret:...} printed the whole object. Ticket
   allows the malformed date STRING only; print the type for anything else.
5. MINOR - README U+2014 x5 (file style). Cell (f) asserts regex shapes, not
   byte-identical strings, and omits the git-working-tree refusal (my probe
   covered all three byte-for-byte).
6. NOTE - trailing dot/space ("OneDrive.") not refused but not a bypass: Node
   creates a LITERAL distinct folder ("Dropbox.\cli-y" never entered Dropbox).
   "OneDrive - Personal" and Google Drive's "My Drive" are off the exact list
   (ticket rule; %OneDrive*% covers the first when the client is installed).
   --out refusal exits 1 while SHAPE exits 2 (pre-existing).
7. NOTE (integrator) - origin tip moved to 397cf965 after the author's base:
   at 1f7198c S4 says SEAL-BASE-IS-NOT-THE-CHAIN-TIP exit 1. Cherry-picked onto
   397cf965 in a throwaway worktree: S4 `PUBLIC CI EVIDENCE PASS` exit 0; port
   suite 41 pass / 1 skipped (no 8.3 names there) / 0 fail. Rebase before
   merge. CI-home disclosure (allowlist cannot carry the gate) is accurate.

## Suite tails at 1f7198c (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)
- port/test/*.test.cjs: tests 42 / pass 42 / fail 0
- w6/test/local-source-consumer.test.mjs: tests 6 / pass 6 / fail 0
- rebuild\t2\rig187.cjs: `rig187 => PASS`, exit 0
- b-package --ci --package S4: exit 1 at 1f7198c (tip drift, 7); exit 0 rebased
- today 13 by name: tests 645 / pass 645 / fail 0
