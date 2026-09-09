# Linux adapter — transport and preparation, then separate authorization

Publish only the relative public files listed in `TRANSPORT-PINS.json` plus that manifest. Keep this directory together at any owned remote scratch path. Do not transfer dependencies, generated files, raw output, Windows artifacts, or the parent directory. APM owns publication and transfer; this package does neither.

The existing source/dependency root is reused directly. From the transported directory, run only this static preparation command:

```sh
/opt/node22/bin/node ./prepare.cjs --source-root /tmp/claude-0/-home-user-prepledger/7f750279-b47f-5422-b0ba-d37981e8e0ed/scratchpad/rev155/src --dependency-root /tmp/claude-0/-home-user-prepledger/7f750279-b47f-5422-b0ba-d37981e8e0ed/scratchpad/rev155/src/rebuild/m3/w5/node_modules
```

No install, source export, ordinary witness, or runtime is part of preparation. It verifies 60 original public source/lock pins, exact Node and existing native workerd, package versions, and all existing dependency bytes/links. Internal pnpm links are allowed only within the selected dependency directory; outside/unresolved links and cycles fail. It then builds only static output inside `generated/`, using an explicitly scoped original source-root cwd restored afterward. The existing generated source core must match the independent static build byte-for-byte. It writes no file into the existing source/dependency tree.

The instrument loader uses the original virtual module location for unchanged relative public imports. Reviewed runtime/witness templates receive import/path adaptation only. The original Linux process meter, cadence, formula, calibration and four-attempt/159-request order remain. No actual observer/debugger command runs during preparation.

Preparation creates `PLANNED-MANIFEST.json` with actual installed-byte, source, Node, native workerd, generated bundle, fixture and instrumentation pins. APM must inspect that receipt before authorizing capture. Read-only recheck:

```sh
/opt/node22/bin/node ./pins.cjs
```

Only after separate APM authorization, the one capture command is:

```sh
/opt/node22/bin/node ./launch.cjs --apm-authorized-linux-capture
```

The launcher requires matching prepared pins. It preserves the parent environment. If parent NODE_OPTIONS is present, it omits that variable in the child only when it is exactly the previously approved single numeric `--max-old-space-size=` option with SHA-256 `560d91cc597a59774228b503f751332375555956411b827dcea4defa95e0878c`; any different/extra hook or setting stops setup. Other runtime overrides stop setup. The omission is recorded by hash/category without printing the variable. Child NODE_OPTIONS must be absent. No runtime setting is otherwise changed.

The supervisor deadline starts before child creation; ownership and launch-record success precede the workload handshake. Linux identities use PID, direct parent, `/proc/<pid>/exe`, and exact field-22 starttime, safely parsed around the parenthesized command name. The meter additionally checks its PID against exactly one freshly spawned owned workerd. Linux final fallback uses SIGKILL on its direct handle or a revalidated exact identity; never process groups or name-wide killing. Runtime allowance five minutes, cleanup ten seconds. The reviewed controller attempts resume, disable, inspector/counter close and disposal first.

The first strict crossing above 100,663,296 bytes triggers the same reviewed pause/snapshot method: real pause within five seconds, one snapshot while paused within 30 seconds/256 MiB, original four-field observations with trigger/pre/post distinct. No GC command, sampling, forced evaluation, source-map addition, fallback method or automatic rerun exists. No crossing means `NO_TRIGGER_NONQUALIFICATION`; every outcome is `resourceAcceptance:false`. One exclusive attempt claim blocks reuse; preserve it and all partial evidence on failure.

Raw output stays local under ignored `raw/`. Require finished supervisor `CAPTURED` without timeout/error/cleanup failure, diagnostic `snapshotUsable:true`, complete validated JSON/metadata and command completion with no late chunks before graph analysis. Snapshot-induced collection and drift below threshold remain explicit limitations. Never print or transfer heap strings, synthetic keys or object values. This is not original-peak savings or capacity acceptance.

Windows synthetic checks cannot prove Linux runtime compatibility or capture success. The confirmed frozen-lock Linux failure justifies this preparation; the older unreceipted Linux binaries are not claimed equivalent. Any setup failure ends preparation for APM disposition; do not reinstall, remove claims, bypass pins, or launch another workload.
