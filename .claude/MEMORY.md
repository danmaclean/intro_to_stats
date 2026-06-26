# MEMORY — durable facts & working conventions

Committed, in-repo memory (travels with the branch). Durable preferences, conventions, and project facts that aren't the plan (`ROADMAP.md`) or the live status (`NEXT-SESSION.md`). Keep entries durable — not session chatter.

## Who / working style
- **Author:** Dan MacLean (maclean.daniel@gmail.com), TSL Bioinformatics. Sole maintainer; the book is a live, in-use course handbook.
- **Planning:** when planning, expand scope into a phased roadmap covering all viable goals rather than narrowing to one. Prefer open discussion; reserve multiple-choice questions for genuine decision forks, not "did I capture this right". (A single-goal multiple-choice framing was rejected.)
- **Live-site caution:** the published site is mission-critical; the user is deliberately conservative about anything that changes what readers see. Confirm before live-facing changes.

## Shell / permission conventions
- **Don't prepend `export PATH="/opt/homebrew/bin:$PATH"`** to Bash calls — the tool already inherits the full login PATH (gh, git at /usr/bin, Rscript & quarto at /usr/local/bin all resolve). The prefix was a leftover habit that caused repeated "export …" permission prompts.
- **Don't wrap R code in bash variable assignments** (e.g. `SCRIPT='... y~x ...'`) — a `~` (R formula) in an assignment value trips a tilde-expansion permission flag and forces a prompt. Pass R directly via `Rscript -e '...'` (single-quoted). Avoid heredocs.
- **Permission allowlist** lives in `.claude/settings.local.json` (personal, gitignored): export/cd/git/gh/Rscript/quarto/python3 + common read-only utils. **Gotcha:** editing that file mid-session is inert until the user reloads (`/config` or restart); until then, every "always allow" click re-serializes the in-memory ruleset over external edits. Destructive commands (rm, mv) still prompt by design.
- **Compound `&&` chains are all-or-nothing for permissions:** if ANY segment isn't allowlisted, the whole chain prompts even when the other segments are allowed. A leading `cd` was the usual culprit (now allowlisted) — but prefer absolute paths / `git -C` / explicit clone destinations over `cd` anyway, and keep chains to allowlisted commands.
- **`GITHUB_PAT`:** set `export GITHUB_PAT=$(gh auth token)` only for commands that need it (renv installing/restoring the GitHub-sourced `itssl`).
- **zsh gotchas:** `status` is read-only (don't use as a loop var); brace `${var}` before a `:` (modifier clash, e.g. `${commit}:refs/...`); quote URLs containing `?` (glob).
- **gh:** installed via Homebrew, authed as `danmaclean` (keyring). The PAT in use **cannot rerun workflows** (no Actions:write) — re-trigger via an empty commit push instead.

## Project facts (not obvious from code)
- **`itssl` is external** (`danmaclean/itssl`), not in this repo — it holds the `its_*_time()` helpers and (post-Phase-1) will hold real data. Cloned for Phase-1 work at `/Users/macleand/Desktop/itssl` (use same feature-branch→PR discipline as the book; PRs go into `itssl`'s own `master`). It is pure-R (no `src/`). RNG seeding is only *partial* — `its_random_xy_time`/`its_mendel_data_time`/`its_food_data_time` `set.seed`, but several illustrative-plot helpers don't; the book still renders deterministically because prose only quotes values from the seeded/deterministic sources. Fixes to helper behaviour belong in that repo, not here.
- **webR feasibility is CONFIRMED (Phase-1 spike, 2026-06-26):** `itssl`'s full 47-package transitive dependency closure is 100% available as WASM binaries on repo.r-wasm.org (incl. compiled `fGarch`, `scatterplot3d`, `cowplot`), and a headless webR run installed them + ran the helpers successfully. So Phase 2 (in-page webR via `quarto-live`) has no dependency blocker. NB: webR uses its *own current* WASM binary versions, which will differ from the book's pinned `renv.lock` versions — browser repro and `renv` repro are separate tracks.
- **Fixed product constraints** (full detail in `ROADMAP.md`): audience is always the absolute-beginner biologist; course time is tight (ration content); GitHub Pages static hosting (client-side interactivity only); the "every test is a slope in a linear model" thesis is the identity.
- **Code & prose style** are deliberate and documented in `CLAUDE.md` — match them.
