# T1_03 — PROMPT PLAYBOOK
> Type 1 — Human Reference. Copy, fill brackets, paste into AI tool.
> Always load T2 context files before using any prompt in this playbook.
> See T1_02_VIBE_CODE_RULES.md → "Load the AI Context Files" for instructions.

---

## HOW TO USE THIS PLAYBOOK

1. Find your feature section below
2. Note which T2 files to load for that section
3. Load the session opener from T1_02_VIBE_CODE_RULES.md
4. Copy the prompt, fill in the brackets
5. After every output — run the follow-up prompt at the bottom of this file

---

## ═══════════════════════════════════
## SECTION A — FOUNDATION & AUTH
## T2 Files: T2_01, T2_02, T2_03, T2_05, T2_06
## ═══════════════════════════════════

### A1 — Student Registration (Web)
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_06_SECURITY_RULES

Build the student registration API endpoint for Eakalaiva web.

Accept: name (string, max 100), email (string, valid format), password (string, min 8, max 100), college_name (string, from TN colleges list), year_of_study (integer, 1-4), domain_interest (string, one of: full-stack | embedded-systems | data-science | cybersecurity | mobile-dev | devops | ai-ml)

Rules:
- Validate all fields server-side. Client validation is cosmetic only.
- Check email uniqueness before hashing password
- Hash password with bcrypt, salt rounds 12
- Create user with status: "unverified"
- Generate email verification token — UUID v4, expires 24 hours, store hashed in DB
- Send verification email via Resend using the welcome template
- Do NOT return password_hash, verification_token, or any internal IDs in response
- Return: { success: true, message: "Verification email sent", user: { id, name, email, status } }

Follow the exact schema in T2_03_DATABASE_SCHEMA.md for the User model.
Follow all rules in T2_06_SECURITY_RULES.md.

Tell me every assumption you made. What could break in production?
```

### A2 — Student Registration (Mobile — Expo)
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_02_TECH_ARCHITECTURE, T2_06_SECURITY_RULES

Build the registration screen for the Eakalaiva Expo mobile app.

This screen calls the same API endpoint as the web: POST /api/auth/register

UI requirements:
- Input fields: Full Name, Email, Password (hidden), College Name (searchable dropdown from static TN colleges list), Year of Study (picker 1-4), Domain Interest (picker with 7 options)
- "Continue with Google" button above the form with a divider "or"
- "Register" primary button at bottom
- Loading state on submit — disable button, show spinner
- Inline validation errors below each field (not a toast)
- On success — navigate to /onboarding screen

Technical rules:
- Use NativeWind for all styling
- No hardcoded colors — use the design token variables from T2_02_TECH_ARCHITECTURE.md
- Form state managed with react-hook-form
- API calls via the shared api-client package
- Handle network errors gracefully — show "Check your connection" not a crash
- Keyboard-aware scroll view — form doesn't get hidden behind keyboard

Tell me every assumption you made. What could break on real device?
```

### A3 — Google OAuth (Web)
```
Context files loaded: T2_02_TECH_ARCHITECTURE, T2_06_SECURITY_RULES

Set up Google OAuth for Eakalaiva web using NextAuth.js v5.

Flow:
1. Student clicks "Continue with Google"
2. Google returns: email, name, profile picture, google_id
3. Check DB: does a user with this email exist?
   - YES → update last_login, return session with JWT
   - NO → create new user: { name, email, image, google_id, status: "active", email_verified: true }
4. On new user → trigger onboarding flag in session: { needs_onboarding: true }
5. On existing user → check if onboarding is complete: redirect accordingly
6. JWT session expires in 7 days
7. Refresh token rotates on each use

Do NOT store Google's access token or refresh token in DB.
Store only: google_id, email, name, image URL.
Follow T2_06_SECURITY_RULES.md session management rules.

Tell me every assumption you made. What could break?
```

### A4 — Google OAuth (Mobile — Expo)
```
Context files loaded: T2_02_TECH_ARCHITECTURE, T2_06_SECURITY_RULES

Set up Google OAuth for the Eakalaiva Expo mobile app using expo-auth-session.

Flow:
1. User taps "Continue with Google"
2. expo-auth-session opens Google OAuth in browser
3. Google returns auth code
4. Exchange code for ID token via our backend: POST /api/auth/google/mobile
5. Backend validates token, creates/finds user, returns our JWT
6. Store JWT in expo-secure-store (never AsyncStorage)
7. JWT expires in 7 days — check expiry on app foreground

Handle:
- User cancels OAuth flow — return to login screen, no error
- OAuth fails — show clear message, offer email login
- First-time user — navigate to onboarding screen
- Returning user — navigate to dashboard

Tell me every assumption you made. What could break on iOS vs Android?
```

### A5 — Password Reset
```
Context files loaded: T2_06_SECURITY_RULES

Build password reset flow for Eakalaiva (web and mobile use same API).

Two endpoints:

POST /api/auth/forgot-password
- Accept: email
- Do NOT confirm or deny if email exists (prevents email enumeration)
- If email exists: generate reset token (crypto.randomBytes(32).toString('hex')), hash it, store with 15-minute expiry
- Send reset email with link: [APP_URL]/reset-password?token=[raw_token]
- Always return: { message: "If that email exists, a reset link has been sent" }
- Rate limit: max 3 requests per email per hour

POST /api/auth/reset-password
- Accept: token (raw), new_password
- Hash the token, find matching unexpired record
- If not found or expired: { error: "Invalid or expired reset link" }
- If found: hash new password (bcrypt, 12 rounds), save, delete reset token record
- Invalidate ALL active sessions for this user (clear refresh tokens from DB)
- Return: { success: true, message: "Password updated. Please log in." }

Security: Token must be single-use. Delete immediately on use.
Follow T2_06_SECURITY_RULES.md fully.

Tell me every assumption you made. What could break?
```

---

## ═══════════════════════════════════
## SECTION B — AI PLATFORM FEATURES
## T2 Files: T2_01, T2_03, T2_05, T2_06, T2_07
## ═══════════════════════════════════

### B1 — AI Onboarding Session (Stage 1 — Clarity)
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_07_FEATURE_SPECS

Build the AI onboarding session backend for Eakalaiva.

This runs once when a new student registers. It drives a conversational interview and outputs a roadmap recommendation.

API endpoint: POST /api/onboarding/message
Accept: { conversation_history: Message[], student_id: string }
Returns: { message: string, is_complete: boolean, result?: OnboardingResult }

OnboardingResult shape:
{
  roadmap_type: "specialist" | "rusher" | "explorer",
  explanation: string,
  proof_outcomes: string[3],
  closing_message: string
}

The AI prompt for this feature is in docs/ai/T2_07_FEATURE_SPECS.md under "AI Onboarding."
Load it dynamically from DB (ai_prompts table) — never hardcode it.

Rules:
- Maximum 7 turns before outputting OnboardingResult
- Stream the AI response (use Anthropic streaming API)
- Save conversation to DB on each turn
- Once complete — update student record: { onboarding_complete: true, roadmap_type: result.roadmap_type }
- Student cannot run onboarding again (one-time only — enforce server-side)

Tell me every assumption you made. What could break?
```

### B2 — Daily Task Generation
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_07_FEATURE_SPECS

Build the daily task generation system.

API endpoint: GET /api/tasks/today
- Auth required (student JWT)
- If tasks already exist for today — return them (don't regenerate)
- If no tasks for today — call AI to generate 3 tasks
- Mark tasks as generated_at: now() UTC

To generate tasks, fetch:
- Student's current roadmap_type, current step number, consistency_score, depth_score
- Student's last 7 task titles (to avoid repeats)
- Days active total

The AI prompt is in T2_07_FEATURE_SPECS.md under "Daily Task Generation."
Load it from DB dynamically — never hardcode.

Parse AI response as JSON. Validate structure before saving.
If AI returns invalid JSON — retry once, then return a fallback default task.

Save tasks to DB as per Task model in T2_03_DATABASE_SCHEMA.md.
Return tasks to student.

Tell me every assumption you made. What could break?
```

### B3 — AI Quality Gate (Submission Evaluator)
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_06_SECURITY_RULES, T2_07_FEATURE_SPECS

Build the submission quality gate for Eakalaiva.

API endpoint: POST /api/tasks/submit
Accept: { task_id: string, content: string, github_link?: string, screenshot_url?: string }
Auth required (student JWT)

Full flow:
1. Validate task belongs to this student
2. Check task not already submitted (one submission per task)
3. If github_link provided — call GitHub API to check: repo not empty, has more than 1 commit
4. Call AI quality gate (prompt from T2_07_FEATURE_SPECS.md — "Quality Gate")
5. Parse AI JSON response: { result, xp_awarded, feedback, improvement_note }
6. If result === "pass":
   - Create submission record with status "passed"
   - Add XP to student via xp_ledger
   - Check and update streak via streaks table
   - Check streak milestones — unlock XP multiplier if applicable
   - Check badge triggers — award any newly earned badges
7. If result === "fail":
   - Create submission record with status "failed"
   - Allow resubmission same day (reset submission for this task)
   - Return feedback so student knows exactly what to fix
8. Return: { result, xp_awarded, feedback, streak_updated, badges_earned }

Anti-cheat: Apply rules from T2_06_SECURITY_RULES.md — anti-cheat section.
Tell me every assumption you made. What could break?
```

### B4 — Streak System
```
Context files loaded: T2_03_DATABASE_SCHEMA, T2_06_SECURITY_RULES, T2_07_FEATURE_SPECS

Build the streak tracking system for Eakalaiva.

A streak increments when a student has at least one PASSED submission in a calendar day (UTC).

Rules (from T2_07_FEATURE_SPECS.md — "Streak System"):
- Day boundary is midnight UTC — always server-side, never client time
- Miss one day = streak resets to 0
- Streak grace period: students get one 24-hour freeze per 30-day period (they must activate it manually before midnight)
- Streak multipliers trigger at: 7 days (+10%), 30 days (+25%), 60 days (+50%), 90 days (+100%)
- Multiplier applies to XP for all future tasks until streak resets
- Multiplier is lost immediately on streak reset

Functions to build:
- incrementStreak(student_id) — called after a task passes quality gate
- checkAndResetStreaks() — cron job, runs at 00:05 UTC daily, resets streaks for students with no activity yesterday
- applyStreakMultiplier(base_xp, current_streak) → returns final XP
- activateFreezeDay(student_id) — student-initiated, max once per 30 days

Anti-cheat: Behavioral anomaly detection on streak-critical days (new device/IP pattern). Flag for moderator review if detected. See T2_06_SECURITY_RULES.md.

Tell me every assumption you made. What could break?
```

---

## ═══════════════════════════════════
## SECTION C — LEADERBOARDS & SCORES
## T2 Files: T2_01, T2_03, T2_04, T2_07
## ═══════════════════════════════════

### C1 — Consistency Leaderboard
```
Context files loaded: T2_03_DATABASE_SCHEMA, T2_04_API_CONTRACTS, T2_07_FEATURE_SPECS

Build the Consistency Leaderboard system for Eakalaiva.

API endpoint: GET /api/leaderboard/consistency
Query params: limit (default 50, max 100), page (default 1)

Rules (from T2_07_FEATURE_SPECS.md):
- Rank students by current_streak descending
- Include only students with minimum 7 days of total activity (prevents new-account gaming)
- Tie-breaking: if equal streak → rank by total_xp descending
- Cache result for 5 minutes in leaderboard_cache table
- On cache miss → compute and store, return computed result
- Return: [ { rank, name, college_name, roadmap_type, current_streak, consistency_score, avatar_url } ]
- Do NOT return: email, password_hash, internal IDs, submission content

Campus variant: GET /api/leaderboard/campus/:college_slug
- Top 10 students from that college only
- Same ranking rules
- Cached 10 minutes

Recompute trigger: After every successful submission, invalidate relevant cache entries.

Tell me every assumption you made. What could break at scale?
```

### C2 — Score Calculation System
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_07_FEATURE_SPECS

Build the three-score calculation system for Eakalaiva.

Three scores exist for every student (from T2_07_FEATURE_SPECS.md):

CONSISTENCY SCORE (0-100)
= weighted average of: 
  - daily_streak_factor (40%) — current_streak / longest_possible_streak_in_their_roadmap_days
  - weekly_completion_rate (40%) — tasks_completed_this_week / tasks_generated_this_week
  - ai_task_engagement (20%) — tasks_submitted / tasks_generated (lifetime)

DEPTH SCORE (0-100)
= weighted average of:
  - proof_per_step (50%) — avg submissions with real links per roadmap step
  - peer_validations_received (30%) — total peer approvals / steps completed
  - resource_quality_score (20%) — quality gate scores on submitted resources

PROOF SCORE (0-100)
= weighted average of:
  - github_commit_depth (40%) — commit count last 90 days (capped at meaningful max)
  - projects_completed (30%) — verified project submissions
  - external_wins (30%) — hackathon participations + internships recorded

Cross-roadmap fairness: all three scores convert to percentiles within each roadmap type.
A score of 75 means top 25% of ALL students on that roadmap, not absolute value.

Recalculate scores:
- After every submission pass
- Daily via cron at 02:00 UTC for all active students

Tell me every assumption you made. What could break at scale?
```

---

## ═══════════════════════════════════
## SECTION D — PROFILES & INTEGRATIONS
## T2 Files: T2_02, T2_03, T2_04, T2_06, T2_07
## ═══════════════════════════════════

### D1 — Public Student Profile (Web)
```
Context files loaded: T2_03_DATABASE_SCHEMA, T2_04_API_CONTRACTS, T2_07_FEATURE_SPECS

Build the public student profile page for Eakalaiva web (Next.js).

Route: /profile/[username]
This page is publicly accessible — no auth required to view.

Data to display (from GET /api/student/profile/:username):
- Name, college, year, roadmap type
- Current streak with flame icon, longest streak
- XP total and current level (level thresholds in T2_07_FEATURE_SPECS.md)
- Three scores as circular progress bars: Consistency, Depth, Proof
- Statewide percentile rank and campus rank
- Badges earned (icons, tooltip on hover showing unlock condition)
- GitHub contribution graph (embedded, fetched client-side from GitHub API)
- Last 10 completed tasks (title, date, XP earned — no submission content)
- "Verified by Eakalaiva" badge if student has 30+ days activity

Edge cases:
- GitHub not linked → "GitHub not connected yet" placeholder, not an error
- Profile private setting → show name and college only, no scores
- Student deleted account → 404 page, not a server error

Metadata for SEO: title "[Name] — Eakalaiva Verified Profile", description includes college and roadmap.

Tell me every assumption you made. What could break?
```

### D2 — GitHub Integration
```
Context files loaded: T2_06_SECURITY_RULES, T2_07_FEATURE_SPECS

Build the GitHub integration for Eakalaiva student profiles.

API endpoint: POST /api/integrations/github
Auth required (student JWT)
Accept: { github_username: string }

Validation flow:
1. Call GitHub REST API: GET /users/:github_username — check user exists
2. Check account age: created_at must be more than 30 days ago
3. Call GET /users/:github_username/repos — count repos with commit count > 1
4. If fewer than 3 repos with real activity → reject: "GitHub account needs more real project history"
5. If valid → store github_username in student record, set github_verified: true
6. Fetch contribution data for profile display
7. Schedule re-verification every 7 days (cron job)

Re-verification (cron — runs weekly):
- Re-run steps 1-3 for all students with github_verified: true
- If account no longer valid → set github_verified: false, notify student

Use env var: GITHUB_TOKEN for API calls (higher rate limit).
Badge trigger: "First Commit" badge awarded on first successful GitHub verification.

Anti-cheat from T2_06_SECURITY_RULES.md:
- Empty repos do not count
- Single-commit repos do not count
- Repos created in the last 7 days do not count toward the threshold

Tell me every assumption you made. What could break?
```

### D3 — LeetCode Integration
```
Context files loaded: T2_06_SECURITY_RULES, T2_07_FEATURE_SPECS

Build the LeetCode integration for Eakalaiva.

LeetCode has no official API. Use the unofficial GraphQL endpoint: https://leetcode.com/graphql

Query to fetch: solved count (easy/medium/hard), submission calendar, ranking, streak.

API endpoint: POST /api/integrations/leetcode
Auth required (student JWT)
Accept: { leetcode_username: string }

Validation:
1. Fetch user profile from LeetCode GraphQL
2. Verify user exists and is public
3. Check: has solved at least 20 problems total
4. If valid → store leetcode_username, set leetcode_verified: true, save stats
5. Cache stats in student record, refresh daily via cron

Display on profile:
- Problems solved (easy / medium / hard breakdown)
- Acceptance rate
- Current LeetCode streak (if available)

Handle:
- LeetCode GraphQL down → use cached data, show "Last updated [date]"
- User sets profile to private → show "LeetCode profile is private" gracefully
- Rate limiting → exponential backoff, max 3 retries

Tell me every assumption you made. What could break?
```

---

## ═══════════════════════════════════
## SECTION E — ADMIN & MODERATION
## T2 Files: T2_03, T2_04, T2_06, T2_07
## ═══════════════════════════════════

### E1 — Admin Dashboard
```
Context files loaded: T2_03_DATABASE_SCHEMA, T2_04_API_CONTRACTS, T2_06_SECURITY_RULES

Build the admin dashboard stats API for Eakalaiva.

API endpoint: GET /api/admin/stats
Auth required: JWT + role must be "admin" — verify both, not just auth.

Return:
{
  students: { total, active_7d, active_30d, new_today },
  submissions: { total_today, passed_today, failed_today, pending_review },
  streaks: { longest_active: { student_name, days }, avg_active_streak },
  colleges_represented: number,
  top_roadmap: string,
  platform_health: { ai_gate_pass_rate_today, avg_response_time_ms }
}

No caching — admin needs real numbers.
All queries must complete in under 500ms — use indexed columns only.

Tell me every assumption you made.
```

### E2 — Moderation — Submission Review
```
Context files loaded: T2_03_DATABASE_SCHEMA, T2_06_SECURITY_RULES

Build the submission moderation system for Eakalaiva.

Cases that reach moderator review:
1. AI gate flags submission as "suspicious" (possible AI-generated)
2. Peer approval farming detected (mutual-only pattern)
3. Behavioral anomaly on streak-critical day
4. Manual report from another student

API endpoints:
GET /api/admin/moderation/queue — list all pending reviews, sorted by priority
POST /api/admin/moderation/:submission_id/approve — confirm as legitimate
POST /api/admin/moderation/:submission_id/reject — reject with reason
POST /api/admin/moderation/:submission_id/warn — warn student, keep XP

On rejection:
- Remove XP awarded
- Revert streak increment if it was the qualifying action that day
- Send student a notification with specific reason
- Log to moderation_log table

On second rejection for same student within 30 days:
- Flag account for enhanced review (all future submissions auto-queued)

Moderator UI shows:
- Submission content
- Student profile (streak, scores, history)
- AI gate's specific flag reason
- Similar past submissions from this student

Tell me every assumption you made.
```

---

## ═══════════════════════════════════
## SECTION F — MOBILE-SPECIFIC
## T2 Files: T2_02, T2_05, T2_07
## ═══════════════════════════════════

### F1 — Push Notifications (Expo)
```
Context files loaded: T2_02_TECH_ARCHITECTURE, T2_07_FEATURE_SPECS

Build the push notification system for the Eakalaiva Expo app.

Use Expo Push Notifications (handles both iOS and Android from one API).

Notification types to implement:
1. Daily streak reminder — 9pm local time if no activity today
2. Streak at risk — 11pm if still no activity (more urgent tone)
3. Badge earned — immediate on badge unlock
4. New task available — 8am daily
5. Leaderboard position change — when student enters top 10% of their roadmap
6. Peer validation received — immediate
7. Opportunity match — when a new job/hackathon matches student's roadmap

Backend endpoint: POST /api/notifications/send
Accept: { student_ids: string[], type: NotificationType, data: object }

Rules:
- Store Expo push token in student record on app load — update if changed
- Respect notification preferences (student can disable each type individually)
- Do NOT send notifications between 11pm and 7am local time (except streak-critical ones)
- Track: sent, delivered, opened in notifications_log table
- If push token invalid — remove it from DB, don't retry

Tell me every assumption you made. What could break on iOS vs Android?
```

### F2 — Offline Mode (Mobile)
```
Context files loaded: T2_02_TECH_ARCHITECTURE, T2_05_CODE_STANDARDS

Build offline state handling for the Eakalaiva Expo app.

What works offline:
- View today's tasks (cached on load)
- Write submission draft (saved locally)
- View own profile (cached)
- View leaderboard (cached, show "last updated [time]")

What requires online:
- Submit a task (requires AI quality gate)
- Onboarding session
- Fetch new tasks
- View other students' profiles

Implementation:
- Use @react-native-community/netinfo to detect connection state
- Show a clear non-blocking banner when offline: "You're offline — submissions will sync when connected"
- Cache today's tasks in expo-secure-store on successful fetch
- Queue draft submissions locally — auto-submit when connection returns
- Never show a crash or blank screen for network failure — always show a message

Tell me every assumption you made. What differs between iOS and Android?
```

---

## ═══════════════════════════════════
## SECTION G — COMPANY & COLLEGE DASHBOARDS
## T2 Files: T2_01, T2_03, T2_04, T2_07
## ═══════════════════════════════════

### G1 — Company Talent Search
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_07_FEATURE_SPECS

Build the company talent search API for Eakalaiva.

This is a paid feature — verify active company subscription before any query.

API endpoint: GET /api/company/talent/search
Auth required: Company JWT + active subscription check

Query parameters:
- roadmap_type (optional — filter by specialist / rusher / explorer)
- domain (optional — full-stack, data-science, etc.)
- min_consistency_score (optional, 0-100)
- min_depth_score (optional, 0-100)
- min_streak_days (optional)
- college_tier (optional — "any" | "outside-top-30")
- has_github (optional boolean)
- has_projects (optional boolean)
- page, limit (max 50 per page)

Return per student:
{ name, college_name, roadmap_type, scores, current_streak, badges, github_url, profile_url }

Do NOT return: email, phone, personal details — company sees public profile data only.
Student must have profile_visible: true to appear in results.

Rate limit: 100 searches per company per day.

Tell me every assumption you made.
```

### G2 — College Partnership Dashboard
```
Context files loaded: T2_01_PROJECT_CONTEXT, T2_03_DATABASE_SCHEMA, T2_07_FEATURE_SPECS

Build the college partnership dashboard API for Eakalaiva.

Auth: College admin JWT + verified college partnership.

API endpoints:

GET /api/college/dashboard/:college_slug
Returns:
{
  total_students: number,
  active_students_30d: number,
  roadmap_distribution: { specialist: n, rusher: n, explorer: n },
  avg_consistency_score: number,
  top_performers: Student[5],
  campus_leaderboard: Student[10],
  placement_stats: { internships: n, hackathon_wins: n },
  naac_report_ready: boolean
}

GET /api/college/naac-report/:college_slug
Returns downloadable PDF-ready data:
- Student skill progression data
- Activity rates
- Placement outcomes via platform

Rules:
- College sees only their own students
- Student names visible but not emails or personal details
- Data refreshes daily, not real-time
- Cached 30 minutes

Tell me every assumption you made.
```

---

## ═══════════════════════════════════
## UNIVERSAL FOLLOW-UP PROMPTS
## Use after any output from any section above
## ═══════════════════════════════════

### Security Review
```
Review the code you just generated against T2_06_SECURITY_RULES.md.

Check specifically:
- Any hardcoded credentials or secrets?
- Any user input that reaches DB without validation?
- Any sensitive data exposed in API response?
- Any missing auth check?
- Any missing rate limiting on this endpoint?
- Any token that doesn't expire?
- Any place client-provided timestamp is trusted?

List every issue. Fix each one. Show me the corrected version.
```

### Error Handling Audit
```
Review the code for missing error handling.

Every API route must handle:
- Invalid or missing input → 400 with specific message
- Unauthenticated request → 401
- Unauthorised (wrong role) → 403
- Resource not found → 404
- DB query failure → 500 with generic message (never expose DB error to client)
- External API failure (GitHub, LeetCode, Anthropic) → graceful fallback

Show me every unhandled path and add proper responses.
```

### Simplification Check
```
The code you generated may be more complex than needed for a 3-person team.

Can this be simplified without losing functionality or security?
What is redundant? What can be removed?
Show me the simplified version with no loss of the required behaviour.
```

### Mobile Compatibility Check
```
This code will also run in an Expo React Native environment.

Review:
- Any web-only APIs used? (localStorage, document, window — none work in React Native)
- Any Node.js built-ins that won't work in Expo? 
- Any library that needs a native module and requires expo install?

List all issues and suggest the Expo-compatible alternative.
```

### TypeScript Types Check
```
Generate the complete TypeScript interfaces for everything this feature creates or returns.

Include:
- All request body types
- All response types
- All DB model types (matching Prisma schema in T2_03_DATABASE_SCHEMA.md)
- All enum values

Put them in the appropriate types file as per T2_02_TECH_ARCHITECTURE.md folder structure.
```
