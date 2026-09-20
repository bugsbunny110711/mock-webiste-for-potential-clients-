@AGENTS.md

## Workflow

The owner has given standing approval to merge to `main` without asking.

Push work to the feature branch, open a PR, and merge it so the change reaches
`main` — Vercel deploys from `main`, so work left on a branch is invisible on
the live site.

There is no CI on this repository. Nothing checks a build except the agent doing
the work, so before every merge run, and require passing:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

and look at the affected pages in a browser. A broken `main` deploys straight to
the live site.

Standing approval covers merging. It does not cover deleting branches, force
pushing, rewriting history, or changing repository settings — ask for those.
