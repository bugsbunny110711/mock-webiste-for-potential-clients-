@AGENTS.md

## Workflow

The owner has given standing approval to merge to `main` without asking.

Push work to the feature branch, open a PR, and merge it so the change reaches
`main` — Vercel deploys from `main`, so work left on a branch is invisible on
the live site.

CI runs these on every push and pull request (`.github/workflows/ci.yml`), but
run them locally before merging too — waiting on a remote red X is slower than
catching it here:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

**and look at the affected pages in a browser.** CI is a floor, not a ceiling. It
catches what is definitely broken; it cannot see a page that renders blank, a
form that wipes itself, or a tooltip hidden behind a clipping container — all of
which happened here and all of which typechecked, linted and built cleanly. A
broken `main` deploys straight to the live site.

Standing approval covers merging. It does not cover deleting branches, force
pushing, rewriting history, or changing repository settings — ask for those.
