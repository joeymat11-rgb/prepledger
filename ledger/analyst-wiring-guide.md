# Prep Ledger — Nightly Analyst Wiring Guide

How the rebuilt Analyst actually runs. Three pieces work together:

1. **The engine** — `tools/analyst-engine.js`. A small Node script that reads your synced `state.json` and does the number-crunching: the soft trend (no hard seals), the loss rate and its confidence, your real TDEE, your water/sleep sensitivities, weekly blocks, the plateau/whoosh read, and a first draft of ranked suggestions. It writes `ledger/analysis.json` (the full read) and `ledger/suggestions.json` (the cards).
2. **The constitution** — `ledger/analyst-constitution.md`. The standing instructions for the Analyst's brain (a Claude chat). It says how to think, what the science floor is, how to write in plain voice, and how to turn analysis into approvable suggestions.
3. **The app** — already live at **v3.99.3**. It reads `ledger/suggestions.json` and shows each suggestion as an approve/dismiss card on the NOW tab. Approve applies the target, logs it to your story, and syncs the decision back so the Analyst can grade it next run.

The Analyst's *brain* lives in your Cowork chat. The engine and constitution are what make it consistent and grounded. You run it one of two ways.

---

## The one command it runs each night

From the repo folder (`C:\Users\joeym\Documents\prepledger-dev`):

```
node tools/analyst-engine.js --write
```

That regenerates `ledger/analysis.json` and `ledger/suggestions.json` from your latest data. Then the Analyst writes `ledger/brief.md` in its own voice and commits everything back.

---

## Option A — Install into your existing Analyst chat (simplest)

Do this once:

1. Open your nightly Analyst chat in Cowork.
2. Paste the full contents of **`ledger/analyst-constitution.md`** in as its standing instructions (or attach the file and tell it "this is your constitution — follow it every night").

Then each night, tell it: **"Run tonight's brief."** It will:

1. Pull the latest `state.json`,
2. run the engine (`node tools/analyst-engine.js --write`),
3. read `analysis.json`, grade last night's calls,
4. write `ledger/brief.md` in plain voice,
5. curate `ledger/suggestions.json` into the cards you'll see,
6. commit and push.

You open the app, read the brief on NOW, and approve or dismiss the suggestion cards. That's the whole loop.

---

## Option B — Automated Cowork scheduled task (hands-off)

If you'd rather it just happen every morning without you asking:

1. In Cowork, create a **scheduled task** set to run early each day (say 6:00 AM).
2. Give it this instruction: *"Follow `ledger/analyst-constitution.md`. Pull the latest data, run `node tools/analyst-engine.js --write`, write tonight's brief to `ledger/brief.md`, curate `ledger/suggestions.json`, grade yesterday's decisions, then commit and push."*
3. Point it at the repo folder and let it run.

Each morning the brief and fresh cards are already waiting on your NOW tab. You just review and tap Approve or Dismiss. Everything the Analyst does is logged and reversible, and nothing changes your plan until you approve it.

*(Tip: Option A is the easy start — you stay in the loop and can chat with the Analyst about its read. Move to Option B once you trust it and want it fully automatic.)*

---

## What's already set up (you don't need to redo)

- The repo is cloned locally, Node and Git are installed, and your GitHub token is in place — the engine and pushes just work.
- The app is deployed at v3.99.3 with the suggestion cards live.
- Your health data stays private: `/ledger/*` is blocked on the public site, and the app reaches these files only through the authenticated GitHub API.

## Good to know (build notes)

- If you ever rebuild the app yourself, build with the real esbuild binary so React ships in production mode — a plain `npx esbuild ... --define:process.env.NODE_ENV="production"` from PowerShell silently drops the quotes and ships a slower dev build. The repo's build path handles this correctly.
- When you push from PowerShell, disable the credential prompt helper for the command (`git -c credential.helper= push`) so it uses your token instead of hanging on a hidden login popup.
