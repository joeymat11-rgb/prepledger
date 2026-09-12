# P3/P4/P5/P7 brief recon, D2, 2026-09-12

Source base f40d27b in work/lane-d2/edit-week. Briefs dispatched by PM REQUESTS 17:49; no implementation authorized to D2. Four briefs proposed, each with READ-LIST, exact copy or explicit no-copy change, states, executable acceptance bar, custody and declared estimate.

## Executed source observations
Read-only Node assertions: 16/16, four per brief. These are observations of the baseline, not passed implementation acceptance cells.
- P3: deploy.yml's preview condition admits non-main/non-PR refs; no rebuild-prefix exclusion exists; the slice workflow names rebuild/t2-client-core separately; deployment still has needs:test. Source: deploy.yml:157 and slice-host.yml:32.
- P4: paint awaits model.read, can call model.start on ready, recursively paints, and the exported draft object exists. Source: gym-app.mjs:46, :313 on the integration base. The settings candidate's leaveCard/show/paint guards at ea78c24 were independently reviewed earlier; the new brief requires that landed ownership mechanism.
- P5: shell contains phone/status nodes; design composes approved styles before chrome; preflight detects both display-mode and iOS standalone; the shell explicitly labels its synthetic athlete. Source: index.shell.html:18, :20, :22; design.cjs:492; preflight.js:18.
- P7: comment-stripped preflight markup contains one em/en dash; runtime detail includes both worker count and arbitrary error.message; source tests pin A5_OWN_PREFLIGHT_DASHES=1; deploy-folder sweep expects a dash in both index and hashed preflight JS. Source citations are in the P7 brief.

## Decisions requested from PM
- P3: confirm the proposed rebuild/ branch namespace policy and name the PM-owned deploy.yml builder/CI home under :112(3). It deliberately does not classify arbitrary other branch names by changed paths.
- P4: confirm one deliberate read retry per fault episode, with no command replay or automatic Start on read recovery. The original queue label did not specify automatic versus manual behavior.
- P5: approve standalone-only removal of the phone frame with existing disclosure/diagnostics retained; normal browser chrome stays as reviewed. No approved asset hash moves.
- P7: approve the exact three copy changes, including replacing a raw registration error with actionable generic copy. Worker/cache semantics stay unchanged.

## Coordination recorded
EDIT MY WEEK v1 remains the accepted file/hash at :176, read with the PM's Exercises + Machine settings narrowing; Days/Priorities and EW-06/07/10 wait for v1.1 after v1 merges. The plan-edit companion is Lane D's, editor Lane C's, editor review D2's. No accepted brief bytes were revised.
Lane B REQUESTS 18:08 now reports that unnamed food/settings suites block H3's enumeration cell. That request is for the PM; D2 neither changes the gate nor supplies a waiver. Every proposed new suite above requires an explicit CI home, and P7 uses the existing enumerated A5 file.
Settings combined-tree review and N2 review take priority when Lane C sends their exact heads. N2 also carries :173's prohibition on invented sleep defaults and the published N2-SOURCE-ERRATUM.md. No new review request arrived while these briefs were authored.

Validation: all four files have the required sections and zero em/en dashes; git diff --check passed. Proposed bar cells are P3 8, P4 12, P5 12, P7 10, not test pass counts. No product, workflow, engine, authority or private-data file was edited. PM judges by name before implementation; this report is not an acceptance line.
