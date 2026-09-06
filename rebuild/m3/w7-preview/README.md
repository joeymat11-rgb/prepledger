# Today preview

This is the approved Today design running on made-up history. Try a sample weigh-in, open **Why this plan?**, then reload: the temporary entry disappears. The calorie range, trend, protein target and explanations come from the accepted engine. This is not your account, and entries are not kept or synced.

When Astra or the integrator has started it on this PC, open **http://127.0.0.1:4177/**. Choose **Morning** or **After a weigh-in** above the screen. The weigh-in button accepts a sample from 60–400 lb with one decimal place, matching the mock's form. Use **Not now** or Escape to cancel. Workout actions explain that workout logging is outside this preview.

## Integrator reproduction

From repository root, with Node 22 or 24 and a **real node_modules directory** containing the root lockfile's dependencies (`npm ci --include=dev`):

```text
node --test rebuild/m3/w7-preview/test/model.test.cjs rebuild/m3/w7-preview/test/view.test.cjs rebuild/m3/w7-preview/test/package.test.cjs
node rebuild/m3/w7-preview/build.mjs
node rebuild/m3/w7-preview/serve.mjs
```

The server binds to 127.0.0.1 only; it is not a phone-accessible deployment. It loads built files once; restart it after rebuilding. `--port NUMBER` selects a different local port. Stop with Ctrl+C. No account, token, backend or private fixture is required for these preview tests/build.
Build output is ignored `.tmp/w7-preview-dist/`, with exactly index.html/styles.css/app.js. The server serves those three assets only, refuses writes and traversal, and never serves the repository root. Google supplies the same Instrument fonts requested by the approved mock; unavailable fonts use its existing system fallbacks. This preview claims no offline or font-cache guarantee. Its server disables application connections and service workers through CSP.

## Design and engine boundary

- The pinned public mock is `rebuild/m1/earned-mock.public.html`, SHA256 `e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563`. Build extracts its exact T02 morning, T01 logged and T08 Why templates plus original styles. Runtime binds all example numbers and dependent prose; they are not frozen reference values.
- Preview controls/status sit outside the product face. Temporary-action wording replaces the mock's fake Saved toast and its Save label. Native form buttons, keyboard focus/escape and heading semantics support the same flow. Other mock scenarios and Gym/proposal/undo/re-entry features remain unbuilt.
- `browser-engine.cjs` composes unchanged read modules only; personal SEED/HISTORY/ROLLUPS are replaced with empty values. `fixtures.cjs` creates all sample athlete facts explicitly. Full-engine imports, seed/migration/merge/writer files, external executable imports and unapproved bundle dependencies fail the build allowlist.
- `model.cjs` is a replaceable, memory-only adapter. Its narrow fasted morning edit follows the unchanged applyRead branch; ten synthetic inputs compare exact resulting state with the actual writer. The full engine is a local test oracle only. Both Date-mode projections and yesterday's separate as-of snapshot are checked.
- These substitutions are valid for this synthetic preview; they are not the real-data engine adapter. W7 integration must replace them with verified operation history (including other devices), accepted W5/W6 interfaces and real recovery/import contracts. Do not reuse empty histories for the owner's port.

## What this proves

Nineteen tracked tests cover eight model/parity cases, five view/keyboard/truth cases and six build/server cases. Existing Linux/Windows public CI runs them. A template/data binding mismatch fails rather than silently leaving an old example claim on screen. No product/frozen-suite rule is changed.

This earns W7-PREVIEW only: it does not prove durable Saved, synchronization, real-server isolation, installed-phone behavior, VoiceOver, 200% text, measured cold-start time, the full I1 milestone or the private port. Those remain the named W5/W6/W8/W9/M2 gates. Never use or alter the seeded soak origin to test this preview.
