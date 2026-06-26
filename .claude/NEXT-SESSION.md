# NEXT SESSION — current status & what to do next

Live handoff. Update this as work progresses. (Plan = `ROADMAP.md`; durable facts = `MEMORY.md`.)
Last updated: 2026-06-26.

## Where we are
Executing **Phase 0 (Stabilise)** of `ROADMAP.md`. **All safe Phase-0 work is done**; only the deliberate go-live steps remain (see ROADMAP "Go-live checklist").

- Group A (reproducibility) ✅ — renv.lock pins R 4.5.3 + renv 1.2.3 + itssl@commit + ~127 pkgs; clean-room restore verified.
- Group B (CI gate) ✅ — `.github/workflows/render.yml`, verified green-on-clean / red-on-error.
- Group C1 (publish) ✅ — `.github/workflows/publish.yml` builds to `gh-pages`; **live Pages source still `master:/docs` (untouched)**. C2/C3 deferred.
- Group D (bug fixes) ✅ — #12–#18 all done. RNG audit (#17): book is deterministic, **no `set.seed` needed**; fixed a stale ch.2 intercept (10.6495→10.4695).

## Branch model & policy (IMPORTANT)
- **`master` = the live site** (GitHub Pages `master:/docs`) and is **FROZEN** — do not merge to it until the deliberate go-live.
- **`stabilise/ci-render` = the integration branch / trunk** we work from. It now carries the canonical `.claude/` docs + `CLAUDE.md`. Branch new work off it; PR back into it (not master).
- The CI render gate runs on every non-master push, so feature branches are still checked.
- Note: `master` still has the OLD state (stub renv.lock, committed docs/, no CI) — that's expected; the improvements live on the integration branch until go-live.

## Open PRs (all into the integration line; merge at go-live, bottom-up)
- #19 renv pinning (draft) · #20 CI gate (draft) · #21 trivial fixes · #22 ch.7/ch.2 fixes · #23 publish workflow (C1).
- Non-default base ⇒ referenced issues won't auto-close; close manually on merge.

## Next options (pick one)
1. **Phase 1 — modernise `itssl`** (recommended next; the enabler for webR + real data): versioned/tagged releases, webR/WASM compatibility spike, bundle real biology dataset(s), audit helpers. See ROADMAP Phase 1.
2. **Go-live** (whenever the user is ready): execute the ROADMAP "Go-live checklist" (merge stack, flip Pages to gh-pages, drop docs/, switch publish trigger).

## Environment / gotchas
See `MEMORY.md` (shell/permission conventions, gh PAT can't rerun workflows, zsh quirks). Reminder: the user once pasted a GitHub PAT in chat — suggest rotating it if not already done.
