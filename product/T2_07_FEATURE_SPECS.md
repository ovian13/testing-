# T2_07 — FEATURE SPECIFICATIONS
> Type 2 — AI Reference. Load when building any specific platform feature.
> Every feature, every flow, every edge case, every AI prompt defined here.

---

## FEATURE 1 — AI ONBOARDING SESSION

**What it is:** A one-time conversational AI session that runs immediately after registration. It understands the student's goals and assigns a personalised roadmap.

**Constraints:**
- Runs exactly once per student. Enforced server-side.
- Maximum 7 turns before outputting the final recommendation.
- Conversation saved to DB on every turn.

**User flow:**
1. Student registers → redirected to `/onboarding`
2. AI asks one question at a time (never two at once)
3. After 7 turns → AI outputs roadmap recommendation
4. Student sees recommendation with explanation → "Start My Journey" CTA
5. `onboarding_complete: true` written to DB → `/dashboard`
6. If student closes mid-session → resumes from where they left off on next login

**Questions AI covers (in natural conversation order):**
1. Year of engineering
2. Branch/domain
3. Have they built anything — any project, any size
4. Career goal — job fast, deep mastery, or still exploring
5. What they've tried learning and what stopped them
6. How much time per day is realistic
7. Biggest career fear right now

**AI System Prompt:**
```
You are the onboarding guide for Eakalaiva — a free skill-tracking platform for Tamil Nadu engineering students.

Your job is to understand this student deeply enough to assign them the right roadmap in one session.

Rules:
- Ask one question at a time. Never ask two questions together.
- Be warm, direct, and encouraging. Speak like a senior student who made it — not a formal system.
- This student may feel insecure about their college. Never reference it negatively.
- Maximum 7 questions before making your recommendation.
- After 7 turns, output ONLY this JSON — no other text:

{
  "roadmap_type": "specialist" | "rusher" | "explorer",
  "explanation": "2-3 sentences explaining why this roadmap fits them personally",
  "proof_outcomes": ["specific thing 1", "specific thing 2", "specific thing 3"],
  "closing_message": "One sentence personalised to something they said"
}

Questions to naturally cover:
1. Year of engineering?
2. Branch/domain studying?
3. Have they built anything — any project, no matter how small?
4. Career goal — job fast, deep mastery, or still exploring?
5. What have they tried learning and what stopped them?
6. How much time can they realistically commit per day?
7. What is their biggest career fear right now?
```

**Edge cases:**
- Student gives very short answers → AI gently probes one more time before accepting
- Student asks off-topic questions → AI redirects kindly
- API failure during session → show "Connection issue, let's continue" and retry

---

## FEATURE 2 — DAILY TASK GENERATION

**What it is:** Every day, the AI generates exactly 3 tasks personalised to the student's current roadmap position and weaknesses.

**Constraints:**
- Maximum 3 tasks per 24 hours. Enforced server-side.
- If tasks already exist for today → return them (don't regenerate).
- Tasks expire at end of day (23:59:59 UTC). Expired tasks do not count for streak.
- Tasks are generated once at 06:00 UTC daily for all active students via cron, OR on first dashboard load if not yet generated that day.

**Task structure:**
- One concept task (understanding)
- One build task (hands-on, code or project)
- One review/reflection task (consolidation)

**Difficulty adaptation:**
- Consistency score < 40 → easier tasks, more encouraging descriptions
- Consistency score > 70 → harder tasks, introduce stretch challenges
- Depth score low in an area → tasks target that specific weakness

**AI System Prompt:**
```
You are the daily AI companion for an Eakalaiva student.

Generate exactly 3 tasks for today. Tasks must be achievable in 1-2 hours each.

Student context:
Roadmap: {roadmap_type}
Current step: {step_number} — {step_title}
Step description: {step_description}
Consistency score: {consistency_score}/100
Days active total: {days_active}
Last 7 task titles (do not repeat): {last_7_tasks}

Rules:
- At least one task must involve writing or committing real code
- Tasks must directly advance the current roadmap step
- Task 1: concept/understanding task
- Task 2: build/code task
- Task 3: review/reflection task
- If consistency < 40 → make tasks easier, more encouraging
- If consistency > 70 → push harder, introduce a stretch
- Never generate tasks completable by copying a tutorial without understanding

Return ONLY this JSON — no other text, no markdown:

{
  "tasks": [
    {
      "title": "string (max 80 chars)",
      "description": "string (2-3 sentences, specific and actionable)",
      "expected_output": "string (exactly what the student must show as proof)",
      "submission_type": "github_link" | "text" | "screenshot_url",
      "base_xp": number (100-300 based on difficulty),
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}
```

---

## FEATURE 3 — AI QUALITY GATE

**What it is:** Every submission passes through an AI evaluator before XP is released. It detects AI-generated work, low effort, and off-topic submissions.

**Constraints:**
- Every submission goes through this — no bypasses.
- XP only releases on explicit `result: "pass"`.
- On fail → student told exactly what's missing, can resubmit same day.
- On flag → goes to moderation queue, XP held.

**FAIL conditions:**
- Clearly AI-generated output (uniform formatting, no errors, no personal voice, pure boilerplate)
- Submission doesn't address the task
- Fewer than 3 sentences with no evidence of work
- GitHub link submitted with empty or single-commit repo
- Identical or near-identical to student's previous submission

**PASS conditions:**
- Shows genuine understanding of the core concept
- Includes real output (working code, honest explanation, real GitHub activity)
- Has personal voice — imperfect but real
- Partial/incomplete but clearly genuine effort → PASS with reduced XP and guidance

**AI System Prompt:**
```
You are the quality gate for Eakalaiva — evaluating student task submissions.

Task: {task_title}
Expected output: {expected_output}
Student submission: {submission_content}
GitHub repo stats (if provided): {github_stats}

Evaluate whether this demonstrates genuine understanding and effort.

FAIL if:
- Clearly AI-generated (perfect formatting, no errors, no personal voice)
- Does not address the task
- Fewer than 3 sentences with no evidence
- GitHub link with empty or single-commit repo
- Identical to previous submission from this student

PASS if:
- Shows student understood the task
- Includes real output with genuine attempt
- Imperfect but clearly their own work

Feedback rules:
- Be specific. "Good job" is useless.
- If fail: one sentence saying exactly what is missing
- If pass: acknowledge one specific thing they did well
- Tone: like a senior who genuinely wants them to succeed

Return ONLY this JSON — no other text:

{
  "result": "pass" | "fail" | "flag",
  "xp_awarded": number (0 if fail, 50-300 if pass, based on quality),
  "feedback": "string (1-2 sentences, specific and encouraging or specific and directive)",
  "improvement_note": "string | null (what to do differently if fail)"
}

Use "flag" only if submission appears to be copied from another student or is abusive.
```

---

## FEATURE 4 — STREAK SYSTEM

**What it is:** A daily consistency tracker. Streak increments when a student has at least one PASSED submission in a calendar day (UTC).

**Streak rules:**
- Day boundary: midnight UTC. Server-side only. Client time never trusted.
- Miss one day → streak resets to 0.
- Freeze day: one 24-hour freeze available per 30-day period. Student must activate before midnight. Activating uses the freeze — stream continues as if they submitted.
- Streak multipliers applied to all XP earned while streak is active.

**Multiplier thresholds:**
| Streak | XP Multiplier |
|---|---|
| 0–6 days | 1.0× |
| 7–29 days | 1.1× |
| 30–59 days | 1.25× |
| 60–89 days | 1.5× |
| 90+ days | 2.0× |

**Monthly quest requirement:**
Monthly quest must be completed to receive that month's multiplier bonus. Skipping quests keeps multiplier at 1.0× regardless of streak length.

**Cron job (runs 00:05 UTC daily):**
For every student with `last_active_date` not equal to yesterday's date:
- If `freeze_used_this_period: false` AND student manually activated freeze → do not reset
- Otherwise → set `current_streak = 0`, `multiplier = 1.0`
- Recalculate `freeze_used_this_period` at start of each 30-day period

**Anomaly detection:**
On streak-critical days (breaking a 30+ day streak):
- Compare current request's IP and device against last 7 days
- If new device/IP → flag, require re-verification task, hold streak increment
- Log to moderation review queue

---

## FEATURE 5 — XP & LEVEL SYSTEM

**Level thresholds:**
| Level | XP Required (total) |
|---|---|
| 1 | 0 |
| 2 | 500 |
| 3 | 1,200 |
| 5 | 3,000 |
| 10 | 8,000 |
| 15 | 15,000 |
| 20 | 25,000 |
| 30 | 50,000 |
| 40 | 85,000 |
| 50 | 130,000 |

**XP weights:**
| Action | Base XP | Notes |
|---|---|---|
| Theory task pass | 100 | |
| Build task pass | 200 | |
| GitHub-linked project task | 300 | Highest — hardest to fake |
| Badge earned | 150 | |
| Weekly challenge completion | 200 | |
| Monthly quest completion | 500 | |
| Peer validation received | 50 | Max 5/day |
| Resource approved by admin | 100 | |

**XP multiplier applied after base calculation:**
`final_xp = floor(base_xp * streak_multiplier)`

**XP reversal:**
If moderation rejects a submission → create a negative XpLedger entry.
`xp_delta = -xp_awarded_on_original_submission`

---

## FEATURE 6 — BADGES

| Badge | Trigger | Notes |
|---|---|---|
| First Commit | GitHub verified with real commit history | GitHub API confirms |
| 30-Day Warrior | 30-day streak reached | |
| 60-Day Warrior | 60-day streak reached | |
| 90-Day Warrior | 90-day streak reached | |
| Bridge Builder | First student from their college to complete a roadmap | Checked on roadmap completion |
| Peer Approved | 10 peer validations received | Cumulative |
| Hackathon Finisher | Participated in one hackathon | Submission link or registration confirmed by mod |
| Top 10% TN | Entered top 10 percentile statewide in their roadmap | |
| Top 1% TN | Entered top 1 percentile | |
| Rusher Complete | Completed the Rusher roadmap | |
| Specialist Complete | Completed the Specialist roadmap | |
| First Internship | Internship record logged and verified | |
| Open Source Merged | Open source contribution verified via GitHub | PR link required |

**Anti-cheat per badge:**
- GitHub badge: account 30+ days old, 3+ repos with real commits, checked via API
- Hackathon Finisher: submission link or registration screenshot reviewed by moderator
- Peer Approved: relationship graph checked — mutual-only approvals don't count
- Top percentile badges: recomputed daily — can be lost if score drops

---

## FEATURE 7 — MONTHLY QUEST

**What it is:** An AI-generated personalised challenge for each student, targeting their weakest area from the previous month.

**Generated:** Last day of the month for the next month.
**Prerequisite for multiplier bonus:** Must be completed to receive streak multiplier bonus that month.

**Quest structure:**
- One overarching goal (4-week deliverable)
- Four weekly milestones
- A specific final output that proves completion

**AI System Prompt:**
```
Generate a monthly quest for an Eakalaiva student targeting their weakest area.

Student data:
Roadmap: {roadmap_type}
Current step: {step_number}
Weakest area this month: {weakest_area} (lowest score sub-component)
Strongest area: {strongest_area}
GitHub commits last month: {github_commits}
Consistency score: {consistency_score}

Quest rules:
- Target the weakest area directly
- Completable in 4 weeks with consistent daily effort
- One clear, verifiable final output
- 4 progressive weekly milestones leading to the output
- Ambitious but not impossible for current level

Return ONLY this JSON:

{
  "quest_title": "string",
  "quest_description": "2-3 sentences",
  "target_area": "string",
  "final_output": "string (specific and verifiable)",
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

**What it is:** Students can validate each other's step completions. Peer validations contribute to a student's Depth Score.

**Flow:**
1. Student completes a step that `requires_peer: true`
2. System requests peer validation — shown to 3 random students on the same roadmap
3. Validators see: step description, expected output, submission (no student identity initially)
4. Validator approves or declines with optional note
5. 2 out of 3 approvals → step counts as peer-validated
6. XP bonus released (50 XP per validation received, max 5/day)

**Anti-farming:**
- Relationship graph analysis runs after every approval
- Mutual-only approval patterns (A approved B, B approved A) flagged
- Flagged approvals frozen, sent to moderator review
- XP for both held until moderator clears

---

## FEATURE 9 — STREAK REMINDER (Discord DM)

**Triggered by:** Cron at 15:30 UTC (≈9pm IST) for students with no activity today.

**AI System Prompt:**
```
Write a streak reminder DM for an Eakalaiva student who hasn't logged activity today.

Student data:
Name: {name}
Current streak: {current_streak} days
Last completed task: {last_task_title}

Rules:
- Maximum 3 sentences
- Warm but honest about what's at stake
- Reference their actual streak number
- Not preachy — no lectures
- End with one specific tiny action they can take right now
- Plain text only. No emojis. No markdown.

Generate the message only. No preamble.
```

---

## FEATURE 10 — OPPORTUNITY MATCHING

**What it is:** Platform automatically matches students to relevant hackathons, internships, and jobs based on their roadmap and skills.

**Matching logic:**
1. New opportunity posted → extract: `eligible_domains`, `eligible_years`, `difficulty_level`
2. Match against students: roadmap domain, year_of_study, scores
3. Score the match: exact domain match (1.0), adjacent domain (0.5), any domain (0.2)
4. Notify top 50% matched students via push notification and dashboard alert
5. Students with higher scores get higher priority matches

**Displayed in:** Opportunity Explorer page, ordered by match score descending.
