# REVIEW-S10-INTEGRATION-l4 (Claude Fable 5.1, independent reviewer, round 4, 2026-09-24)

Commissioned subject: S10 integration round 9, origin/rebuild/b-s10-integration fc6561fd (base 62788b1, parent
candidate 6dc2596), read-only worktree %TEMP%\earned-s10int at HEAD fc6561fd, git status clean before this file.
Inputs read: git diff 62788b1 fc6561fd -- the four named files (145 insertions, 5 deletions; the fifth changed
path is Astra's L4 review, 191 lines added); Astra S10-INTEGRATION-REVIEW-L4 (REJECT, B5 residual only); my l3;
DECISIONS.md :801 ruling (2) D-S10I-14 in the PM worktree (read only). Rules obeyed: opus55-RULES.txt read
first; no tracked file edited; no commit/fetch/checkout; git show/diff after -- with explicit paths; every node
run under %TEMP%\earned-runtime.lock (created by me, removed by me, three cycles); MEASURED_TEST_NOW=2026-09-03,
TZ=America/New_York, Node v24.19.0; no protected-five file loaded (the only node cells run compile S10-REGEN.cjs
on the committed suite's FAKE fs/child_process ports; every byte anywhere is an invented marker).

VERDICT: ACCEPT WITH NAMED DEBTS

## 1. Astra L4 B5 residual: paid, by positive admission, red first
Fix (S10-REGEN.cjs:73-113, :138-139): admission(segs) runs after every existing refusal, in the old order
(plain path, ADS, 8.3, trailing dot/space, canonical forbidden set, protected alias, scope, auth words). It
refuses (a) any dot-name segment, (b) any segment or extension-stripped stem in CREDENTIAL_NAMES (27 names,
lower-cased), (c) any dotted part of any segment in KEY_EXT (10), (d) any final extension not in ADMITTED_EXT.
The four-word AUTH_SEGMENT, auth.json/.credentials, AUTH_ALLOWLIST (empty) and every earlier refusal are
unchanged: the cjs diff is additive (one comment reflow at :29-35, no deleted logic); the test diff is 83
inserted lines, no row or assertion removed; 31 prior rows still present.
RED, measured by me: the committed test bytes (159bd49f, byte-exact copy via cmd git show) run beside the
62788b1 helper (ef535849, byte-exact) in a scratch tree of the same depth (%TEMP%\fable-s10-l4\old\rebuild\
lanes\b, so REPO resolves alike): 120 tests, 32 pass, 88 fail; 78 fail "the helper READ <name> (content read
reached) before refusing it", 10 fail "not refused" (sealed execution pins and split sources: admitted, object
ids only). Tap run-red-62788b1.tap sha256 7fc34ce56eed. (Author's 117-row figure 31/86 plus the 3 ruling rows:
the exact rebuild.yml control passes on the old helper, the two nested .github rows read; consistent.)
GREEN: committed suite at HEAD, worktree bytes, node --test: 120/120, exit 0. Tap run-green.tap 5aceae053f2a.
Author's four cited taps exist with the cited sha256 prefixes: a7335d926663, aa373ce32458, 00ef5dbb58b2,
11d8e31d9000 (existence and hash only; I did not adopt them as my evidence).

## 2. Counterexamples (my probe, %TEMP%\fable-s10-l4\probe.cjs, same fake ports, MARKER planted at P, HEAD
and disk; each name through changed paths, S10.product and the S9 candidate execution pins; HEAD helper and
62788b1 helper side by side; probe.out 161 rows)
Refused BY NAME, exit 2, zero reads of the name, only the fixed inputs read before the refusal, on HEAD; the
62788b1 helper ADMITTED and READ each (3/3 sources) unless marked *: .netrc, _netrc, .ssh/id_ed25519,
.ssh/id_rsa.pub, .npmrc, .pgpass, id_ed25519.json (stem), known_hosts.cjs (stem), .NETRC, _NetRC, ID_RSA,
Id_Ed25519.PUB, .SSH/ID_ED25519, SIGNING.PEM, x.PeM.json, x.Key, CERTS.P12/x.json, .Env, x (no ext), x.txt,
x.yaml, x.cjs.bak; nested .github: rebuild/m4/spec/.github/workflows/rebuild.yml, rebuild/m4/workout/.github/
x.json, rebuild/lanes/b/tooling/.github/workflows/rebuild.yml (all "a dot-name segment (.github)").
* refused by BOTH helpers by an earlier clause (nothing weakened): .aws/credentials, .git-credentials,
authorized_keys2 (auth words); NETRC~1 (8.3); _netrc:$DATA, id_rsa.json:stream, .github/workflows/rebuild.yml:ads
(ADS); .netrc., ".netrc ", .github/workflows/rebuild.yml., x.json. (trailing dot/space); .GitHub/workflows/
rebuild.yml, .github/Workflows/rebuild.yml, .github/workflows/REBUILD.YML, other.yml, rebuild.pem, id_rsa.yml
(outside scope: exact entries match case-exact, so no sibling or spelling of the two workflow files is admitted).
Admitted and measured (controls): x.json, x.JSON, x.css, notes.md; exact .github/workflows/rebuild.yml
(suite row) and .github/workflows/shared-preflight.yml (my probe: exit 0, "undeclared => new").

## 3. The :801 ruling (2), D-S10I-14, as installed
Ledger text: "the no-dot-name clause does not apply to a path that is exactly an exact-file SCOPE entry of
S10-REGEN (rebuild.yml, shared-preflight.yml); name, key and extension clauses still apply." Code: EXACT_REVIEWED
= SCOPE entries without a trailing slash (6: the two workflow files, S10-REGEN.cjs, S10-REGEN.test.cjs,
S9-UI-PINS-BRIEF.md, rebuild/m1/MOCK.md); exact = EXACT_REVIEWED.has(segs.join('/')) where segs = f.split('/'),
so the match is the whole path, case-exact, after the ADS/8.3/trailing/backslash refusals; only clause (a)
consults `exact`; (b), (c), (d) run for every path. No directory or prefix entry gains anything. Exactly :801.
Red first for the ruling, measured by me: the HEAD helper with the single ` && !exact` removed (scratch copy,
1 occurrence) under the committed suite: 119 pass, 1 fail, "not ok 118 - B5-L4 CONTROL: the exact reviewed
.github/workflows/rebuild.yml is admitted and measured"; the two nested .github rows pass on both, so they hold
the line against a wider exemption. Tap run-red-noexempt.tap.
Real repository, name only (from S10.product at fc6561fd): the only dot-name paths among the 296 are the two
workflow files; without the exemption REGEN would refuse S10's own declared product by name.

## 4. ADMITTED_EXT derivation and pins, byte-exact (node crypto; git show blobs read by node)
S10.product@fc6561fd 296: .cjs 163 .mjs 113 .json 13 .md 3 .yml 2 .html 2. S9.product@6dc2596 255 and
@fc6561fd 255: .cjs 134 .mjs 105 .json 9 .yml 2 .html 2 .md 2 .css 1. Union = {.cjs .css .html .json .md .mjs
.yml} = ADMITTED_EXT exactly; the comment's counts are correct. Roles 231 carried, 20 edited, 42 new,
2 released, 1 superseded-by-child (296).
S10-REGEN.cjs: blob@fc6561fd = disk = pin cfead8b045194b45bf2d9bb40b60927b1f5b96b430e0d87bc36b89b4dbb8d0d6
(26388 bytes, LF). S10-REGEN.test.cjs: blob = disk = pin 159bd49fc5b1755f5a1909de0c1b37779ce97f8e82cdc35290c7
0072e5fb95c0 (23028 bytes, LF). S10.json 62788b1 vs fc6561fd: 2024 lines each side, exactly two differing lines,
L155 and L160, the two post values above (ef535849 -> cfead8b0, 19e0c5a3 -> 159bd49f); roles/pre unchanged.

## BLOCKING
None.

## NAMED DEBTS
D-S10I-15 (new, small): the positive rule still admits secret-shaped non-standard basenames under the roots:
  keys.json, passwords.json, private.json, env.json, apikey.json, wallet.json, keystore/x.json (a bare
  directory named keystore; KEY_EXT matches only dotted parts) all reach a content read on HEAD (probe rows,
  3/3 sources). None is a standard credential file name and each is only hashed, never printed, but the word
  list could add password|passwd|apikey|api[-_]?key|wallet|keystore|private[-_]?key red-first. Not blocking.
D-S10I-16: the committed suite's S10_REGEN_UNDER_TEST red-first works only when the substitute helper sits at
  a path whose ../../.. equals the test copy's REPO (both derive REPO from __dirname); a helper placed in flat
  scratch fails every row with a TypeError at :161 (diskAt(SPEC) null), which is a harness artefact, not a
  refusal. Record the same-depth layout in the test header or resolve REPO once and pass it. Not blocking.
Carried from Astra L4 and my l3 unchanged: D-PARENT/LOCK, D-SPLIT, D-GSS, D-EPP/CR, D-ACCEPTANCE, D-REGEN-NOTES
  (note [8] still calls D-EPP-4 unpaid), D-S10I-4/8/11/12/13 where not yet paid, the s.2.1 STOPs; the ledger
  line for D-S10I-14 is written (:801) and the report says so. Not claimed by anyone: race resistance between
  validation and read, hard-link identity.

## Not verified by me
No REGEN dry run or --write against repository data this round (name-only census from the spec files and the
fake-port suite only); no protected module executed or read; the sealed-parent and split-source rows were run
only through the committed suite (120/120), not my probe; Astra L4 questions 1-6 (merges, runner, supersession,
roles, CI condition callbacks) were not re-measured here, only the B5 residual and the re-pins. Scratch kept:
%TEMP%\fable-s10-l4 (verify.cjs, probe.cjs, probe.out, three taps, old\ and pre\ helper copies).
