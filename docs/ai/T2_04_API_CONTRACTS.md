# T2_04 — API CONTRACTS
> Type 2 — AI Reference. Load when building any API route or calling any endpoint.
> Every endpoint, auth requirement, request shape, and response shape defined here.

---

## Global Rules

- All responses: `Content-Type: application/json`
- All protected routes: `Authorization: Bearer <jwt>` header required
- All timestamps in responses: ISO 8601 UTC string
- Error format always: `{ error: string, code?: string, field?: string }`
- Pagination: `{ data: T[], total: number, page: number, limit: number, has_more: boolean }`
- Never expose: `password_hash`, `reset_token`, `verification_token`, `google_id` (internal)
- Rate limiting headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## AUTH ENDPOINTS

### POST /api/auth/register
**Auth:** None
**Rate limit:** 10/hour per IP
```typescript
// Request
{ name: string, email: string, password: string, college_name: string, year_of_study: 1|2|3|4, domain_interest: Domain }

// Response 201
{ success: true, message: "Verification email sent", user: { id, name, email, status: "unverified" } }

// Errors
400: { error: "Email already registered" }
400: { error: "Invalid domain", field: "domain_interest" }
400: { error: "Password must be at least 8 characters", field: "password" }
```

### POST /api/auth/login
**Auth:** None
**Rate limit:** 20/hour per IP
```typescript
// Request
{ email: string, password: string }

// Response 200
{ token: string, expires_at: string, user: PublicUser }

// Errors
401: { error: "Invalid email or password" }
401: { error: "Please verify your email before logging in" }
403: { error: "Account suspended", reason: string }
```

### POST /api/auth/google
**Auth:** None
```typescript
// Request
{ id_token: string, platform: "web" | "mobile" }

// Response 200
{ token: string, expires_at: string, user: PublicUser, needs_onboarding: boolean }
```

### POST /api/auth/verify-email
**Auth:** None
```typescript
// Request
{ token: string }

// Response 200
{ success: true, message: "Email verified" }

// Errors
400: { error: "Invalid or expired verification link" }
```

### POST /api/auth/forgot-password
**Auth:** None
**Rate limit:** 3/hour per email
```typescript
// Request
{ email: string }

// Response 200 (always — never confirm email existence)
{ message: "If that email exists, a reset link has been sent" }
```

### POST /api/auth/reset-password
**Auth:** None
```typescript
// Request
{ token: string, new_password: string }

// Response 200
{ success: true, message: "Password updated. Please log in." }

// Errors
400: { error: "Invalid or expired reset link" }
400: { error: "Password must be at least 8 characters", field: "new_password" }
```

### GET /api/auth/me
**Auth:** Required
```typescript
// Response 200
{ user: PublicUser & { onboarding_complete, roadmap_type, streak: StreakSummary } }
```

---

## ONBOARDING ENDPOINTS

### POST /api/onboarding/message
**Auth:** Required (student)
**Constraint:** User must have `onboarding_complete: false`
```typescript
// Request
{ message: string, conversation_id?: string }

// Response 200
{ 
  conversation_id: string,
  reply: string,             // AI message streamed or full
  turn_number: number,       // 1-7
  is_complete: boolean,
  result?: {
    roadmap_type: RoadmapType,
    explanation: string,
    proof_outcomes: string[],
    closing_message: string
  }
}

// Errors
409: { error: "Onboarding already complete" }
```

---

## TASK ENDPOINTS

### GET /api/tasks/today
**Auth:** Required (student)
```typescript
// Response 200
{ 
  tasks: Task[],
  generated_at: string,
  streak: { current: number, multiplier: number }
}
```

### POST /api/tasks/submit
**Auth:** Required (student)
```typescript
// Request
{ task_id: string, content: string, github_link?: string, screenshot_url?: string }

// Response 200
{
  result: "pass" | "fail",
  xp_awarded: number,
  feedback: string,
  improvement_note?: string,
  new_streak: number,
  multiplier: number,
  badges_earned: BadgeType[],
  total_xp: number
}

// Errors
404: { error: "Task not found" }
409: { error: "Task already submitted and passed" }
410: { error: "Task expired" }
```

---

## STUDENT ENDPOINTS

### GET /api/student/dashboard
**Auth:** Required (student)
```typescript
// Response 200
{
  student: PublicUser,
  streak: StreakSummary,
  scores: ScoreSummary,
  today_tasks: Task[],
  recent_badges: Badge[],
  leaderboard_rank: { consistency: number, campus: number },
  xp_to_next_level: number
}
```

### GET /api/student/profile/:username
**Auth:** None (public)
```typescript
// Response 200
{
  user: {
    id, name, username, college_name, year_of_study, roadmap_type,
    avatar_url, bio, created_at, github_username, leetcode_username
  },
  streak: { current: number, longest: number },
  scores: { consistency: number, depth: number, proof: number, percentiles },
  level: number,
  total_xp: number,
  badges: Badge[],
  recent_tasks: { title, completed_at, xp_earned }[],
  leaderboard_rank: { consistency: number, campus: number },
  verified: boolean // 30+ days activity
}

// Errors
404: { error: "Profile not found" }
```

### PATCH /api/student/settings
**Auth:** Required (student, own account only)
```typescript
// Request (all optional)
{ bio?: string, avatar_url?: string, profile_visible?: boolean, notification_prefs?: object }

// Response 200
{ success: true, user: PublicUser }
```

---

## LEADERBOARD ENDPOINTS

### GET /api/leaderboard/consistency
**Auth:** None (public)
**Cache:** 5 minutes
```typescript
// Query: ?limit=50&page=1
// Response 200
{
  entries: [{ rank, name, college_name, roadmap_type, current_streak, consistency_score, avatar_url }],
  total: number, page: number, limit: number, cached_at: string
}
```

### GET /api/leaderboard/specialist
**Auth:** None (public)
**Cache:** 5 minutes
```typescript
// Query: ?domain=FULL_STACK&limit=50
// Response 200 — same shape as consistency
```

### GET /api/leaderboard/rising-stars
**Auth:** None (public)
**Cache:** 1 hour
```typescript
// Query: ?limit=50
// Returns students with highest XP growth in last 30 days
```

### GET /api/leaderboard/campus/:college_slug
**Auth:** None (public)
**Cache:** 10 minutes
```typescript
// Response 200
{ college_name, entries: LeaderboardEntry[10] }
```

---

## INTEGRATION ENDPOINTS

### POST /api/integrations/github
**Auth:** Required (student)
```typescript
// Request
{ github_username: string }

// Response 200
{ success: true, github_username, verified: true, badge_earned?: "FIRST_COMMIT" }

// Errors
400: { error: "GitHub account needs more real project history" }
400: { error: "GitHub account too new (must be 30+ days old)" }
404: { error: "GitHub username not found" }
```

### DELETE /api/integrations/github
**Auth:** Required (student)
```typescript
// Response 200
{ success: true, message: "GitHub disconnected" }
```

### POST /api/integrations/leetcode
**Auth:** Required (student)
```typescript
// Request
{ leetcode_username: string }

// Response 200
{ success: true, leetcode_username, stats: LeetCodeStats }

// Errors
400: { error: "LeetCode account needs at least 20 solved problems" }
400: { error: "LeetCode profile is private" }
404: { error: "LeetCode username not found" }
```

---

## ADMIN ENDPOINTS
**All require:** Auth + role === "ADMIN" or "MODERATOR"

### GET /api/admin/stats
**Auth:** Required (admin)
```typescript
// Response 200 — real-time, no cache
{
  students: { total, active_7d, active_30d, new_today },
  submissions: { total_today, passed_today, failed_today, pending_review },
  streaks: { longest_active: { name, days }, average_active },
  colleges_represented: number,
  ai_gate_pass_rate_today: number
}
```

### GET /api/admin/moderation/queue
**Auth:** Required (admin/moderator)
```typescript
// Response 200
{ items: ModerationQueueItem[], total: number }
```

### POST /api/admin/moderation/:submission_id/approve
**Auth:** Required (admin/moderator)
```typescript
// Request
{ note?: string }
// Response 200
{ success: true }
```

### POST /api/admin/moderation/:submission_id/reject
**Auth:** Required (admin/moderator)
```typescript
// Request
{ reason: string, remove_xp: boolean }
// Response 200
{ success: true, xp_removed: number }
```

### GET /api/admin/prompts
**Auth:** Required (admin)
```typescript
// Response 200
{ prompts: AiPrompt[] }
```

### PUT /api/admin/prompts/:key
**Auth:** Required (admin)
```typescript
// Request
{ system_prompt: string, model?: string, temperature?: number }
// Response 200
{ success: true, prompt: AiPrompt }
```

---

## COMPANY ENDPOINTS

### GET /api/company/talent/search
**Auth:** Required (company + active subscription)
**Rate limit:** 100/day per company
```typescript
// Query params (all optional):
// roadmap_type, domain, min_consistency_score, min_depth_score, min_streak_days,
// has_github, has_projects, page, limit (max 50)

// Response 200
{
  students: [{
    name, college_name, roadmap_type, domain, scores,
    current_streak, badges, github_username, profile_url
  }],
  total, page, limit
}
```

### POST /api/company/opportunities
**Auth:** Required (company + active subscription)
```typescript
// Request
{ type, title, description, url, deadline?, eligible_domains?, eligible_years?, location? }
// Response 201
{ opportunity: Opportunity }
```

---

## COLLEGE ENDPOINTS

### GET /api/college/dashboard/:college_slug
**Auth:** Required (college_admin matching slug)
```typescript
// Response 200
{
  total_students, active_30d, roadmap_distribution,
  avg_consistency_score, top_performers: Student[5],
  campus_leaderboard: Student[10],
  placement_stats: { internships, hackathon_wins }
}
```

---

## TYPES REFERENCE

```typescript
type PublicUser = {
  id: string, name: string, username: string, email: string,
  college_name: string, year_of_study: number,
  roadmap_type: RoadmapType, avatar_url: string | null,
  status: UserStatus, created_at: string
}

type Task = {
  id: string, title: string, description: string,
  expected_output: string, submission_type: string,
  base_xp: number, difficulty: "easy"|"medium"|"hard",
  status: TaskStatus, generated_at: string, expires_at: string
}

type StreakSummary = {
  current: number, longest: number, multiplier: number,
  last_active_date: string | null, freeze_available: boolean
}

type ScoreSummary = {
  consistency: number, depth: number, proof: number,
  consistency_percentile: number, depth_percentile: number, proof_percentile: number,
  total_xp: number, current_level: number
}
```
