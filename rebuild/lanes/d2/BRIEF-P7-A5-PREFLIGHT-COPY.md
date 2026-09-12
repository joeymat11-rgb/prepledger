# P7 A5 PREFLIGHT COPY v1.0, proposed by Lane D2

Proposal for PM judgment under DECISIONS:114(1), :121, :159 and REQUESTS 2026-09-12 17:49. Source base f40d27b. Close the explicitly carried A5 dash exception without changing what offline-ready proves. No product change or acceptance claim.

## Outcome
The install/offline panel obeys the owner's no-em-dash/no-en-dash rule in its initial markup, success copy and failure paths. A5's tests enforce zero owned user-facing dashes rather than preserving the two known exceptions. Cache readiness still means the controlling worker verified the assets on this device, not a guarantee about a future launch.

## READ-LIST
- rebuild/slice/pwa/preflight.html:11: the static "Offline launch" line contains one em dash.
- rebuild/slice/pwa/preflight.js:18, :22, :38, :53, :58, :78: standalone guidance, status rendering, bounded status request, verified readiness, successful detail and registration failure. The latter appends an arbitrary error.message to visible copy, so rewriting only the two literals does not prove the runtime rule.
- rebuild/slice/pwa/test/pwa.test.cjs:658, :666, :672, :680: source/installable-HTML exception count and its planted-dash control.
- rebuild/slice/pwa/test/package.test.cjs:206, :221, :231: deploy-folder sweep permits one dash in index.html and one in the hashed preflight script. Preserve the sweep, remove its exception.
- rebuild/slice/pwa/build-pwa.mjs:59, :68, :76; shell.cjs:1: hash-named preflight assets, assembled HTML and automatic cache identity. No hand-edited built file or fixed SW version.
- rebuild/m3/w7-preview/today/test/copy.test.mjs:265; today-app.cjs:379: engine reading-note render coverage already exists. PM REQUESTS 04:24 asked about late/sealed note dashes; keep that existing coverage rather than widening P7 into engine edits.
- .github/workflows/slice-host.yml:90, :93, :96; rebuild/DECISIONS.md:121: existing A5 CI commands and residual authority.

## Exact copy changes
| Location/state | Proposed exact rendered text |
| --- | --- |
| Static heading prefix | `Offline launch: ` followed by the existing live status span |
| Verified ready detail | `All {total} files of this build are stored on this device. Everything the launch needs is here.` |
| Registration failure detail | `The offline copy could not be installed. Reload once with a connection.` |

The registration failure sentence replaces the raw machine error in visible copy; this is an INVENTED wording proposal for PM judgment. It neither exposes diagnostics nor needs a second normalizer or a new logger. Other status text, install guidance, `offline-ready` check mark and measured counts remain unchanged. This polish does not impose the brief-author no-emoji convention on an already approved readiness indicator.
Do not normalize engine files, strip meaningful hyphens/minus signs, weaken P1's bundle boundary, or suppress a failure merely to pass the dash sweep. Every failure remains `not yet`, with its existing or the proposed actionable explanation. Preserve worker registration scope, request protocol, attempt budget, timeouts and cache verification exactly.

## States to demonstrate
Initial HTML before JavaScript; unsupported service worker; insecure origin; no controller; incomplete cache; worker silent; verified ready; registration rejected with a plain cause and with em/en-dashed causes; installed mode where install guidance stays hidden. No state fabricates a stored asset or changes readiness because of punctuation.

## Executable acceptance bar
New cell IDs are INVENTED. Source exception counts above are measured from the cited assertions; expected zero is the owner's rule at :114(1).
| Cell | Required execution |
| --- | --- |
| P7-01 | Rewrite exactly the two owned literals plus registration-failure copy; assert exact new text and unchanged semantic ready/not-yet states. |
| P7-02 | Existing source/HTML sweep expects zero preflight-owned dashes; remove the old one-per-file and locator exceptions rather than renaming them. |
| P7-03 | Build A5 and sweep its actual deploy folder: zero owned visible em/en dashes, including hashed preflight JS. Keep the existing app bundle exemption only with P1's unchanged build/render guard; no new exemption. |
| P7-04 | Run preflight.js in a DOM harness across every state above, with controllable worker/channel/timers. Scan text and accessibility/placeholder/title attributes. Inject both raw and escaped dashed registration error messages and verify readable failure, never an unhandled rejection or visible dash. |
| P7-05 | Plant a dash in markup, ready detail and registration-failure detail, including a JS Unicode escape. Each fails a relevant test; tests must observe rendered strings rather than only grep raw source. Restore bytes in finally. |
| P7-06 | Partial cache/no controller/silent worker/registration failure never set data-ready=yes. Only a controlling worker's ready response does. Existing status attempt/timer protocol tests stay green and their constants remain byte-unchanged. |
| P7-07 | Asset and cache hashes change through the normal build; all emitted URLs resolve and the existing real-browser offline-launch check passes with its worker-blocked control. No network request to a new origin. |
| P7-08 | Run `node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs`, `node rebuild/slice/pwa/build-pwa.mjs`, then `node --test rebuild/slice/pwa/test/package.test.cjs`; run `node rebuild/slice/pwa/browser-offline-check.mjs`. Report actual counts, no hardcoded inherited baseline. |
| P7-09 | Re-run existing Today copy.test.mjs reading-note case after the combined build; both engine note text and its dash-free rendered result are checked. If a genuine uncovered note appears, report its exact render slot for a separate custody decision. |
| P7-10 | Exact-head Windows and Ubuntu evidence plus the A5 host workflow green; state which commands CI actually enumerates. Reviewer runs the source/render/deploy sweeps and mutants before builder report. No phone proof claimed from browser emulation. |

## Custody and estimate
| Files | Owner / rule |
| --- | --- |
| pwa/preflight.html, preflight.js, test/pwa.test.cjs, test/package.test.cjs | Lane C/A5 builder named by PM; put harness cases in the already-enumerated pwa test file |
| P1-owned app bundle guard, engine reading notes, worker protocol, cache algorithms, headers, deployment scripts | Read only; no semantic edits |
| Workflow enumeration needed for both-OS evidence | Current PM/CI owner; no D2 workflow edits |
| P5 overlap | Serialize edits to preflight.js; re-run A5 source/render/deploy tests after whichever lands second |

Size: SMALL, INVENTED planning estimate; two literal rewrites, one bounded dynamic-error copy correction and stronger existing tests. Return exact head, before/after copy, mutant counts and CI IDs. D2 writes/reviews within its lane; PM judges and the designated integrator ships.
