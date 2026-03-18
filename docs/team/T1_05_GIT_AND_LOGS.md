# T1_05 — GIT WORKFLOW & LOG TEMPLATES
> Type 1 — Human Reference. Git rules + every log template the team needs.

---

## PART 1 — GIT WORKFLOW

### Branch Structure
```
main        → production only. Auto-deploys to Vercel + EAS. Never push directly.
staging     → tested features ready for production review
dev         → active development. All builders work here.
feature/*   → individual features. Always branch FROM dev.
fix/*       → bug fixes. Branch FROM dev.
hotfix/*    → critical production fixes. Branch FROM main. Merge to main AND dev.
```

### The Flow
```
feature/your-feature
    → dev (PR required)
        → staging (Vimal approves)
            → main (all three agree, or urgent with 2/3)
```

---

### Commit Message Format
```
[type] Area: What it does — what works / what's pending
```

**Types:**
| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `wip` | Work in progress |
| `refactor` | Restructure, no new functionality |
| `style` | UI/CSS changes only |
| `docs` | Documentation only |
| `config` | Environment, deps, config |
| `test` | Tests added or fixed |
| `chore` | Cleanup, remove dead code |

**Good commits:**
```
feat Leaderboard: consistency top 50 — renders, cached 5min / campus variant pending
fix Auth: Google OAuth mobile token expiry — was failing on iOS background refresh
wip QualityGate: AI call works — JSON parsing edge case not handled yet  
config ENV: EXPO_PUBLIC_ variables added — no values committed
feat Profile: GitHub graph embedded — shows last 90 days / error state missing
docs T2_03: updated User model with freeze_day_used_at field
```

**Bad commits (never):**
```
update, fixed, WIP, changes, final, FINAL v2, Ramadass stuff, trying something
```

---

### Pull Request Template
Every PR must include this. PRs without it are sent back without review.

```markdown
## What This Does
[One paragraph, plain English — no jargon]

## What It Connects To
[What calls this? What does this call?]

## How to Test It
1. [Step one]
2. [Step two]
3. [Expected result]

## Security Checklist
- [ ] No hardcoded credentials
- [ ] Input validated server-side
- [ ] No sensitive data in response
- [ ] Auth check present on protected routes
- [ ] Ran T2_06_SECURITY_RULES.md checklist

## AI Tools Used
[Which tool, which files it touched]

## Known Issues / Not Yet Done
[Be honest]

## T2 Files Loaded
[Which context files were loaded in the AI session]
```

---

### .gitignore
```
# Environment
.env
.env.local
.env.development
.env.production
.env.staging
.env.*.local

# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
.next/
out/
dist/
build/

# Expo
.expo/
dist/
web-build/
ios/
android/

# Prisma
prisma/migrations/dev*

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db
*.swp

# IDE
.vscode/settings.json
.idea/
*.suo
*.user

# Test
coverage/
.nyc_output/

# Eakalaiva — never commit
docs/logs/AI_BUILD_LOG_local.md
docs/briefs/DRAFT_*.md
```

---

### Emergency Rollback
```bash
# Find last working commit
git log --oneline -15

# Soft revert (keeps changes staged)
git revert [commit-hash]

# Hard reset staging to known-good commit (careful)
git reset --hard [commit-hash]
git push --force-with-lease origin staging
```

**Rule:** Before every production push — post the last working commit hash in team chat. Always have a rollback written down.

---

## PART 2 — BUILD BRIEF TEMPLATE

Vimal fills this before every build session. Lives in `/docs/briefs/`.

```markdown
# Build Brief — [DATE] — [FEATURE NAME]
Filed by: Vimal

## What Are We Building?
[One paragraph. Plain English. What it is and why it exists.]

## Context Files for AI
Load these before starting:
- [ ] T2_01_PROJECT_CONTEXT.md
- [ ] T2_02_TECH_ARCHITECTURE.md (if structural)
- [ ] T2_03_DATABASE_SCHEMA.md (if DB work)
- [ ] T2_04_API_CONTRACTS.md (if API work)
- [ ] T2_05_CODE_STANDARDS.md (always)
- [ ] T2_06_SECURITY_RULES.md (always)
- [ ] T2_07_FEATURE_SPECS.md (if platform feature)

## What Does It Connect To?
[What existing feature calls this? What does this call?]

## What Does Done Look Like?
1. [Specific, testable criterion]
2. [Specific, testable criterion]
3. [Specific, testable criterion]
If you can't write 3 — the feature isn't defined yet. Stop and define it.

## Explicitly Out of Scope
[Things AI will try to add that we don't want yet.]

## Who Builds What
- Ramadass:
- Ovian:
- Vimal:

## Files Expected to Be Created or Changed
[List them. Prevents two people touching the same file.]

## Estimated Time
[Sessions / hours]

## Prompt from T1_03 to use
[Link to the relevant section in T1_03_PROMPT_PLAYBOOK.md]
```

---

## PART 3 — LOG TEMPLATES

Copy each log file below into `/docs/logs/` at project start. Update continuously.

---

### AI_BUILD_LOG.md
```markdown
# AI Build Log — Eakalaiva
> Add one row after every vibe coding session. No exceptions.

| Date | Builder | Feature | Files Touched | AI Tool | Status | Known Issues |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | Name | Feature name | /path/to/file.ts | Cursor / Claude / etc | ✅ Done / 🔄 WIP / ❌ Broken | Description |
```

**Status:** ✅ Done | 🔄 WIP | ❌ Broken | 🧪 Needs Testing

---

### INCIDENT_LOG.md
```markdown
# Incident Log — Eakalaiva

## INC-[NUMBER]
**Date:**
**Reported by:**
**What broke:**
**Where:** (page / endpoint / feature)
**Impact:** (students affected, data lost?)
**Root cause:**
**Which AI session caused it:** (check AI_BUILD_LOG)
**Fix applied:**
**Prevention going forward:**
**Status:** Open / Resolved
```

---

### DECISION_LOG.md
```markdown
# Decision Log — Eakalaiva
> Every team decision that affects the product, tech, or team structure.

## DEC-[NUMBER] — [Title]
**Date:**
**Decision:**
**Why:**
**Alternatives considered:**
**Decided by:** (all three / majority / Vimal as product owner)
**Overriding this requires:** (all three agree / majority / Vimal alone)
**Impact on timeline:**
```

---

### WEEKLY_REVIEW.md
```markdown
# Weekly Review — Week [N] — [DATE]

## What Shipped
| Task | Owner | Notes |
|---|---|---|

## What Didn't Ship
| Task | Owner | Reason | Moves forward? |
|---|---|---|---|

## Risk Watchlist
- [ ] Vimal on product thinking (not just managing)?
- [ ] Ramadass had code review this week?
- [ ] Ovian's task load balanced with Ramadass's?
- [ ] Equity/salary conversation done? (must be done by Week 4)
- [ ] Task board current with one owner per task?

## One Honest Thing Each
**Vimal:**
**Ramadass:**
**Ovian:**

## Next Week — 3 Tasks Per Person
| Task | Owner | Done = |
|---|---|---|
| | Vimal | |
| | Vimal | |
| | Vimal | |
| | Ramadass | |
| | Ramadass | |
| | Ramadass | |
| | Ovian | |
| | Ovian | |
| | Ovian | |
```

---

### KNOWN_ISSUES.md
```markdown
# Known Issues — Eakalaiva

| ID | Area | Description | Severity | Found by | Status |
|---|---|---|---|---|---|
| BUG-001 | | | High/Medium/Low | | Open/In Progress/Fixed |

**Severity:**
High = breaks core student flow
Medium = workaround exists, degrades experience
Low = cosmetic or edge case
```

---

### OUTREACH_LOG.md
```markdown
# Outreach Log — Eakalaiva
> Ovian owns all rows. Update within 24 hours of any contact.

## Colleges
| College | Contact | Method | Date | Response | Next Step |
|---|---|---|---|---|---|

## Companies
| Company | Contact | Role | Method | Date | Response | Next Step |
|---|---|---|---|---|---|---|

## Targets
- Month 1: 2 colleges replied + 1 company interested
- Month 2: 1 college partnership signed + 1 company subscribed
- Month 3: 5 colleges + 3 companies

## Notes
```

---

### EQUITY_AND_COMP.md (Fill before Week 4 — private document)
```markdown
# Equity & Compensation Agreement — Eakalaiva
> Discussed and agreed before [DATE]. All three founders sign off.
> This is not a legal document — it is a team agreement. Get a legal document made before any funding.

## Equity Split
- Vimal: ___%
- Ramadass: ___%
- Ovian: ___%

## Vesting
- Vesting period: ___ months
- Cliff: ___ months
- What happens if a founder leaves before cliff:
- What happens if a founder leaves after cliff:

## Stipend Plan
- Current state: no stipend / [amount] from [milestone]
- Trigger for first stipend: [first revenue / first funding / milestone X]
- Amount: [equal split / needs-based / TBD]

## Decisions About Decisions
- Who can add a fourth co-founder:
- Who can accept investment:
- Who can hire the first paid employee:

## Signed
- Vimal: ___ Date: ___
- Ramadass: ___ Date: ___
- Ovian: ___ Date: ___
```
