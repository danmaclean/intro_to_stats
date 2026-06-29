# NEXT SESSION — current status & what to do next

Live handoff. Update this as work progresses. (Plan = `ROADMAP.md`; durable facts = `MEMORY.md`.)
Last updated: 2026-06-26.

## Where we are
**Phase 2 (webR delivery) pilot — IN PROGRESS; core feasibility PROVEN end-to-end.** Working on book branch `phase2/quarto-live-pilot`. Phase 1 COMPLETE & shipped (itssl `0.1.0`+`0.2.0` merged & tagged; **book PR #24 — renv pin → `v0.1.0` — now MERGED into the trunk**). Phase 0 done (go-live deferred — see ROADMAP "Go-live checklist"). Book lock still pins itssl `v0.1.0` (bump to `v0.2.0` when chapters use the data). Next decision: finish Phase 2 rollout vs Phase 3 vs go-live.

> **Fixed 2026-06-29 — stacked-PR merge gotcha:** itssl #2 was stacked on `phase1/description-audit`; merging it landed its content on that branch, NOT `master` (no auto-retarget after #1 merged via merge-commit), and `v0.2.0` got tagged on the 0.1.0 master commit. Corrected by merging the audit branch into `master` (commit `4590087`) and moving `v0.2.0` there. Lesson in `MEMORY.md`.

### Phase 2 status (started 2026-06-29) — on branch `phase2/quarto-live-pilot`
- **quarto-live added** to the book (`quarto add r-wasm/quarto-live` → `_extensions/r-wasm/live`, committed). Live `{webr}` cells need `format: live-html` + `engine: knitr` + the `_knitr.qmd` include.
- **itssl delivery SOLVED via r-universe.** Created `danmaclean/danmaclean.r-universe.dev` (registry repo, `packages.json` → itssl) + installed the **r-universe GitHub App** (required — without it the universe never builds). r-universe now auto-builds the **WASM binary** on every itssl release, served at `https://danmaclean.r-universe.dev`. quarto-live config: `webr: {packages: [itssl, ...], repos: [https://danmaclean.r-universe.dev, https://repo.r-wasm.org]}`. itssl `0.2.0` WASM is live for **R 4.6** (webR's current R).
- **END-TO-END PROVEN.** Headless webR (`tools/webr-verify/`) installs itssl *from the universe* (deps from r-wasm) and runs the potato analyses — p-values match native (`infection~sulfur` p=0.0061, blight logistic p=0.0163), helper builds a ggplot. Standalone `pilot-webr.qmd` renders with live cells + the universe config baked into the page.
- **Committed on the branch:** the extension, `pilot-webr.qmd` (throwaway pilot — NOT in the book nav, confirmed not in `quarto inspect` inputs so CI ignores it), `tools/webr-verify/`, `.gitignore` updates.
- **TODO next (Phase-2 rollout):** (1) optional belt-and-suspenders: a Playwright in-browser click-through; (2) **integrate live cells into ONE real chapter** end-to-end (pick the chapter; decide format approach — simplest is switch the whole book `format: html` → `live-html`, which is a superset so non-live chapters are unaffected); (3) plan migrating the shinyapps.io exercises → in-page webR; (4) bump book `renv.lock` itssl pin to `v0.2.0` once chapters use the potato data. Pilot proves the path — rollout is incremental.

### Phase 1 status (started 2026-06-26)
- **`itssl` cloned to `/Users/macleand/Desktop/itssl`** (separate repo; same branch/PR discipline as the book). Branch `phase1/description-audit` pushed; **PR `danmaclean/itssl#1` open**; **tag `v0.1.0` pushed** (commit `b455516`). NB: when merging #1, use a merge-commit/FF (not squash) so `v0.1.0` stays reachable from `master`, else re-point the tag.
- **Dependency audit ✅ (committed):** `DESCRIPTION` `Imports` realigned to real usage — dropped 5 unused (`ggthemes`, `gridGraphics`, `multcomp`, `rcompanion`, `readr`), added 3 missing (`tibble`, `knitr`, `tidyselect`); `.Rprofile` build-ignored (it sourced the absent `renv/activate.R` and broke clean install); version `0.0.0.9000`→`0.1.0`. Clean build+install verified; all 30 helpers run.
- **webR feasibility spike ✅ POSITIVE:** full 47-pkg dep closure all present as WASM binaries; headless webR run installed them (~20s) and ran helpers (incl. `fGarch`, ggplot, knitr) — all pass. webR delivery (Phase 2) is unblocked.
- **Book `renv.lock` repointed ✅:** itssl pin moved from raw SHA (`RemoteRef master`) → tag `v0.1.0` (Version `0.1.0`, SHA `b455516`, Imports updated). **Minimal hand-edit** (only the itssl block) — deliberately did NOT run `renv::snapshot()`, which would also prune the pinned recommended pkgs (mgcv/nlme/cluster/…) and churn the lock, broadening the change. Full `quarto render --to html` succeeds against 0.1.0 (regenerated `docs/` discarded). On its own book branch `phase1/pin-itssl-v0.1.0` → **PR `intro_to_stats#24`** into `stabilise/ci-render`.
- **Real data chosen & bundled ✅:** author picked a **small themed "potato plant-pathology family"** (sourced via `agridat`, all real/published; copied into itssl so no runtime agridat dep). Added as documented `data()` objects in **itssl `0.2.0`** (`danmaclean/itssl#2`, stacked on #1):
  - `potato_scab` (Cochran & Cox 1957) → regression (scab~sulfur dose) / t-test / one-way ANOVA — one 32-row table carries the "every test is a slope" spine.
  - `potato_nematode` (van Eeuwijk 1995) → two-way ANOVA + interaction (genotype × nematode population).
  - `potato_blight` (Johnson et al. 1996) → logistic GLM (blight ~ spring weather).
  - Built clean; data + worked models verified. **Gap:** chi-square / log-linear chapters still on toy data (Mendel/voting) — potato-themed contingency set is a possible follow-up.
- **Merges/tags DONE (2026-06-29):** itssl #1 + #2 both merged to itssl `master` (now `0.2.0` with potato data, commit `4590087`); `v0.1.0` and `v0.2.0` tagged correctly and verified to `renv::install` from GitHub with data. (#2's stacked-merge mis-landing was corrected — see gotcha note above.)
- **TODO next (Phase-1 wrap):** repoint book `renv.lock` → `v0.2.0` only when chapters start using the data (Phase 3); for now it stays at `v0.1.0` and book **PR #24** can merge into the integration trunk whenever. Then **Phase 2** (quarto-live/webR pilot — now de-risked) or **Phase 3** (chapters onto potato data) or **go-live**, per author.

---
*(Phase 0 recap below — all safe work complete; only go-live remains.)*

- Group A (reproducibility) ✅ — renv.lock pins R 4.5.3 + renv 1.2.3 + itssl@commit + ~127 pkgs; clean-room restore verified.
- Group B (CI gate) ✅ — `.github/workflows/render.yml`, verified green-on-clean / red-on-error.
- Group C1 (publish) ✅ — `.github/workflows/publish.yml` builds to `gh-pages`; **live Pages source still `master:/docs` (untouched)**. C2/C3 deferred.
- Group D (bug fixes) ✅ — #12–#18 all done. RNG audit (#17): book is deterministic, **no `set.seed` needed**; fixed a stale ch.2 intercept (10.6495→10.4695).

## Branch model & policy (IMPORTANT)
- **`master` = the live site** (GitHub Pages `master:/docs`) and is **FROZEN** — do not merge to it until the deliberate go-live.
- **`stabilise/ci-render` = the integration branch / trunk** we work from. It now carries the canonical `.claude/` docs + `CLAUDE.md`. Branch new work off it; PR back into it (not master).
- The CI render gate runs on every non-master push, so feature branches are still checked.
- Note: `master` still has the OLD state (stub renv.lock, committed docs/, no CI) — that's expected; the improvements live on the integration branch until go-live.

## Open PRs
**Book** (`danmaclean/intro_to_stats`, base `stabilise/ci-render`): #19 renv (draft) · #20 CI (draft) · #21 trivial fixes · #22 ch.7/ch.2 · #23 publish (C1) — the Phase-0 stack, merge bottom-up at go-live (non-default base ⇒ close referenced issues manually). **#24 renv pin → itssl v0.1.0 — MERGED** into the trunk. Phase-2 PR (`phase2/quarto-live-pilot`) pending.
**itssl** (`danmaclean/itssl`): **#1** (0.1.0 audit) + **#2** (0.2.0 potato data) — both **MERGED**; `master` at `0.2.0` (`4590087`); tags **`v0.1.0`** and **`v0.2.0`** pushed & verified. ✅ done.

## Next options (pick one)
Phase 2 feasibility is **proven**; the rest of Phase 2 is rollout. Choices:
1. **Finish Phase 2 rollout** (continue on `phase2/quarto-live-pilot`): integrate live `{webr}` cells into ONE real chapter end-to-end (decide format approach — simplest: whole book `format: live-html`), then plan the shinyapps→webR exercise migration. See ROADMAP Phase 2.
2. **Phase 3 — content**: rewrite chapters onto the bundled potato data (replaces PlantGrowth/chickwts/txhousing). Open sub-question: whether to add a **potato-themed contingency dataset** so chi-square/log-linear leave toy data too. See ROADMAP Phase 3.
3. **Go-live** (whenever ready): execute the ROADMAP "Go-live checklist" (merge stack, flip Pages to gh-pages, drop docs/, switch publish trigger). Decide whether to also repoint the book lock to `v0.2.0` first.

## Environment / gotchas
See `MEMORY.md` (shell/permission conventions, gh PAT can't rerun workflows, zsh quirks). Reminder: the user once pasted a GitHub PAT in chat — suggest rotating it if not already done.
