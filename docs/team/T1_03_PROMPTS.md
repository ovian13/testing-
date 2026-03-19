# T1_03 — PROMPTS PLAYBOOK
> Copy. Fill brackets. Paste into AI. Always load T2 files first.
> See T1_02 → "Before You Open Any AI Tool" for loading instructions.

---

## Universal Session Opener
**Paste this at the start of EVERY session:**

```
You are helping build Eakalaiva — a free skill-tracking platform for Tamil Nadu 
engineering students. I am loading your context files now.

[PASTE T2_ME_[YOUR NAME].md]
[PASTE T2_01_PRODUCT.md]
[PASTE ADDITIONAL T2 FILES AS BRIEF SPECIFIES]

Rules this session:
- Follow code standards in T2_05 exactly
- Follow security rules in T2_05 without exception  
- One feature only — do not expand scope
- Ask before adding any library not in the stack
- After every output: tell me what assumptions you made and what could break
```

---

## SECTION A — AUTH
**Load:** T2_01, T2_03, T2_04, T2_05
**Owner:** Ramadass (API) + Ovian (UI)

### A1 — Student Registration
```
Build the student registration API endpoint.

Fields: name (string max 100), email (string email format), 
password (string min 8), college_name (string), 
year_of_study (integer 1-4), domain_interest (one of: 
full-stack | embedded-systems | data-science | cybersecurity | 
mobile-dev | devops | ai-ml)

Rules:
- Validate all fields server-side with Zod
- Check email uniqueness before hashing
- Hash password bcrypt salt rounds 12
- Create user status: "unverified"
- Generate email verification token UUID v4 expires 24hrs stored hashed
- Send verification email via Resend
- Never return password_hash, tokens, or internal IDs
- Return: { success, user: { id, name, email, status } }

Schema reference: T2_03 User model.
Security reference: T2_05 auth rules.
Tell me every assumption. What could break in production?
```

### A2 — Google OAuth (Web)
```
Set up Google OAuth using NextAuth.js v5.

Flow:
1. Google returns: email, name, image, google_id
2. Email exists in DB → update last_login, return JWT session
3. Email new → create user { name, email, image, google_id, 
   status: "active", email_verified: true }
4. New user → set needs_onboarding: true in session
5. JWT expires 7 days, refresh token rotates on use

Never store Google's access or refresh tokens.
Store only: google_id, email, name, image URL.
Follow T2_05 session management rules.
Tell me every assumption. What could break?
```

### A3 — Google OAuth (Mobile — Expo)
```
Set up Google OAuth for Expo using expo-auth-session.

Flow:
1. User taps "Continue with Google"
2. expo-auth-session opens browser OAuth
3. Exchange auth code via POST /api/auth/google/mobile
4. Backend returns our JWT
5. Store JWT in expo-secure-store — never AsyncStorage
6. Check expiry on app foreground

Handle: user cancels → return to login, no error
Handle: first time → navigate to onboarding
Handle: returning → navigate to dashboard
Tell me what differs between iOS and Android.
```

### A4 — Password Reset
```
Build password reset flow. Same API for web and mobile.

POST /api/auth/forgot-password
- Accept: email
- Never confirm if email exists (prevents enumeration)
- If exists: crypto.randomBytes(32).toString('hex'), hash it, 
  store with 15min expiry
- Send reset link: [APP_URL]/reset-password?token=[raw]
- Rate limit: 3 requests per email per hour
- Always return: { message: "If that email exists, a reset link was sent" }

POST /api/auth/reset-password  
- Accept: token (raw), new_password
- Hash token, find unexpired record
- Not found/expired: { error: "Invalid or expired reset link" }
- Found: hash new password (bcrypt 12), save, delete token, 
  invalidate ALL sessions for this user
- Return: { success: true }

Token must be single-use. Delete on use.
Tell me every assumption. What could break?
```

---

## SECTION B — AI FEATURES
**Load:** T2_01, T2_03, T2_05, T2_06
**Owner:** Ramadass (backend functions) — prompts managed by Vimal in DB

### B1 — Onboarding Session
```
Build the AI onboarding session backend.

POST /api/onboarding/message
Accept: { message: string, conversation_id?: string }
Auth: required, onboarding_complete must be false

Flow:
1. Load system prompt from DB: aiPrompt where key = "onboarding"
2. Call Anthropic API with conversation history + new message
3. Save conversation to DB on each turn
4. After 7 turns → AI returns JSON result
5. Parse result, update student: { onboarding_complete: true, roadmap_type }
6. Student cannot run onboarding again — enforce server-side

Return: { conversation_id, reply, turn_number, is_complete, result? }
Stream the AI response using Anthropic streaming API.
Retry once on JSON parse failure.

Errors:
409 if onboarding already complete.
Tell me every assumption. What could break?
```

### B2 — Daily Task Generation
```
Build the daily task generation system.

GET /api/tasks/today
Auth: required

Logic:
1. Check if tasks exist for today (UTC date) → return them if yes
2. If not → fetch student context:
   roadmap_type, current step, consistency_score, depth_score,
   days_active, last 7 task titles
3. Load prompt from DB: key = "task_generation"
4. Call Anthropic API (Haiku model, with prompt caching)
5. Parse JSON response → validate structure
6. Save to DB as Task records with expires_at = end of day UTC
7. Return tasks

Fallback: if AI fails twice → return 1 default generic task for their roadmap step.
Max 3 tasks per student per day — enforce server-side.
Tell me every assumption. What could break?
```

### B3 — Quality Gate
```
Build the submission quality gate.

POST /api/tasks/submit
Accept: { task_id, content, github_link?, screenshot_url? }
Auth: required

Flow:
1. Verify task belongs to this student
2. Check task not already passed (one pass per task)
3. If github_link → call GitHub API: repo not empty, commits > 1
4. Load prompt from DB: key = "quality_gate"  
5. Call Anthropic API (Haiku model, with prompt caching)
6. Parse: { result, xp_awarded, feedback, improvement_note }
7. If pass:
   - Create submission status "passed"
   - Add XP to xp_ledger
   - Update streak via incrementStreak()
   - Check badge triggers
8. If fail:
   - Create submission status "failed"
   - Allow resubmission same day
   - Return feedback

Return: { result, xp_awarded, feedback, streak, badges_earned }
Tell me every assumption. What could break?
```

### B4 — Streak System
```
Build the streak tracking system.

Rules:
- Day boundary: midnight UTC server-side only, never client time
- Miss one day → streak resets to 0
- One freeze day per 30-day period, student activates before midnight
- Multipliers: 7d=1.1x, 30d=1.25x, 60d=1.5x, 90d=2.0x

Build these functions:
- incrementStreak(student_id) → called after task passes gate
- checkAndResetStreaks() → cron job 00:05 UTC daily
- applyStreakMultiplier(base_xp, current_streak) → returns final XP
- activateFreezeDay(student_id) → max once per 30 days

Anomaly detection on streak-critical days (30+ streak):
New device or IP compared to last 7 days → flag, hold increment,
log to moderation queue.

Schema reference: T2_03 Streak model.
Tell me every assumption. What could break?
```

---

## SECTION C — LEADERBOARDS & SCORES
**Load:** T2_01, T2_03, T2_04, T2_05
**Owner:** Ramadass (backend) + Ovian (UI)

### C1 — Consistency Leaderboard
```
Build the consistency leaderboard API.

GET /api/leaderboard/consistency
Auth: none (public)
Query: ?limit=50&page=1

Rules:
- Rank by current_streak descending
- Only students with minimum 7 days total activity
- Tie-break: equal streak → rank by total_xp descending
- Cache 5 minutes in leaderboard_cache table
- Return: [ { rank, name, college_name, roadmap_type, 
  current_streak, consistency_score, avatar_url } ]
- Never return: email, password_hash, internal IDs

Campus variant: GET /api/leaderboard/campus/:college_slug
- Top 10 from that college only
- Same rules, cached 10 minutes

Invalidate cache after every submission pass.
Tell me every assumption. What could break at scale?
```

### C2 — Score Calculation
```
Build the three-score system.

CONSISTENCY SCORE (0-100):
- daily_streak_factor 40%: current_streak / roadmap_max_days
- weekly_completion_rate 40%: tasks_completed / tasks_generated this week  
- ai_task_engagement 20%: lifetime submitted / generated

DEPTH SCORE (0-100):
- proof_per_step 50%: avg submissions with links per step
- peer_validations_received 30%: approvals / steps completed
- resource_quality 20%: avg quality gate scores on submitted resources

PROOF SCORE (0-100):
- github_commit_depth 40%: commits last 90 days (capped)
- projects_completed 30%: verified project submissions
- external_wins 30%: hackathons + internships recorded

All scores convert to percentiles within each roadmap type.
Recalculate: after every submission pass + daily cron 02:00 UTC.
Schema: T2_03 StudentScore model.
Tell me every assumption. What could break at scale?
```

---

## SECTION D — PROFILES & INTEGRATIONS
**Load:** T2_01, T2_03, T2_04, T2_05
**Owner:** Ramadass (API + integrations) + Ovian (profile UI)

### D1 — GitHub Integration
```
Build GitHub integration.

POST /api/integrations/github
Auth: required
Accept: { github_username: string }

Validation:
1. GitHub API: GET /users/:username → must exist
2. Account created_at must be 30+ days ago
3. GET /users/:username/repos → must have 3+ repos with commits > 1
4. Repos created last 7 days don't count
5. If valid → store github_username, github_verified: true
6. Award "First Commit" badge

Weekly re-verification cron:
- Re-run validation for all github_verified students
- If fails → set github_verified: false, notify student

Use env: GITHUB_TOKEN
Anti-cheat: empty repos rejected, single-commit repos rejected.
Tell me every assumption. What could break?
```

### D2 — LeetCode Integration
```
Build LeetCode integration using unofficial GraphQL endpoint.
URL: https://leetcode.com/graphql

POST /api/integrations/leetcode
Auth: required
Accept: { leetcode_username: string }

Fetch: solved count (easy/medium/hard), submission calendar, ranking.
Validation: must have solved minimum 20 problems, profile must be public.
If valid → store leetcode_username, leetcode_verified: true, cache stats.

Refresh stats daily via cron.

Handle:
- LeetCode down → use cached data, show "Last updated [date]"
- Private profile → "LeetCode profile is private" gracefully
- Rate limiting → exponential backoff, max 3 retries

Tell me every assumption. What could break?
```

---

## SECTION E — ADMIN & MODERATION
**Load:** T2_03, T2_04, T2_05
**Owner:** Ramadass (backend) + Ovian (admin UI)

### E1 — Admin Dashboard Stats
```
Build admin dashboard stats API.

GET /api/admin/stats
Auth: required, role must be "ADMIN"
No caching — admin needs real numbers.

Return:
{
  students: { total, active_7d, active_30d, new_today },
  submissions: { total_today, passed_today, failed_today, pending_review },
  streaks: { longest_active: { name, days }, avg_active },
  colleges_represented: number,
  ai_gate_pass_rate_today: number
}

All queries must complete under 500ms — indexed columns only.
Tell me every assumption.
```

### E2 — Moderation Queue
```
Build the moderation system.

Cases that reach moderator:
- AI gate flags as suspicious
- Peer approval farming detected
- Behavioral anomaly on streak-critical day
- Manual student report

GET /api/admin/moderation/queue
POST /api/admin/moderation/:id/approve — confirm legitimate
POST /api/admin/moderation/:id/reject — reject with reason, remove XP
POST /api/admin/moderation/:id/warn — warn, keep XP

On rejection:
- Negative XpLedger entry (removes XP)
- Revert streak if it was that day's qualifying action
- Notify student with specific reason
- Log to moderation_log table

Second rejection same student in 30 days → set enhanced_review: true
Tell me every assumption.
```

---

## SECTION F — MOBILE
**Load:** T2_01, T2_02, T2_05
**Owner:** Ovian (all mobile UI)

### F1 — Push Notifications
```
Build push notification system for Expo.

Use Expo Push Notifications API (handles iOS + Android).

Notification types:
1. streak_reminder — 9pm local if no activity today
2. streak_critical — 11pm if still no activity
3. badge_earned — immediate on unlock
4. new_task — 8am daily
5. leaderboard_milestone — entered top 10% of roadmap
6. peer_validation — immediate on receipt
7. opportunity_match — new matching job/hackathon

POST /api/notifications/send
Accept: { student_ids, type, data }

Rules:
- Store Expo push token on app load, update if changed
- Respect per-type preferences (student can disable each)
- No notifications between 11pm and 7am local (except streak_critical)
- Track: sent, delivered, opened in notifications_log
- Invalid token → remove from DB, don't retry

Tell me what differs between iOS and Android.
```

### F2 — Offline Mode
```
Build offline state handling for Expo app.

Use @react-native-community/netinfo to detect connection.

Works offline (cache on load):
- View today's tasks
- Write submission draft (save locally)
- View own profile
- View leaderboard with "last updated [time]" label

Requires online:
- Submit task (needs AI quality gate)
- Onboarding session
- Fetch new tasks

Show non-blocking banner when offline:
"You're offline — submissions will sync when connected"

Queue draft submissions locally → auto-submit when connection returns.
Never show crash or blank screen for network failure.
Cache in expo-secure-store.
Tell me what differs between iOS and Android.
```

---

## SECTION G — COMPANY & COLLEGE
**Load:** T2_01, T2_03, T2_04, T2_05
**Owner:** Ramadass (backend) + Ovian (UI)

### G1 — Company Talent Search
```
Build company talent search.

GET /api/company/talent/search
Auth: required, company JWT + active subscription check

Query params (all optional):
roadmap_type, domain, min_consistency_score, min_depth_score,
min_streak_days, has_github, has_projects, page, limit (max 50)

Return per student:
{ name, college_name, roadmap_type, scores, current_streak, 
  badges, github_username, profile_url }

Never return: email, phone, personal details.
Student must have profile_visible: true to appear.
Rate limit: 100 searches per company per day.
Tell me every assumption.
```

---

## UNIVERSAL FOLLOW-UP PROMPTS
Use after any output above.

### Security Check
```
Review the code against T2_05 security rules.
Check: hardcoded credentials, missing input validation, 
sensitive data in response, missing auth check, 
missing rate limiting, tokens without expiry, 
client timestamp trusted anywhere.
List every issue. Fix each one. Show corrected version.
```

### Error Handling Check
```
Every API route must handle:
- Invalid input → 400 with specific message
- Unauthenticated → 401
- Wrong role → 403
- Not found → 404
- DB failure → 500 generic (never expose DB error)
- External API failure → graceful fallback

Show every unhandled path and add proper responses.
```

### Mobile Compatibility Check
```
Review for React Native compatibility:
- Any web-only APIs? (localStorage, document, window)
- Any Node.js built-ins that won't work in Expo?
- Any library needing expo install?
List issues and Expo-compatible alternatives.
```
