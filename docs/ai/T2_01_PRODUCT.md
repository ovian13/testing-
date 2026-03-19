# T2_01 — PRODUCT
> Load in every session. This is what Eakalaiva is and every rule that governs it.

---

## What It Is

Free skill-tracking and opportunity platform for Tamil Nadu engineering students from tier-2 and tier-3 colleges. Tamil Nadu has 1,277+ engineering colleges — fewer than 30 get campus recruitment. Eakalaiva makes skill visible where college name cannot.

One-liner: *If you cannot change the college you came from, change what you can prove.*

---

## Decision Filter

Every feature, endpoint, component, line of code:
> **Does this close the gap or widen it?**

If a feature benefits paying tier-1 students more than free tier-3 students — reject it.

---

## Users

**Students** — Always free. All features. No premium tier. No exceptions.
- Specialist: 6–12 month deep mastery track
- Rusher: 2–3 month job-ready track  
- Explorer: 2–4 week direction-finding track

**Companies** — Monthly subscription. Post jobs, search verified talent. Cannot see student personal data (email, phone) — public profile data only.

**Colleges** — Annual partnership. Student dashboards, NAAC data, placement analytics. Cannot see individual submission content.

**Admins** — Full platform management, AI prompt editing, moderation.

---

## Five Platform Stages

1. **Clarity (Day 1):** One-time AI onboarding. Runs once only. Assigns roadmap.
2. **Direction (Week 1–4):** Student explores and chooses roadmap.
3. **Growth (Ongoing):** Daily AI tasks. Max 3/day. Count only if quality gate passes.
4. **Proof (Continuous):** Every verified step saved to public profile. GitHub + LeetCode live.
5. **Opportunity (When Ready):** Company jobs matched to verified student profiles.

---

## Three Scores

**Consistency Score:** daily_streak_factor (40%) + weekly_completion_rate (40%) + ai_task_engagement (20%)

**Depth Score:** proof_per_step (50%) + peer_validations_received (30%) + resource_quality (20%)

**Proof Score:** github_commit_depth (40%) + projects_completed (30%) + external_wins (30%)

All scores convert to percentiles within each roadmap type. Cross-roadmap fair.

---

## Four Leaderboards

1. Consistency — longest active streaks, college independent
2. Specialist — top per roadmap domain
3. Rising Stars — highest 30-day XP growth
4. Campus — top student per college (most viral — WhatsApp screenshot drives signups)

Minimum 7 days activity to appear on any leaderboard.

---

## Gamification Rules

- XP releases only after verification gate passes. No gate = no XP. Non-negotiable.
- GitHub-linked project = 3× XP vs theory step.
- Streak multipliers: 7d=1.1×, 30d=1.25×, 60d=1.5×, 90d=2.0×
- Miss one day → streak resets, multiplier drops.
- One freeze day per 30-day period. Student activates before midnight.
- Monthly quest completion required for multiplier bonus that month.

---

## Anti-Cheat — Enforce These in All Code

| Attack | Detection | Response |
|---|---|---|
| Spam-completing steps | AI quality gate every submission | Below threshold = not counted |
| AI-generated submissions | AI output pattern scanner | Flagged → peer review → mod warning |
| Peer approval farming | Relationship graph | Mutual-only approvals frozen → mod |
| Account sharing | Device/IP anomaly detection | Re-verification task → mod if failed |
| Timezone gaming | UTC server timestamps only | No exception path |
| Empty GitHub repos | GitHub API commit depth check | Single-commit/empty rejected |

---

## Business Model

| Who | Pays | Gets |
|---|---|---|
| Students | Free always | Everything — all features |
| Companies | Monthly subscription | Talent search, job posting |
| Colleges | Annual partnership | Dashboards, NAAC data, analytics |

---

## Non-Negotiables — Enforce in Every Line of Code

1. Students pay nothing. Ever. For anything.
2. All timestamps server-side UTC. Client time never trusted.
3. No XP without cleared verification gate.
4. No credentials hardcoded — environment variables always.
5. No sensitive student data (email, phone) visible to companies or colleges.
6. Onboarding runs exactly once per student — enforce server-side.
7. Roadmap change only once per 30 days — enforce server-side.
8. Leaderboards: only students with 7+ days activity.
9. All AI prompts loaded from DB — never hardcoded.
10. All timestamps from server `new Date()` — never from client request body.

---

## Community

Discord bot bridges real-time social to platform DB.
Key channels: #post-your-progress, #verified-wins, #hackathons-jobs, #weekly-rankings, roadmap-specific channels.
/verify command → bot checks DB → assigns role → unlocks channels.
