# T2_06 — SECURITY RULES
> Type 2 — AI Reference. Load in every session. Every rule here is non-negotiable.
> Violations are not edge cases — they are the most common way student data gets exposed.

---

## THE ABSOLUTE RULES (Zero Exceptions)

1. **No credentials in code.** Environment variables only. `.env` never committed.
2. **Client time never trusted.** All timestamps from server (`new Date()` UTC). Always.
3. **No XP, streaks, or badges without a cleared server-side verification gate.**
4. **Auth check before every DB query on protected routes.**
5. **No raw database errors exposed to clients.**
6. **No sensitive student data (email, phone, internal IDs) returned to companies or colleges.**
7. **Passwords hashed with bcrypt, salt rounds ≥ 12. Never MD5, SHA1, or plain text.**
8. **Tokens expire. Every token. No exceptions.**
9. **Reset tokens single-use. Delete on use.**
10. **All sessions invalidated on password reset.**

---

## Authentication Rules

### JWT Tokens
- Access token expiry: 7 days (shorter for admin: 8 hours)
- Refresh tokens stored in DB (Sessions table) — not in cookies or localStorage
- On every request: verify signature, check expiry, check session still exists in DB
- On logout: delete Session record from DB immediately
- On suspicious activity: invalidate all sessions for that user

### Password Security
```typescript
// ✅ Always
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 12)
const valid = await bcrypt.compare(inputPassword, storedHash)

// ❌ Never
import crypto from 'crypto'
const hash = crypto.createHash('sha256').update(password).digest('hex')
```

### Google OAuth
- Verify Google ID token server-side using Google's public keys
- Do NOT trust client-provided user info from Google — fetch from token
- Store only: `google_id`, `email`, `name`, `image` — not Google's access or refresh tokens

### Mobile Token Storage
- JWT stored in `expo-secure-store` — encrypts with device keychain
- Never AsyncStorage (unencrypted)
- Never in-memory only (lost on app close)
- Check token expiry on every app foreground

---

## Authorisation Rules

### Role Hierarchy
```
ADMIN > MODERATOR > COMPANY > COLLEGE_ADMIN > STUDENT
```

### Route Protection Matrix
| Endpoint Pattern | Auth | Role Required |
|---|---|---|
| `/api/auth/*` | None | None |
| `/api/tasks/*` | Required | STUDENT |
| `/api/student/*` | Required | STUDENT (own data only) |
| `/api/leaderboard/*` | None | None (public) |
| `/api/integrations/*` | Required | STUDENT |
| `/api/admin/*` | Required | ADMIN or MODERATOR |
| `/api/company/*` | Required | COMPANY + active subscription |
| `/api/college/*` | Required | COLLEGE_ADMIN (own college only) |
| `/api/onboarding/*` | Required | STUDENT + onboarding_complete: false |

### Ownership Checks
Always verify the authenticated user owns the resource they're accessing:

```typescript
// ✅ Good — ownership check
const task = await prisma.task.findUnique({ where: { id: taskId } })
if (!task || task.student_id !== session.user.id) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Return 404, not 403 — don't confirm resource exists to wrong user
}

// ❌ Bad — no ownership check
const task = await prisma.task.findUnique({ where: { id: taskId } })
// Using task without verifying it belongs to this student
```

---

## Input Validation Rules

### Always Validate Server-Side
Client-side validation is UX. Server-side validation is security. Both are required.

```typescript
// Every POST/PUT/PATCH route validates with Zod
const Schema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  name: z.string().min(2).max(100).trim(),
  year_of_study: z.number().int().min(1).max(4),
})
```

### String Sanitisation
- `.trim()` all string inputs before storing
- `.toLowerCase()` all emails before comparing or storing
- Max length on all string fields (prevents DB column overflow)
- Never interpolate user input into raw SQL

### File Uploads
- Maximum file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp, image/gif
- Verify MIME type server-side (not just extension)
- Store in Supabase Storage — never local filesystem
- Validate URL before storing (must be from trusted domain)

---

## Data Exposure Rules

### API Response — What to NEVER Return
```typescript
// These fields must never appear in any API response to students, companies, or colleges:
const FORBIDDEN_FIELDS = [
  'password_hash',
  'reset_token',
  'reset_token_expires',
  'verification_token',
  'verification_token_expires',
  'google_id',
  'suspension_reason',    // show only to admins
  'enhanced_review',      // internal only
  'expo_push_token',      // device info, never expose
  'ip_address',           // sessions table
  'device_info',          // sessions table
]

// Use Prisma select to explicitly choose fields — never return full model
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true } // explicit
})
```

### Company Access Rules
Companies searching talent can see:
- Name, college_name, roadmap_type, scores, streak, badges, github_username, profile_url

Companies CANNOT see:
- Email, phone, year_of_study, domain_interest, submission_content, device info

### College Dashboard Rules
College admins see their own students only. Always filter:
```typescript
where: { college_slug: collegeAdminRecord.college_slug }
```

---

## Rate Limiting Rules

Implement rate limiting on every public-facing endpoint:

| Endpoint | Limit | Window |
|---|---|---|
| POST /register | 10 requests | per IP per hour |
| POST /login | 20 requests | per IP per hour |
| POST /forgot-password | 3 requests | per email per hour |
| POST /tasks/submit | 10 requests | per student per hour |
| GET /leaderboard/* | 60 requests | per IP per minute |
| GET /company/talent/search | 100 requests | per company per day |
| POST /onboarding/message | 20 requests | per student per hour |
| POST /integrations/* | 5 requests | per student per hour |

Use `@upstash/ratelimit` with Redis or Upstash for serverless rate limiting.

---

## Anti-Cheat Security Rules

These are platform-critical and must be enforced server-side on every relevant action:

### Timestamp Rules
```typescript
// ✅ Always — server generates all timestamps
const now = new Date() // UTC
await prisma.streak.update({ where: { student_id: id }, data: { last_active_date: now } })

// ❌ Never — client timestamp trusted
const { client_timestamp } = req.body
await prisma.streak.update({ data: { last_active_date: new Date(client_timestamp) } })
```

### Quality Gate Enforcement
```typescript
// XP is ONLY released after AI gate returns result: "pass"
// This check must happen server-side — never trust client-reported result
if (qualityGateResult.result !== 'pass') {
  // No XP, no streak, no badge — record the attempt but nothing more
  return { result: 'fail', feedback: qualityGateResult.feedback }
}
// Only after this point can XP and streak be updated
```

### GitHub Verification Enforcement
```typescript
// Before awarding GitHub badge:
// 1. Account must exist via GitHub API
// 2. Account must be 30+ days old
// 3. Must have 3+ repos with more than 1 commit each
// 4. Must verify periodically — not just on first connect
```

### Peer Approval Farming Detection
```typescript
// After every peer approval, check the relationship graph:
// If user A has approved user B AND user B has approved user A
// within the same 7-day period → flag both approvals for moderator review
// Do not award XP until moderator reviews
```

### Device/IP Anomaly Detection
```typescript
// Store device_info and ip_address in Sessions table
// On a streak-critical day (would break a 30+ day streak):
// If new device OR new IP compared to last 7 days → require re-verification task
// Log the anomaly for moderator review
```

---

## Security Checklist (Run Before Every PR)

- [ ] No credentials or secrets in code or comments
- [ ] All user inputs validated with Zod before use
- [ ] Auth check present on every protected route
- [ ] Ownership check present for user-specific resources
- [ ] No sensitive fields in API responses
- [ ] DB errors caught and not exposed to client
- [ ] All timestamps from server (`new Date()`) not client
- [ ] Rate limiting applied to endpoint if public-facing
- [ ] Token expiry set on all generated tokens
- [ ] For anti-cheat critical operations: no client-provided values trusted
