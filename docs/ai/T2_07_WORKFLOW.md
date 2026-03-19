# T2_07 — GIT & WORKFLOW
> Load when generating any file, branch name, commit message, or PR description.

---

## Team

| Person | Role | Owns in codebase |
|---|---|---|
| Vimal | Compass — briefs, decisions, merges, AI functions | `docs/`, `web/src/lib/ai/`, `web/src/app/(admin)/`, schema decisions |
| Ramadass | Engine — backend, API, DB, integrations, gamification | `web/src/app/api/`, `web/src/lib/db/`, `web/src/lib/gamification/`, `web/src/lib/integrations/` |
| Ovian | Bridge — all UI, mobile, Discord, community | `web/src/app/(student)/`, `web/src/app/(auth)/`, `web/src/components/`, `mobile/src/`, `discord-bot/` |

---

## Branch Rules

```
main      → production. Only Vimal merges. Never push directly.
staging   → tested. Only Vimal merges. Never push directly.
dev       → daily work. Feature branches merge here via PR.
feature/* → individual work. Branch from dev. One person per branch.
fix/*     → bug fixes. Same flow.
hotfix/*  → critical prod fix. Branch from main. Merge to main AND dev.
```

**Never suggest:** pushing directly to main/staging/dev, merging own PR, force push on shared branches.

---

## Commit Format

```
[type] Area: What it does — what works / what's pending
```

Types: `feat` `fix` `wip` `config` `docs` `style` `refactor` `test` `chore`

**Good:**
```
feat QualityGate: AI call and JSON parse — empty string edge case pending
fix Auth: Google OAuth expiry on iOS — Android untested
wip Leaderboard: consistency top 10 renders — campus variant pending
config ENV: EXPO_PUBLIC_ variables added — no values committed
```

**Never generate:** `update` `fixed` `changes` `WIP` `final` `stuff` `misc`

---

## PR Description Format

```markdown
## What This Does
[One paragraph plain English]

## What It Connects To
[What calls this? What does this call?]

## How to Test It
1. Step
2. Step
3. Expected result:

## Known Issues / Not Done Yet
[Honest list]

## T2 Files Loaded
[Which context files used]

Closes #[task number]
```

Base branch: always `dev`. Reviewer: always Vimal. Never self-merge.

---

## File Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `LeaderboardTable.tsx` |
| Utils / lib | camelCase | `xpCalculator.ts` |
| Next.js API | `route.ts` in folder | `api/tasks/submit/route.ts` |
| Expo screens | PascalCase | `DashboardScreen.tsx` |
| Brief files | `BRIEF_YYYY-MM-DD_name` | `BRIEF_2026-03-20_quality-gate.md` |

---

## GitHub Projects Board

Board: Eakalaiva Official → Projects → Eakalaiva Sprint Board
Columns: Backlog → This Week → In Progress → In Review → Done

Include `Closes #[number]` in PR description to auto-move card on merge.

Task title format: `[type] Area: what it does`
Example: `feat: Build consistency leaderboard API`

Each task: exactly one assignee. Never two.

---

## What AI Must Never Suggest

- Pushing to main/staging/dev directly
- Merging own PR
- `git push --force` on shared branches
- Skipping PR "because it's a small change"
- Two people on same branch simultaneously
- Committing `.env` or any real credentials
- New library not in T2_02 stack without flagging it
- Branching from main instead of dev
