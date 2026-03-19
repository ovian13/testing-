# T1_02 — HOW WE BUILD
> Read before every build session. This is the loop we run every day.

---

## The Daily Loop

```
Vimal writes brief → Ramadass + Ovian load AI context → Build → 
Plain English test → Commit → PR → Vimal merges → Log it
```

Every day. Every feature. Same loop.

---

## VIMAL — Your Daily Job

**Monday:**
1. Open GitHub Projects board
2. Move tasks Backlog → This Week (max 3 per person)
3. Write the build brief using the template in `briefs/TEMPLATE.md`
4. Save brief as `briefs/BRIEF_YYYY-MM-DD_feature-name.md`
5. Post brief link in team chat

**During the week:**
1. Review PRs when Ramadass or Ovian raises them
2. Ask questions in PR comments if anything is unclear
3. Approve and merge when satisfied — you merge, not them
4. Check Wednesday async update

**End of week:**
1. Raise PR: `dev → staging`
2. Ask Ovian to test end to end as a real student
3. Once stable → merge `staging → main`
4. Post last commit hash in chat before merging to main

---

## RAMADASS — Your Daily Job

**Morning:**
```bash
git checkout dev && git pull origin dev
git checkout -b feature/task-name
```
Post in chat: *"Starting feature/task-name today."*
Move board card: This Week → In Progress.

**Build using:**
1. Load your personal context: `T2_ME_RAMADASS.md`
2. Load shared context: `T2_01`, `T2_03`, `T2_04`, `T2_05` as needed
3. Use the prompt from `T1_03_PROMPTS.md` for your feature

**End of day:**
```bash
git add .
git commit -m "feat Area: what it does — status"
git push origin feature/task-name
```

**When feature is complete:**
1. Go to GitHub → Compare & pull request
2. Base branch: `dev` — always dev
3. Fill PR description template (below)
4. Assign Vimal as reviewer
5. Move card: In Progress → In Review
6. Add one row to `logs/AI_BUILD_LOG.md`

---

## OVIAN — Your Daily Job

Same git flow as Ramadass. Your additional responsibilities:

**Community and outreach:**
- Every college or company contact → logged in `logs/OUTREACH_LOG.md` within 24 hours
- Discord presence and moderation (Ramadass and Vimal do not touch this)

**Testing:**
- End of every week — test the staging build as a real student would
- Every bug found → add to `logs/KNOWN_ISSUES.md`

---

## File Ownership — No Conflicts

This is how we never step on each other's code.

**Ramadass owns:**
```
web/src/app/api/**          ← all API routes
web/src/lib/db/**           ← database client
web/src/lib/gamification/** ← XP, streak, badges, scores
web/src/lib/integrations/** ← GitHub, LeetCode
```

**Ovian owns:**
```
web/src/app/(student)/**    ← all student pages
web/src/app/(auth)/**       ← auth pages
web/src/components/**       ← all UI components
mobile/src/**               ← entire Expo mobile app
web/src/app/(company)/**    ← company pages
web/src/app/(college)/**    ← college pages
discord-bot/**              ← Discord bot
```

**Vimal owns:**
```
docs/**                     ← all documentation
web/src/lib/ai/**           ← all AI feature functions
web/src/app/(admin)/**      ← admin pages (Vimal directs, Ovian builds UI)
prisma/schema.prisma        ← schema decisions (Ramadass implements)
```

**Shared — coordinate before touching:**
```
web/src/types/**            ← TypeScript types
web/src/lib/utils/**        ← shared utilities
```

**Rule:** Before touching a shared file, post in chat. Never two people in the same file at the same time.

---

## Before You Open Any AI Tool

1. Read Vimal's brief for today
2. Load your personal file: `docs/ai/personal/T2_ME_[YOUR NAME].md`
3. Load the shared T2 files the brief specifies
4. Paste the session opener (in your personal T2 file)
5. Copy the prompt from `T1_03_PROMPTS.md`
6. Build

**If no brief exists — the session does not start.**

---

## The Three Tests Before Every PR

**Test 1 — Plain English**
Builder explains what they built in 2 sentences to one teammate.
If teammate doesn't understand → code doesn't merge.

**Test 2 — Connection**
Answer these:
- What does this receive as input?
- What does this return or output?
- Who calls this and when?

Any "I'm not sure" → find out before raising PR.

**Test 3 — Security**
Run through `T2_05_STANDARDS.md` security checklist.
Takes 5 minutes. Catches 80% of AI mistakes.

---

## Git — The Commands You'll Actually Use

```bash
# Start of day — always
git checkout dev && git pull origin dev
git checkout -b feature/task-name

# While working
git status                    # what changed
git diff                      # see exact changes

# Save work — end of day
git add .
git commit -m "feat Area: what — status"
git push origin feature/task-name

# After your PR is merged — clean up
git checkout dev && git pull origin dev
git branch -d feature/task-name
```

**If someone merged to dev while you were working:**
```bash
git checkout dev && git pull origin dev
git checkout feature/your-branch
git merge dev
# Fix conflicts if any → git add . → git commit → git push
```

**Undo last commit (before pushing):**
```bash
git reset --soft HEAD~1
```

---

## PR Description Template

```markdown
## What This Does
[One paragraph. Plain English.]

## What It Connects To
[What calls this? What does this call?]

## How to Test It
1.
2.
3. Expected result:

## Known Issues / Not Done Yet
[Be honest.]

## T2 Files Loaded
[Which context files you used]

Closes #[board task number]
```

---

## Commit Message Format

```
[type] Area: What it does — what works / what's pending
```

**Types:** `feat` `fix` `wip` `config` `docs` `style` `refactor`

**Good:**
```
feat QualityGate: AI call and JSON parse — empty string edge case pending
fix Auth: Google OAuth expiry on iOS — Android untested
wip Leaderboard: consistency top 10 renders — campus variant pending
config ENV: EXPO_PUBLIC_ variables added — no values committed
```

**Never:** `update` `fixed` `changes` `WIP` `final` `stuff`

---

## GitHub Projects Board

**Board:** Eakalaiva Official → Projects → Eakalaiva Sprint Board
**Columns:** Backlog → This Week → In Progress → In Review → Done

In your PR description, add `Closes #12` (task number) to auto-move the card to Done on merge.

---

## The Build Brief Template

Vimal fills this. Lives in `briefs/`.

```markdown
# Brief — [DATE] — [FEATURE]

## What Are We Building
[One paragraph. Plain English.]

## Who Builds What
- Ramadass: [specific files/endpoints]
- Ovian: [specific files/components]
- Vimal: [AI prompts / decisions]

## Files Being Touched (no overlap)
- Ramadass: /path/to/file.ts
- Ovian: /path/to/component.tsx

## T2 Files to Load
- Everyone: T2_01, T2_05
- Ramadass: T2_03, T2_04
- Ovian: T2_02

## Prompt to Use from T1_03
[Section name and letter, e.g. "Section B — B3 Quality Gate"]

## Done Looks Like
1. [Specific testable criterion]
2. [Specific testable criterion]
3. [Specific testable criterion]
```

---

## The Rules We Follow On Trust

| Rule | Why |
|---|---|
| Pull dev every morning | Always start from latest code |
| One person per feature branch | Two people = guaranteed conflict |
| PR base is always `dev` | Never accidentally push to main |
| Post in chat when starting a branch | Nobody else touches that area |
| Delete branch after merge | Clean repo |
| Vimal merges all PRs | One gatekeeper, no accidents |
| Vimal posts last commit hash before main push | Always have a rollback point |
