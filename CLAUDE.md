# Prep Ledger — project rules

Single-file React PWA. Personal N=1 training/nutrition ledger for one athlete.
Full context: read `HANDOFF.md` before your first change.

## Verify every change with

```
bash tools/ship.sh "<release note>"
```

Runs suite (359 assertions) -> render smoke -> esbuild -> commit -> push ->
beacon. **A red suite blocks the push. Never bypass it.**

If ship.sh returns rc=124 it timed out after building; finish manually — the
exact recovery sequence is in HANDOFF.md section 4.

Use `&&` between ship.sh and any follow-up command, never `;`.
A `;` has twice allowed a red suite to reach production.

## Non-negotiables

- **Every input is 16px.** Smaller triggers iOS zoom-on-focus and the page pans
  sideways. Do not "clean this up".
- **Do not re-architect the layout frame.** Normal document flow, `minHeight:
  100vh` shell, tab bar `position: fixed; bottom: 0`, content padded to clear
  it. Eight attempts at something cleverer all failed and were reverted.
- **The safe-area inset belongs to the tab buttons' padding.** Never add a
  second one to the container.
- **The service worker must not cache `api.github.com`.** A cached sha caused a
  two-day unkillable 409.
- **Never send a `Cache-Control` request header to the GitHub API** from the
  browser — CORS preflight kills the fetch silently.
- **Nothing mutates itself.** Machine-initiated changes file a proposal for the
  athlete to tap. The engines rule, the agents narrate, the athlete overrides.
- **Instruments gate on n.** Cold-start data must say "counting only", never
  produce a verdict.
- **The token lives in `GH_TOKEN`, never in a file.** This repo is public.

## Editing this codebase

`src/app.jsx` is ~5,000 lines and is edited with Python string/line surgery.

- Anchors are unreliable at first occurrence — a stamp pattern once matched
  three elements and produced three rogue stamps. **Grep-count after every
  batch to confirm the change landed exactly once.**
- Check for symbol collisions before adding a component.
- JSX inserted between ternary branches breaks the parse — read the structure
  around the anchor, not just the line.
- `applyRead` is pure: it clones and returns. Tests must capture the return.
- Adding a law or an instrument requires amending the census assertions, or the
  suite fails by design.

## Workflow

Recon before editing. One batch. Grep-verify each change. Parse-check. Run the
suite. Ship. Confirm the beacon shows the new version.

When something is broken, find the mechanism before shipping a fix. Ship an
instrument, not a theory.
