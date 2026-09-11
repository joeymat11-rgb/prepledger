# Authoritative initial setup — builder report

2026-09-11. Candidate implementation, NOT accepted or integrated.
Branch codex/astra-initial-setup; base71fb2f1 (reviewed B-NTC composition, package support pending).
Product/test source commit: 7033afe. Assignment: ASTRA-INITIAL-SETUP-BUILD.md.

## Delivered

- `local/initial-setup.mjs`: versioned authoritative `collections.initialSetup.initial` plus `metadata.initialSetup` profile marker. The sealed record retains the supplied setup, athlete/device identities, enrollment time and constructor profile. Validation uses existing createCleanInitState; inputs JSON serialization would alter are rejected before enrollment. No values, defaults, history or recommendations are generated here.
- `local/local-client.mjs`: explicit enrollSetup, fresh-authority read, and boot result. The authority is committed inside the same initial encrypted generation as enrollment. A same-client enrollment guard prevents overlapping key generation; independent-factory CAS still chooses one enrollment. Setup has no replacement API. It is distinct from derived and from a consented plan transaction.
- `local/today-bindings.mjs`: optional first-enrollment initialSetup argument and fresh initialSetup() read. Repeated explicit submission through either factory is refused, including an already memoized installation; it is never silently ignored. Existing no-setup callers keep their old enrollment/write behavior and return LOCAL_INITIAL_SETUP_REQUIRED.
- `test/local-initial-setup.test.mjs`:20 synthetic behavioral tests through actual local-era/client/gym/check-in paths. No extra local module, UI, engine, client-core, fixture, workflow or frozen law needed editing.

The new authority is never inferred from old enroll(cleanInit), an arbitrary cache, or the preview fixture. Reopening reconstructs an initial engine basis from the original document. That basis intentionally has empty histories and w:null; current reading/workout projections must still be composed by the next owner-entry builder.

## Public API for the next owner-entry builder

1. For an observed fresh local client: `await client.enrollSetup({setup})`. Success is `enrolled:true` only after encrypted generation, key persistence and enrollment marker writes complete. Existing enroll(cleanInit) stays a legacy/cache-only path.
2. `await client.boot()` now includes `initialSetup` on a readable successful boot. `await client.initialSetup()` rereads the sealed generation and returns `{configured:true, profile, constructorProfile, athleteId, deviceId, createdAt, setup, basisState}`. Returned setup is detached; basisState comes from the unchanged frozen constructor. Neither method exposes key material.
3. `openTodayOverLocalEra({...existingOptions, initialSetup:setup})` or `openTodayInstallation({...existingOptions, initialSetup:setup})` performs setup enrollment on first run. Pass it only on explicit submission. Reopen without that argument and call `await era.initialSetup()`; the existing composition APIs remain unchanged.
4. An old installation without both authority collection and marker returns `{configured:false, code:'LOCAL_INITIAL_SETUP_REQUIRED', setup:null, basisState:null}`. A missing half, malformed record, wrong identity, unknown profile/constructor or inconsistent enrollment time refuses with a named state18 result. Boot cannot authorize host bindings after that refusal. Missing key/store/enrollment-marker protections are unchanged.
5. Repeated explicit setup on an existing installation: LOCAL_INITIAL_SETUP_ALREADY_ENROLLED. Concurrent submission on one client: LOCAL_ENROLLMENT_IN_PROGRESS. Invalid document returns the constructor's existing CLEAN_INIT code, or LOCAL_INITIAL_SETUP_INPUT_INVALID for lossy serialization input. No destructive reset or re-enrollment follows.

Copy/restore consumers must retain the authority collection AND metadata marker. This is a local initial-programme record, not hosted acceptance, owner consent evidence, an accepted plan transaction or proof of a qualified coaching supplier. No setup completion UI or migration of existing unconfigured installations is added.

## Executed evidence

Existing Node24.19.0 and existing dependency directories only; no install or lockfile change.

Final command:
`node --test rebuild/m3/w6/test/local-initial-setup.test.mjs rebuild/m3/w6/test/local-client.test.mjs rebuild/m3/w6/test/local-today-journey.test.mjs rebuild/m3/w6/test/local-host-journey.test.mjs`

Result:109 tests,109 pass,0 fail,0 skipped. Breakdown: new setup20; local client21; Today journey51; host journey17.

- Exact setup, identities, date and constructor/profile roundtrip; mutation of caller input or returned setup cannot rewrite authority.
- Derived absent, malformed and stale: same reconstructed basis, existing operation retained.
- Real C4 path: weigh-in + native Start + performed set + Finish + check-in =5 durable operations, unchanged initial authority. Fresh w:null accepts typed40×10; this establishes storage preservation, not baseline progression.
- A separate synthetic installation seals a structured-cloned source generation under its own repository key, without derived, then reopens with identical setup/basis and all5 original operations. This tests generation serialization/copy preservation, not a product restore workflow or a complete key-recovery drill.
- Missing collection/marker, wrong record profile/constructor/athlete/device, malformed setup and inconsistent enrollment timestamp refuse. No arbitrary cleanInit promotion. Invalid input and injected quota failure give no enrollment/setup success; valid retry succeeds. Sparse arrays, extra array properties and hidden object members are refused before JSON can discard them.
- Two simultaneous independent factories leave one readable authority; duplicate same-client submission and second replacement cannot overwrite it. Existing partial key/store/marker erasure and multi-day C4 clock tests remain green.
- Reviewed B-NTC binding block compared to71fb2f1: unchanged. `git diff --exit-code 71fb2f1` over native-trend-context.cjs, engine/, client/, .github/ and w7-preview/: unchanged. `git diff --check`: clean.

Initial combined invocation lacked jsdom in the selected dependency directory, so Today tests did not execute then; pointing an ignored junction at the already installed jsdom allowed the full final109/109 run. The first new check-in probe used an unsupported synthetic energy label; corrected to the existing accepted 'Moderate' choice before the successful run. No product vocabulary was changed.

## Limits and next work

Synthetic fake-indexeddb evidence only; no browser kill, physical phone, backup credential recovery, hosted sync, private data, import, installation, push, integration merge, deployment or spending. No engine/conformance/full gate or CI claim. B-NTC package integration remains pending. Independent review remains required; builder does not accept this work.

Next owner entry must select configured authority instead of fixture basis, handle current calendar/midnight without changing C4 clock rules, and visibly handle unconfigured/refused setup. Native first-working-load adoption is a separate known delta: this slice deliberately retains constructor w:null. Pending Dad starter-plan/design choices, nutrition/recovery qualifications and full product ambitions remain intact.
