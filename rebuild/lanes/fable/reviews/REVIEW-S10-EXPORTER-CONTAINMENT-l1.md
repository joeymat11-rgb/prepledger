# REVIEW-S10-EXPORTER-CONTAINMENT-l1 (Fable, independent containment read, 2026-09-25)

VERDICT: ACCEPT WITH NAMED DEBTS (D-S10EXP-1..4 below). The port may be the T10 exporter once the
run preconditions in section 5 hold. Nothing was executed: no exporter run, no runner run, no
child, no protected file opened; every measurement is a git show, a byte hash or a static read.

## 0. Object and inputs (all MEASURED, byte-exact via git show into node; no PowerShell redirects)
- Port: C:\Users\joeym\AppData\Local\Temp\earned-s10-exporter (branch rebuild/p-s10-exporter-v1, HEAD
  f97924af8be21fb68ff792d65c08fced58437032), untracked rebuild/lanes/astra/s10-exporter-v1/
  export-s10-profile-v1.cjs.txt sha256 de3aeb76fc7b81d70829f6a27aa52d7d56eeaadfe30a972158740eca73c93301,
  13799 bytes, 195 lines, LF. Word diff export-s10-profile-v1.vs-v3.word-diff.txt sha256
  4f5d2331f47337fb4da13803870bec04dedbe52e2ba87b3fe6f2b46f2cc6080e. git status in that worktree shows
  exactly these two `??` under rebuild/ and nothing else.
- Source v3: 9a29c3a:rebuild/lanes/astra/s9-exporter-v3/export-s9-profile-v3.cjs.txt sha256
  576fd22ea385bbd3e0fb744526988161ebfc79f37b4b2b6015e961f374eea5a5, 13769 bytes, 195 lines.
- Actual S10 inputs read at W (C:\Users\joeym\AppData\Local\Temp\earned-s10int, HEAD f97924a): SP =
  HEAD:rebuild/lanes/b/tooling/packages/S10.json 66df4c06d8574545cdcfadbb61290e3366df8a2c91b716eb8ba7ec78a2bc343f
  (2019 lines); BP = HEAD:rebuild/lanes/b/tooling/b-package.cjs 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c
  (3948 lines); S9 runner d7f6540:...b-package.cjs 5321181a (3933 lines); parent artifact
  rebuild/m4/spec/acceptance-s9-ui-pins.json f2447622 and review 7f372d97 on disk in W.
- Chain: refs/remotes/origin/rebuild/t2-client-core = 85653f4876b09453648951a748f57739ddc1cc39 (817
  ledger lines; :816 carries the S10 rulings). Rules 51706c33 and runbook a39a0253 hashes re-taken.
- Toolchain: git 2.53.0.windows.3 at G; node v24.19.0 at N.

## 1. Only literals changed (MEASURED: line-by-line compare of the two 195-line files)
Exactly 11 lines differ; every other byte is identical. :12 specRel S9.json -> S10.json; :30 comment
"installed is 2.55" -> "installed is 2.53.0.windows.3"; :33 scratchRoot earned-s9- -> earned-s10-;
:45 /^s9-/ -> /^s10-/; :104 '--package','S9' -> 'S10'; :115 lanePackage 'S9' -> 'S10'; :170 and :172
"S9 PROFILE EXPORTED PENDING" -> "S10 ..." (string and regex); :182-183 acceptance-/review-s9-ui-pins
-> -s10-today-split; :186 refusal text "S9" -> "S10". No control changed: E1 (:24-28, :49-55, :58-67,
:96-103 env/config/HOME isolation, cleanTree twice), D1 (:74-77, :122-124, :175-177 chain checks),
D2 (:21-22, :137-168 hash-only protected five, guard walk, leak checks), D3 (:16-19 import pins,
:107-111 require.cache), D5 (:31, :70-71 toolchainOk) are byte-identical to v3. The word-diff file
matches this list. The line count is 195 in both, so every EXP:n cite in the runbook still holds.
Two of the 11 are not a mechanical S9 -> S10 rename and are named as debts: :30 (a new fact in a
comment) and the absence of a port line in the :2-6 lineage header (D-S10EXP-1).

## 2. Every read and write stays inside the reviewed containment (static, on the actual inputs)
Reads. (a) git, only through :54 with -C root, --no-replace-objects, a filtered env (no GIT_*, HOME and
XDG_CONFIG_HOME replaced by a path inside the not-yet-created destination, GIT_CONFIG_GLOBAL=NUL,
GIT_CONFIG_NOSYSTEM=1): rev-parse HEAD / chainRef / --show-toplevel, --version, status, ls-files, and
`show <expectedHead>:<file>` for the runner, the spec, the eight imports and every pin. All are objects
of W's own repository at the head the PM passes. (b) Disk under root only: the runner (:78), the spec
(:81), the eight imports (:85-87), every pin (:146). Every pin path is asserted relative, forward-slash,
without '.'/'..'/empty segments, under rebuild/ or .github/, and not under rebuild/conform/private/
(:141-144) before it is read. (c) The compiled BP prefix (BP:1-3838, marker found exactly once at
BP:3839): its top-level statements are the five requires (BP:90-95, all eight import files, node
builtins only at load time; run.cjs:143, target.cjs:89/128-129 and legacy-gates.cjs:102 requires are
inside functions the export never calls), the argv gate at BP:690 (satisfied by :104, 'S10' is in IDS
at BP:181) and four assert loops (BP:194, :338-341, :602, :620). The closure of spec()/parent()/
proposed() (34 functions, measured by call graph with comments stripped) reads only rel(<spec path>)
files, SPEC_DIR (BP:2190) and git objects (L.git / L.object with cwd root); canonicalSpecPaths at
BP:1877 refuses a non-canonical path for every product key, brief.file, carrier and child target before
any of them is resolved; childArgv (BP:741) refuses absolute, '..' and backslash targets. No call to
laws() (BP:2693), children() (BP:2798), authority() (BP:2649), historical() (BP:3802) or
writeSealedRunReceipt() (BP:3676) is reachable from that closure, so the protected five are never
spawned or required by the compile; the only reads of their bytes are hash-only (:146-150 and, for a
successor-proof walk, BP:840 into a Map that the artifact never carries).
Writes. Exactly two, :182-183, with flag 'wx', into destination = realpath(scratchRoot)/<outputName>
where scratchRoot is a fixed literal outside root (:40-44: realpath equals the literal, is a directory,
not a symlink, and path.relative(root, scratch) starts with '..'), outputName matches /^s10-[a-z0-9-]{1,80}$/
(:45) and destination does not exist before mkdir (:46, :178-181). The BP prefix has writes only in
laws/children/writeSealedRunReceipt/historical (BP:2696-2697, :2812-2815, :3686-3687, :3805-3815),
none in the closure. console.log/error are silenced during the compile and restored in finally, so
BP's say()/note() text cannot reach stdout; the catch prints the text-free refusal only.

## 3. No protected content can reach output (D2 on the actual S10 spec 66df4c06)
- The artifact proposed() emits (BP:3460-3490) is built from spec fields, GATE_IDS and sha256 pins.
  SP.notes (10 free-text strings) is NOT an artifact key, so it never reaches the export.
- The protected five appear in SP only as product keys, each role carried with pre == post; the
  guard walk (:157-161) over SP finds 15 guarded leaves (pre, post, role for each), all hex64 or
  'carried', 0 violations. No string value anywhere in SP names a protected file; no child argv
  target is a protected file (90 targets; the one under rebuild/engine/ is rebuild/engine/test/
  proposed-pick.test.cjs, a test, not one of the five).
- The 20 free-text strings of >= 24 chars that DO reach the artifact (parent note, the five
  coverage.superseded whys, two protectedSurfaces, owner/contract ledger lines) are process prose
  citing ledger lines and package ids; none contains code shapes (require(, function, =>, braces,
  backticks) and none quotes an engine line. The secondary leak checks (:163-167) stay as in v3.
- Parent pins: for each of the five, S9 artifact post == S10 pre == S10 post (measured on f2447622).
- At HEAD f97924a every product entry with a string post (295 = 232 carried + 20 edited + 42 new +
  1 superseded-by-child) hashes to its HEAD blob; the 2 released entries (post null, role released)
  are filtered out of product by BP:3456 before the :125 hex check, and the released block's leaves
  are a sha256, 'released', the sealing package id and a ruling sha, none under a protected key.
- Child target rebuild/m3/w7-preview/today/test/catalogue.test.mjs is not in SP.product; it was an
  S9 execution pin only (a586e3eb, unchanged at HEAD, tracked), so it becomes an S10 execution pin
  through BP:3408 and is verified at :145-147 like every other pin. Not a containment issue.

## 4. What the port asserts that the runbook's T10 relies on (MEASURED)
- `git version 2.53.0.windows.3` matches :31's regex (groups 2, 53, 0, '.windows.3'), and the
  output line regex (:172) admits git=2.53.0.windows.3 and node=v24.19.0.
- Slug: 'M2-S10-TODAY-SPLIT'.replace(/^M2-/,'').toLowerCase() = s10-today-split (BP:2071), so
  :182-183's literals equal the ARTIFACT/REVIEW names BP:2072 derives for the ruled id (:816).
- Output name s10-final-1 matches :45. scratchRoot ...\earned-s10-profile-export-results does not
  exist today (T10 creates it); the S9 root still exists and is never touched by this port.
- W today: 2 `!!` (rebuild/m3/w5|w6/node_modules junctions) under rebuild/ refuse cleanTree until
  T9 removes them; ls-files -v has 0 non-'H' entries; rebuild/conform/private absent.

## 5. Run preconditions the exporter enforces by refusal (not defects; the PM meets them at T10)
P1. The final SP must be committed at the head passed as expectedHead with packageId
    M2-S10-TODAY-SPLIT, artifact.file/review equal to BP:2072's names, brief.file naming a file
    tracked at that head (BP:3406 pins it; :145 refuses an untracked or differing pin), and every
    product post equal to the blob at that head (:145-147). SP 66df4c06 has packageId, brief,
    artifact, both ruling shas and all 35 needles null: spec() refuses it today (as the PM's
    disclosed s10-ci1 slip showed), so the T3d port is reviewed here against the SHAPE of the
    actual inputs; a byte change to SP after this read changes no exporter control (the guard
    walk is dynamic), but the E2 primary control (PM review of the new spec strings: token lines,
    needles, brief citation) is still owed on the final SP before T10.
P2. W is dirty today (round 11 in flight: S10.json, cut.cjs, problem.test.mjs modified, an
    untracked l5 review): cleanTree (:58-67) refuses until W is clean and T9 has removed the two
    junctions. Re-read chain40 at T10 (the chain moved 94977a9 -> 85653f48 during this read; the
    exporter takes it as an argument, :39, :77, so no port literal is stale).
P3. The T10 cmd must put G's folder first on PATH: :54 calls bare `git` (as does BP via
    legacy-gates.cjs:7), and PATH still names the removed PortableGit.

## 6. Named debts
D-S10EXP-1 (cosmetic, carry): header :2-6 still reads as the S9 v1/v2/v3 lineage with no "S10 port
    of v3 576fd22e" line, and :30 states a new fact (the installed git) rather than a rename. Kept
    so that every EXP:n cite holds; the port's provenance is this review and the word-diff file.
D-S10EXP-2 (inherited from v3, low): the exporter does not assert artifact.artifact.file ==
    'rebuild/m4/spec/acceptance-s10-today-split.json' (the artifact carries it, BP:3489), so a
    packageId other than the ruled one would be exported under the :182-183 names. Detected
    downstream: T12 --ci derives ARTIFACT from packageId (BP:2072) and would report ENVELOPE ABSENT
    rather than PENDING. Closable by one assert on :115's line without moving any cite.
D-S10EXP-3 (inherited from v3, low): :107-111 checks require.cache only for modules INSIDE root;
    the eight imports load only node builtins at load time (measured), so nothing outside root is
    loaded today, but the check would not see a future import from %TEMP%\earned-adm junctions.
D-S10EXP-4 (process): the port lives untracked on rebuild/p-s10-exporter-v1; T10 copies it from
    `git show <ref>:<path>` (runbook T10), so it must be committed on that branch first and the
    committed blob must hash de3aeb76... (Fable fix 5: never an untracked file in W).

## 7. Method and limits
Static only. Every hash is a node sha256 over `git show` bytes or disk bytes (no PowerShell `>`).
Scratch: %TEMP%\fable-s10c (extracts of v3, the port, SP, BP, S9 BP, BR, DECISIONS; analysis
scripts hash.cjs, an.cjs..an7.cjs, sp.cjs, sp2.cjs, pins.cjs, misc.cjs, cat.cjs). The protected five
were never opened, printed, required or executed; their bytes passed only through a sha256 in
pins.cjs (hash-only, as D2 allows) and no content of theirs appears in this file or in any output.
The call graph of section 2 is a regex over identifier( calls with comment lines stripped; function
references passed as values (option at BP:2163) were followed by hand (option -> envelope, ancestor:
no writes). Nothing was staged or committed; the PM publishes.
