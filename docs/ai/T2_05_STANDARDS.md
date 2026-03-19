# T2_05 — STANDARDS & SECURITY
> Load in every session. Every rule here applies to every line generated.

---

## ABSOLUTE RULES — ZERO EXCEPTIONS

1. No credentials or secrets in code. Environment variables only. `.env` never committed.
2. Client time never trusted. All timestamps from server `new Date()` UTC only.
3. No XP, streak, or badge without server-side verification gate passing.
4. Auth check before every DB query on protected routes.
5. No raw DB errors exposed to clients — log internally, return generic message.
6. No sensitive fields in API responses — see forbidden list below.
7. Passwords hashed with bcrypt salt rounds ≥ 12. Never MD5, SHA1, plain text.
8. All tokens expire. Every token. No exceptions.
9. Reset tokens single-use — delete on use.
10. All sessions invalidated on password reset.

---

## CODE STANDARDS

### TypeScript
- No `any` type. No `// @ts-ignore` without written explanation.
- All function parameters typed explicitly.
- Use `type` for shapes. `interface` only for extendable contracts.
- `const` over `let`. Never `var`.

### Naming
| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `LeaderboardTable.tsx` |
| Utils / lib | camelCase | `xpCalculator.ts` |
| API routes | `route.ts` in folder | `app/api/tasks/submit/route.ts` |
| Constants | SCREAMING_SNAKE | `MAX_TASKS_PER_DAY` |
| DB columns | snake_case | Prisma maps automatically |
| Env vars | SCREAMING_SNAKE | `ANTHROPIC_API_KEY` |
| Expo public vars | `EXPO_PUBLIC_` prefix | `EXPO_PUBLIC_API_URL` |

### Imports Order
```typescript
// 1. External libs
import { NextResponse } from 'next/server'
// 2. Internal lib
import { prisma } from '@/lib/db/client'
// 3. Types
import type { Task } from '@/types/task'
```

### API Route Pattern
```typescript
export async function POST(request: NextRequest) {
  // 1. Auth first — always before anything else
  const session = await requireAuth(request)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // 2. Validate input with Zod
  const body = await request.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })

  // 3. Business logic in try/catch
  try {
    const result = await prisma.something.create({ data: parsed.data })
    return NextResponse.json({ result }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/route]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

### Input Validation — Always Zod
```typescript
const Schema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  name: z.string().min(2).max(100).trim(),
  year_of_study: z.number().int().min(1).max(4),
})
```

### Database Rules
- Always `select` only needed fields — never return full model unnecessarily
- Always paginate queries returning more than 100 rows
- Use `prisma.$transaction([...])` for multi-step writes
- Never `deleteMany` without a specific `where` clause

### React Component Pattern (Web)
```typescript
'use client' // only when needed
interface Props { task: Task; onSubmit: (id: string) => Promise<void> }
export function TaskCard({ task, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Always handle loading, error, empty states
}
```

### React Native Pattern (Expo)
- NativeWind classes only — no inline `style={{}}` except dynamic values
- All touch targets use `Pressable` not `TouchableOpacity`
- Images use `expo-image` not RN `<Image>`
- Safe area insets via `useSafeAreaInsets`
- Never `localStorage` or `sessionStorage` — use `expo-secure-store`

### AI API Call Pattern
```typescript
const promptConfig = await prisma.aiPrompt.findUnique({ where: { key: 'quality_gate' } })
if (!promptConfig) throw new Error('Prompt not configured')

const response = await client.messages.create({
  model: promptConfig.model,
  max_tokens: promptConfig.max_tokens,
  system: [{ type: "text", text: promptConfig.system_prompt, cache_control: { type: "ephemeral" } }],
  messages: [{ role: 'user', content: userInput }]
})
// Always parse JSON safely — wrap in try/catch
```

---

## SECURITY RULES

### Forbidden Fields — Never in Any API Response
```
password_hash, reset_token, reset_token_expires,
verification_token, verification_token_expires,
google_id, suspension_reason, enhanced_review,
expo_push_token, ip_address, device_info
```

### Auth Rules
- JWT access token: 7 days (admin: 8 hours)
- Refresh tokens in DB Sessions table — not cookies or localStorage
- Every request: verify signature + expiry + session exists in DB
- On logout: delete Session record immediately
- On suspicious activity: invalidate all sessions for user

### Authorisation Matrix
| Endpoint | Auth | Role |
|---|---|---|
| `/api/auth/*` | None | — |
| `/api/tasks/*` | Required | STUDENT |
| `/api/student/*` | Required | STUDENT (own data only) |
| `/api/leaderboard/*` | None | Public |
| `/api/integrations/*` | Required | STUDENT |
| `/api/admin/*` | Required | ADMIN or MODERATOR |
| `/api/company/*` | Required | COMPANY + active subscription |
| `/api/college/*` | Required | COLLEGE_ADMIN (own college only) |
| `/api/onboarding/*` | Required | STUDENT + onboarding_complete false |

### Ownership Check Pattern
```typescript
const task = await prisma.task.findUnique({ where: { id: taskId } })
if (!task || task.student_id !== session.user.id) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // 404 not 403 — don't confirm resource exists to wrong user
}
```

### Rate Limits
| Endpoint | Limit |
|---|---|
| POST /register | 10/hr/IP |
| POST /login | 20/hr/IP |
| POST /forgot-password | 3/hr/email |
| POST /tasks/submit | 10/hr/student |
| GET /leaderboard/* | 60/min/IP |
| GET /company/talent/search | 100/day/company |

### Anti-Cheat Enforcement
```typescript
// NEVER trust client timestamp
const { client_timestamp } = req.body // ❌
const now = new Date() // ✅ always server time

// XP only after gate passes
if (qualityGateResult.result !== 'pass') {
  return { result: 'fail', feedback: qualityGateResult.feedback }
  // Nothing else. No XP, no streak, no badge.
}

// GitHub badge: account 30+ days, 3+ repos with >1 commit, check via API
// Peer approval: after every approval, check mutual-only pattern → flag if detected
// Streak anomaly: new device/IP on 30+ streak day → hold increment, flag for review
```

### Security Checklist (Before Every PR)
- [ ] No credentials or secrets in code or comments
- [ ] All user inputs validated with Zod before use
- [ ] Auth check present on every protected route
- [ ] Ownership check for user-specific resources
- [ ] No sensitive fields in API responses
- [ ] DB errors caught, not exposed to client
- [ ] All timestamps from `new Date()` not client body
- [ ] Rate limiting on public-facing endpoints
- [ ] Token expiry set on all generated tokens
- [ ] No client-provided values trusted for anti-cheat operations

---

## NEVER DO THIS

```typescript
// ❌ Hardcoded credential
const key = 'sk-ant-...'

// ❌ Trust client timestamp
const { timestamp } = req.body
await prisma.task.create({ data: { created_at: timestamp } })

// ❌ Expose DB error
return NextResponse.json({ error: error.message }, { status: 500 })

// ❌ No validation
const { email } = await request.json()
await prisma.user.findUnique({ where: { email } }) // unsanitised

// ❌ localStorage in React Native
localStorage.setItem('token', jwt)

// ❌ any type
const data: any = response.json()

// ❌ Hardcoded AI prompt
const prompt = "You are the quality gate..." // must come from DB
```
