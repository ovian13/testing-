# T2_01 — PROJECT CONTEXT
> Type 2 — AI Reference. Load this at the start of every session.
> This file tells the AI what Eakalaiva is and how every decision must be filtered.

---

## What Eakalaiva Is

Eakalaiva is a free skill-tracking and opportunity platform for Tamil Nadu engineering students from tier-2 and tier-3 colleges. It is built to close the gap between high-tier and low-tier colleges by making skill visible where pedigree cannot speak.

**One-liner:** If you cannot change the college you came from, change what you can prove.
**Three words:** Prove. Grow. Rise.

Tamil Nadu has 1,277+ engineering colleges. Fewer than 30 get consistent campus recruitment attention. The remaining 1,240+ are invisible — not because students lack skill, but because no credible signal exists for recruiters to evaluate them. Eakalaiva creates that signal.

---

## The One Decision Filter

Every feature, endpoint, component, and line of code must serve this:

> **Does this close the gap or widen it?**

If a feature would benefit a paying tier-1 student more than a free tier-3 student — it widens the gap. Do not build it.

---

## User Types

### Students (Primary — Always Free)
- Tier-2 and tier-3 Tamil Nadu engineering college students
- All features, all roadmaps, AI companion, verified profile, opportunities — free forever
- No premium tier. No exceptions. No upsell anywhere.
- Three sub-types: Specialist (6–12 month mastery), Rusher (2–3 month job-ready), Explorer (2–4 week direction-finding)

### Companies (Revenue — Monthly Subscription)
- Post jobs and hackathons
- Search verified talent across 1,277+ colleges
- Filter by roadmap, skill, scores
- Cannot access student personal data (email, phone) — public profile data only

### Colleges (Revenue — Annual Partnership)
- View student progress dashboards
- Get placement analytics and NAAC-ready data
- Campus leaderboard branding
- Cannot view individual student submission content

### Admins (Internal)
- Full platform management
- AI prompt editing without code changes
- Moderation and anti-cheat review
- Analytics

---

## The Five Platform Stages

**Stage 1 — Clarity (Day 1):** One-time AI onboarding session. Runs once only. Assigns roadmap.

**Stage 2 — Direction (Week 1–4):** Student completes exploration and chooses one main roadmap.

**Stage 3 — Growth (Ongoing):** Daily AI-generated tasks. Streak system. Max 3 AI tasks per 24 hours. Tasks only count if they pass AI quality check.

**Stage 4 — Proof (Continuous):** Every verified step, project, activity saved to public profile. GitHub and LeetCode linked live. Peer-reviewed completions. All recorded and verified.

**Stage 5 — Opportunity (When Ready):** Companies post jobs. Platform matches to each student's verified roadmap and skill level.

---

## The Three Scores

**Consistency Score** — Are you showing up every day?
- Tracked via daily streak, weekly task completion rate, AI task engagement.

**Depth Score** — Are you going deeper, not just ticking boxes?
- Tracked via proof per step, resource approvals, peer validations received.

**Proof Score** — Can you show real output?
- Tracked via GitHub repos, projects, hackathon wins, open source, internships.

**Cross-roadmap fairness:** Scores convert to percentiles within each roadmap. A tier-3 student with high consistency can outrank anyone.

---

## The Four Leaderboards

1. **Consistency Board** — Longest active streaks. College and path independent.
2. **Specialist Board** — Top performers within each roadmap domain.
3. **Rising Stars Board** — Highest growth velocity over 30 days.
4. **Campus Board** — Top student per college. Most viral — one real student sharing this converts an entire college.

---

## Gamification — Core Rules

- XP is earned only after verification gate clears. No gate = no XP. Non-negotiable.
- XP weighted: GitHub-linked project = 3× a theory step.
- Streak increments only on UTC midnight boundary — server-side only, client time never trusted.
- Streak multipliers: 7 days +10%, 30 days +25%, 60 days +50%, 90 days +100%.
- Miss one day = streak resets, multiplier drops. One freeze day allowed per 30-day period.
- Monthly quest completion is prerequisite for streak multiplier bonus that month.

---

## Anti-Cheat — Non-Negotiable Rules

| Attack | Detection | Response |
|---|---|---|
| Spam-completing steps | AI quality gate on every submission | Below threshold = not counted |
| AI-generated submissions | AI output pattern scanner | Flagged → peer review → moderator warning |
| Peer approval farming | Relationship graph analysis | Mutual-only approvals frozen → moderator |
| Account sharing | Device/IP/behavioral anomaly | Re-verification task → moderator if failed |
| Timezone/clock gaming | UTC server timestamps only | No exception path |
| Empty GitHub repos | GitHub API checks commit depth | Single-commit/empty repos rejected |

---

## Business Model

| Who | Gets | Pays |
|---|---|---|
| Students | Everything — all features | Free. Always. |
| Companies | Talent search, job posting | Monthly subscription |
| Colleges | Dashboards, analytics, NAAC data | Annual partnership |

Additional: Hackathon / opportunity listing fees paid by organisers.

---

## Platform Non-Negotiables (Enforce These in All Code)

1. Students pay nothing. Ever. For anything. No exceptions.
2. All timestamps server-side UTC. Client time never trusted.
3. No XP without a cleared verification gate.
4. Gamification exists to reward real work only.
5. Every feature: does this close the gap or widen it?
6. No credentials hardcoded — environment variables always.
7. No sensitive student data (email, phone) visible to companies or colleges.
8. Onboarding runs exactly once per student — enforce server-side.
9. Roadmap type can only be changed once per 30 days — enforce server-side.
10. Leaderboards show only students with minimum 7 days activity — prevents gaming.

---

## Community (Discord)

Discord handles real-time social infrastructure. A bot bridges Discord activity to the platform database.

Key channels: #post-your-progress, #verified-wins, #hackathons-jobs, #weekly-rankings, roadmap-specific channels.

Bot rules: Non-verified users see only #announcements. `/verify username` → bot checks DB → assigns roadmap role → unlocks channels.

---

## The Moat (Why This Cannot Be Copied Quickly)

- Student profiles with years of verified activity — time cannot be faked
- Campus network effect across 1,277+ colleges — self-accelerating via WhatsApp screenshots
- Gap-crossing success stories — first real hire from a tier-3 college via Eakalaiva
- Tamil Nadu identity — regional pride, cannot be manufactured
- Community trust — peer validation reputation built over years
