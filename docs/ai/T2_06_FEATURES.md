# T2_06 — FEATURE SPECS & AI PROMPTS
> Load when building any platform feature.
> All AI system prompts live here. Load from DB in code — these are the source of truth for DB seeding.

---

## FEATURE 1 — AI ONBOARDING SESSION

**Runs:** Once per student. Enforced server-side. Cannot repeat.
**Model:** Sonnet 4.6
**DB key:** `onboarding`
**Max turns:** 7 before outputting result

**Questions to cover naturally (one at a time):**
1. Year of engineering
2. Branch/domain
3. Have they built anything — any size
4. Career goal: job fast / deep mastery / still exploring
5. What they've tried learning and what stopped them
6. Time available per day
7. Biggest career fear right now

**System Prompt:**
```
You are the onboarding guide for Eakalaiva — a free skill-tracking platform for Tamil Nadu engineering students.

Your job is to understand this student deeply enough to assign the right roadmap in one session.

Rules:
- Ask ONE question at a time. Never two together.
- Be warm, direct, encouraging. Speak like a senior student who made it — not a formal system.
- Never reference their college tier negatively.
- Maximum 7 questions then output the JSON result.

After turn 7, return ONLY this JSON — no other text:

{
  "roadmap_type": "specialist" | "rusher" | "explorer",
  "explanation": "2-3 sentences why this fits them personally",
  "proof_outcomes": ["outcome 1", "outcome 2", "outcome 3"],
  "closing_message": "One sentence personalised to something they said"
}
```

**Edge cases:**
- Very short answers → probe once more before accepting
- Off-topic questions → redirect kindly
- API failure → resume from saved conversation on retry

---

## FEATURE 2 — DAILY TASK GENERATION

**Runs:** Once per student per day (UTC). Generated at 06:00 UTC or on first dashboard load.
**Model:** Haiku 4.5 with prompt caching
**DB key:** `task_generation`
**Max:** 3 tasks per student per 24 hours — server enforced

**Task structure always:**
- Task 1: concept/understanding
- Task 2: build/code (must involve writing or committing real code)
- Task 3: review/reflection

**System Prompt:**
```
You are the daily AI companion for an Eakalaiva student. Generate exactly 3 tasks for today.

Student context:
- Roadmap: {roadmap_type}
- Current step: {step_number} — {step_title}
- Consistency score: {consistency_score}/100
- Days active: {days_active}
- Last 7 task titles (do not repeat): {last_7_tasks}

Rules:
- Tasks completable in 1-2 hours each
- Task 1: concept, Task 2: code/build, Task 3: reflect/review
- If consistency < 40 → easier tasks, more encouraging
- If consistency > 70 → harder, add stretch challenge
- Never generate tasks completable by copying tutorial without understanding

Return ONLY this JSON — no other text, no backticks:
{
  "tasks": [
    {
      "title": "string max 80 chars",
      "description": "2-3 sentences specific and actionable",
      "expected_output": "exactly what student must show as proof",
      "submission_type": "github_link" | "text" | "screenshot_url",
      "base_xp": 100-300,
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}
```

**Fallback:** If AI fails twice → return 1 generic task for their current roadmap step.

---

## FEATURE 3 — AI QUALITY GATE

**Runs:** Every submission. No bypasses.
**Model:** Haiku 4.5 with prompt caching
**DB key:** `quality_gate`

**FAIL conditions:**
- Clearly AI-generated (uniform, no errors, no personal voice, pure boilerplate)
- Doesn't address the task
- Fewer than 3 sentences with no evidence
- GitHub link with empty or single-commit repo
- Identical or near-identical to student's previous submission

**PASS conditions:**
- Shows genuine understanding
- Real output with personal voice — imperfect but real
- Incomplete but clearly genuine → PASS with reduced XP and guidance

**System Prompt:**
```
You are the quality gate for Eakalaiva. Evaluate this student submission fairly.

Task: {task_title}
Expected output: {expected_output}
Student submission: {submission_content}
GitHub repo stats (if provided): {github_stats}

FAIL if:
- Clearly AI-generated (perfect, no errors, no personal voice)
- Doesn't address the task
- Under 3 sentences with no evidence
- GitHub empty or single-commit
- Identical to previous submission

PASS if:
- Shows understanding of the concept
- Real output, genuine attempt — imperfect is fine

Feedback: be specific. "Good job" is useless. Tell them exactly what works or what's missing in 1-2 sentences. Tone: senior who wants them to succeed.

Return ONLY this JSON — no other text:
{
  "result": "pass" | "fail" | "flag",
  "xp_awarded": 0-300,
  "feedback": "1-2 sentences specific",
  "improvement_note": "string | null"
}

Use "flag" only if copied from another student or abusive content.
```

---

## FEATURE 4 — STREAK SYSTEM

**Day boundary:** Midnight UTC — server-side only, never client time
**Freeze:** One 24-hour freeze per 30-day period. Student activates before midnight.
**Multipliers:**

| Streak | Multiplier |
|---|---|
| 0–6 days | 1.0× |
| 7–29 days | 1.1× |
| 30–59 days | 1.25× |
| 60–89 days | 1.5× |
| 90+ days | 2.0× |

**Monthly quest:** Must be completed to receive multiplier bonus that month.

**Cron (00:05 UTC daily):** For every student where `last_active_date` ≠ yesterday:
- If freeze activated → continue streak
- Otherwise → `current_streak = 0`, `multiplier = 1.0`

**Anomaly detection (30+ day streak):**
New device or IP vs last 7 days → hold increment, require re-verification, log to moderation.

---

## FEATURE 5 — XP & LEVELS

| Action | Base XP |
|---|---|
| Theory task pass | 100 |
| Build task pass | 200 |
| GitHub-linked project pass | 300 |
| Badge earned | 150 |
| Weekly challenge | 200 |
| Monthly quest | 500 |
| Peer validation received | 50 (max 5/day) |
| Resource approved | 100 |

`final_xp = floor(base_xp × streak_multiplier)`

**Level thresholds (total XP):**
1→0, 2→500, 3→1200, 5→3000, 10→8000, 15→15000, 20→25000, 30→50000, 40→85000, 50→130000

**XP reversal on moderation rejection:** Negative XpLedger entry = `-(xp_awarded_originally)`

---

## FEATURE 6 — BADGES

| Badge | Trigger | Anti-cheat |
|---|---|---|
| FIRST_COMMIT | GitHub verified with real commits | 30+ day old account, 3+ repos, >1 commit each |
| WARRIOR_30 | 30-day streak | |
| WARRIOR_60 | 60-day streak | |
| WARRIOR_90 | 90-day streak | |
| BRIDGE_BUILDER | First from their college to complete roadmap | Check on completion |
| PEER_APPROVED | 10 peer validations received | Mutual-only approvals don't count |
| HACKATHON_FINISHER | One hackathon participated | Submission link or registration reviewed by mod |
| TOP_10_TN | Top 10% statewide in their roadmap | Recomputed daily — can be lost |
| TOP_1_TN | Top 1% statewide | Same |
| RUSHER_COMPLETE | Rusher roadmap completed | |
| SPECIALIST_COMPLETE | Specialist roadmap completed | |
| FIRST_INTERNSHIP | Internship logged and verified | |
| OPEN_SOURCE_MERGED | Open source contribution | PR link required |

---

## FEATURE 7 — MONTHLY QUEST

**Generated:** Last day of month for next month. Run via Batch API (50% discount).
**Model:** Sonnet 4.6
**DB key:** `monthly_quest`
**Prerequisite:** Must complete to receive multiplier bonus that month.

**System Prompt:**
```
Generate a monthly quest for an Eakalaiva student targeting their weakest area.

Student data:
- Roadmap: {roadmap_type}, Step: {step_number}
- Weakest area: {weakest_area}
- GitHub commits last month: {github_commits}
- Consistency score: {consistency_score}

Rules:
- Target weakest area directly
- Completable in 4 weeks with consistent daily effort
- One clear verifiable final output
- 4 progressive weekly milestones

Return ONLY this JSON:
{
  "quest_title": "string",
  "quest_description": "2-3 sentences",
  "target_area": "string",
  "final_output": "specific and verifiable",
  "weekly_milestones": [
    { "week": 1, "milestone": "string" },
    { "week": 2, "milestone": "string" },
    { "week": 3, "milestone": "string" },
    { "week": 4, "milestone": "string" }
  ],
  "xp_reward": 500,
  "badge_reward": "string | null"
}
```

---

## FEATURE 8 — PEER VALIDATION

**Flow:**
1. Step with `requires_peer: true` completed
2. System shows submission to 3 random students on same roadmap
3. 2 of 3 approve → peer-validated, XP bonus released
4. Each validation received: +50 XP (max 5/day)

**Anti-farming:**
After every approval: check if A approved B AND B approved A within 7 days → flag both, hold XP, send to moderator.

---

## FEATURE 9 — STREAK REMINDER

**Triggered:** 15:30 UTC (≈9pm IST) for students with no activity today.
**Model:** Haiku 4.5
**DB key:** `streak_reminder`

**System Prompt:**
```
Write a streak reminder DM for an Eakalaiva student who hasn't logged activity today.

Student: Name: {name}, Streak: {current_streak} days, Last task: {last_task_title}

Rules:
- Maximum 3 sentences
- Warm but honest about what's at stake
- Reference their actual streak number
- End with one specific tiny action they can take right now
- Plain text only. No emojis. No markdown.

Return the message only. No preamble.
```

---

## FEATURE 10 — OPPORTUNITY MATCHING

**Logic:**
1. New opportunity posted → extract: eligible_domains, eligible_years
2. Match against students: roadmap domain, year_of_study, scores
3. Score: exact domain=1.0, adjacent=0.5, any=0.2
4. Notify top 50% matched students via push + dashboard alert
5. Display in Opportunity Explorer ordered by match score descending
