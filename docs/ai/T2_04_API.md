# T2_04 — API CONTRACTS
> Load when building any API route or calling any endpoint.

---

## Global Rules

- All responses: `Content-Type: application/json`
- Protected routes: `Authorization: Bearer <jwt>` required
- All timestamps: ISO 8601 UTC string
- Error format: `{ error: string, code?: string, field?: string }`
- Pagination: `{ data: T[], total, page, limit, has_more }`
- Never expose: `password_hash`, `reset_token`, `verification_token`, `google_id`, `ip_address`, `device_info`, `expo_push_token`
- HTTP codes: 200 OK, 201 Created, 400 Bad Input, 401 Unauth, 403 Forbidden, 404 Not Found, 409 Conflict, 410 Gone, 429 Rate Limited, 500 Server Error

---

## AUTH

### POST /api/auth/register — None
```typescript
// Request
{ name: string, email: string, password: string, college_name: string, year_of_study: 1|2|3|4, domain_interest: Domain }
// 201
{ success: true, user: { id, name, email, status: "unverified" } }
// Errors: 400 email exists | 400 invalid field
```

### POST /api/auth/login — None
```typescript
// Request
{ email: string, password: string }
// 200
{ token: string, expires_at: string, user: PublicUser }
// Errors: 401 invalid | 401 unverified | 403 suspended
```

### POST /api/auth/google — None
```typescript
// Request
{ id_token: string, platform: "web" | "mobile" }
// 200
{ token: string, expires_at: string, user: PublicUser, needs_onboarding: boolean }
```

### POST /api/auth/verify-email — None
```typescript
// Request: { token: string }
// 200: { success: true }
// 400: invalid or expired
```

### POST /api/auth/forgot-password — None — Rate: 3/hr/email
```typescript
// Request: { email: string }
// 200 always: { message: "If that email exists, a reset link was sent" }
```

### POST /api/auth/reset-password — None
```typescript
// Request: { token: string, new_password: string }
// 200: { success: true }
// 400: invalid/expired | 400: password too short
```

### GET /api/auth/me — Required
```typescript
// 200: { user: PublicUser & { onboarding_complete, roadmap_type, streak: StreakSummary } }
```

---

## ONBOARDING

### POST /api/onboarding/message — Required (onboarding_complete must be false)
```typescript
// Request: { message: string, conversation_id?: string }
// 200
{ conversation_id, reply, turn_number: 1-7, is_complete: boolean, result?: OnboardingResult }
// 409: onboarding already complete
```

---

## TASKS

### GET /api/tasks/today — Required
```typescript
// 200
{ tasks: Task[], generated_at: string, streak: StreakSummary }
```

### POST /api/tasks/submit — Required
```typescript
// Request: { task_id, content, github_link?, screenshot_url? }
// 200
{ result: "pass"|"fail", xp_awarded, feedback, improvement_note?, new_streak, multiplier, badges_earned: BadgeType[], total_xp }
// 404: task not found | 409: already passed | 410: expired
```

---

## STUDENT

### GET /api/student/dashboard — Required
```typescript
// 200
{ student: PublicUser, streak: StreakSummary, scores: ScoreSummary, today_tasks: Task[], recent_badges: Badge[], leaderboard_rank: { consistency, campus }, xp_to_next_level }
```

### GET /api/student/profile/:username — None (public)
```typescript
// 200
{ user: { id, name, username, college_name, year_of_study, roadmap_type, avatar_url, bio, github_username, leetcode_username }, streak: { current, longest }, scores: ScoreSummary, level, total_xp, badges, recent_tasks, leaderboard_rank, verified: boolean }
// 404: not found
```

### PATCH /api/student/settings — Required (own account)
```typescript
// Request: { bio?, avatar_url?, profile_visible?, notification_prefs? }
// 200: { success: true, user: PublicUser }
```

---

## LEADERBOARD — All Public, No Auth

### GET /api/leaderboard/consistency — Cache 5min
```typescript
// Query: ?limit=50&page=1
// 200: { entries: LeaderboardEntry[], total, page, limit, cached_at }
```

### GET /api/leaderboard/specialist — Cache 5min
```typescript
// Query: ?domain=FULL_STACK&limit=50
// Same shape as consistency
```

### GET /api/leaderboard/rising-stars — Cache 1hr
```typescript
// Returns students with highest XP growth in last 30 days
```

### GET /api/leaderboard/campus/:college_slug — Cache 10min
```typescript
// 200: { college_name, entries: LeaderboardEntry[10] }
```

---

## INTEGRATIONS — Required

### POST /api/integrations/github
```typescript
// Request: { github_username: string }
// 200: { success: true, github_username, verified: true, badge_earned?: "FIRST_COMMIT" }
// 400: needs more history | 400: account too new | 404: username not found
```

### DELETE /api/integrations/github
```typescript
// 200: { success: true }
```

### POST /api/integrations/leetcode
```typescript
// Request: { leetcode_username: string }
// 200: { success: true, leetcode_username, stats: LeetCodeStats }
// 400: needs 20+ solved | 400: private profile | 404: not found
```

---

## ADMIN — Required + role ADMIN or MODERATOR

### GET /api/admin/stats
```typescript
// 200 — no cache
{ students: { total, active_7d, active_30d, new_today }, submissions: { total_today, passed_today, failed_today, pending_review }, streaks: { longest_active: { name, days }, avg_active }, colleges_represented, ai_gate_pass_rate_today }
```

### GET /api/admin/moderation/queue
```typescript
// 200: { items: ModerationQueueItem[], total }
```

### POST /api/admin/moderation/:id/approve
```typescript
// Request: { note?: string } → 200: { success: true }
```

### POST /api/admin/moderation/:id/reject
```typescript
// Request: { reason: string, remove_xp: boolean } → 200: { success: true, xp_removed }
```

### GET /api/admin/prompts
```typescript
// 200: { prompts: AiPrompt[] }
```

### PUT /api/admin/prompts/:key
```typescript
// Request: { system_prompt, model?, temperature? } → 200: { success: true, prompt: AiPrompt }
```

---

## COMPANY — Required + active subscription

### GET /api/company/talent/search — Rate: 100/day/company
```typescript
// Query: roadmap_type?, domain?, min_consistency_score?, min_depth_score?, min_streak_days?, has_github?, page, limit (max 50)
// 200: { students: [{ name, college_name, roadmap_type, scores, current_streak, badges, github_username, profile_url }], total, page, limit }
```

### POST /api/company/opportunities — Required + active subscription
```typescript
// Request: { type, title, description, url, deadline?, eligible_domains?, eligible_years? }
// 201: { opportunity: Opportunity }
```

---

## COLLEGE — Required + college_admin matching slug

### GET /api/college/dashboard/:college_slug
```typescript
// 200
{ total_students, active_30d, roadmap_distribution, avg_consistency_score, top_performers: Student[5], campus_leaderboard: Student[10], placement_stats: { internships, hackathon_wins } }
```

---

## Types Reference

```typescript
type PublicUser = { id, name, username, email, college_name, year_of_study, roadmap_type, avatar_url, status, created_at }
type Task = { id, title, description, expected_output, submission_type, base_xp, difficulty, status, generated_at, expires_at }
type StreakSummary = { current, longest, multiplier, last_active_date, freeze_available }
type ScoreSummary = { consistency, depth, proof, consistency_percentile, depth_percentile, proof_percentile, total_xp, current_level }
type LeaderboardEntry = { rank, name, college_name, roadmap_type, current_streak, consistency_score, avatar_url }
type OnboardingResult = { roadmap_type: RoadmapType, explanation, proof_outcomes: string[3], closing_message }
```
