# Slice deploy triggers

The slice-host workflow rebuilds and deploys https://earned-slice.netlify.app only when a
push to rebuild/t2-client-core touches rebuild/m3/w7-preview/today/**, rebuild/slice/pwa/**
or the workflow file itself. A sealed change that lives elsewhere (for example under
rebuild/m3/w6/local or rebuild/m3/w7-preview/import) reaches the tip without touching any
of those paths, and the site would keep serving the previous build. This file is the
deliberate, docs-only trigger: the PM appends one line per such deploy and pushes it with
the ledger line that records the merge. It is not product, not pinned by any package, and
never read by the build.

- 2026-09-17 M2-S7-PORT-ADMISSION sealed and merged at 285fe08b (DECISIONS:519): the
  programme admission rule (P3-PORT-FIX + FIX-2). Deploy requested by this line.
- 2026-09-18 M2-S8-REAL-SHAPE sealed and merged at e8712f48 (DECISIONS:529): the real-shape
  admission rule (P3-REAL-SHAPE + P3-LAYOUT-V2, the file wins). Deploy requested by this line.
- 2026-09-18 P3-TODAY-HOTFIX merged at 9742490e (DECISIONS:535): the deployed page hides the
  desktop review asides, reserves the status bar, and keeps proposals out of the plan
  headline. Deploy requested by this line.
