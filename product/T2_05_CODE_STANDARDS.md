# T2_05 — CODE STANDARDS
> Type 2 — AI Reference. Load in every session. These standards apply to every line generated.

---

## Language & Types

- **TypeScript everywhere.** No `any` type. No `// @ts-ignore` without a written explanation.
- All function parameters typed explicitly. No implicit `any` from missing types.
- Use `type` for object shapes. Use `interface` only for classes and extendable contracts.
- Use `enum` for fixed value sets that match the Prisma schema — import from `@/types/`.
- Prefer `const` over `let`. Never use `var`.

```typescript
// ✅ Good
const getStudent = async (id: string): Promise<Student | null> => { ... }

// ❌ Bad
const getStudent = async (id) => { ... }
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `LeaderboardTable.tsx` |
| Files (utils, lib) | camelCase | `xpCalculator.ts` |
| Files (API routes) | `route.ts` | `src/app/api/auth/login/route.ts` |
| React components | PascalCase | `StreakBadge` |
| Functions | camelCase | `calculateConsistencyScore` |
| Variables | camelCase | `currentStreak` |
| Constants | SCREAMING_SNAKE | `MAX_TASKS_PER_DAY = 3` |
| DB columns | snake_case | `current_streak` (Prisma maps these) |
| API route params | kebab-case | `/api/leaderboard/rising-stars` |
| Env variables | SCREAMING_SNAKE | `ANTHROPIC_API_KEY` |
| Expo public vars | `EXPO_PUBLIC_` prefix | `EXPO_PUBLIC_API_URL` |

---

## File Organisation

Every file starts with: imports (external → internal → types → styles)

```typescript
// 1. External libs
import { NextResponse } from 'next/server'
import { z } from 'zod'

// 2. Internal lib
import { prisma } from '@/lib/db/client'
import { validateAuth } from '@/lib/auth/session'

// 3. Types
import type { Task, Student } from '@/types/student'

// Never mix these groups. Always in this order.
```

---

## API Route Pattern (Next.js App Router)

```typescript
// src/app/api/tasks/today/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/client'
import { requireAuth } from '@/lib/auth/middleware'

// Input validation schema — always define this
const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
})

export async function GET(request: NextRequest) {
  // 1. Auth check first — always
  const session = await requireAuth(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // 2. Parse and validate input
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = QuerySchema.safeParse(searchParams)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // 3. Business logic in try/catch
  try {
    const tasks = await prisma.task.findMany({
      where: { student_id: session.user.id, status: 'GENERATED' },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('[GET /api/tasks/today]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**Rules:**
- Auth check is always first. Before any DB query.
- Input validation with Zod on every route that accepts input.
- Try/catch around every DB query. Never let a DB error reach the client.
- Console.error with route identifier for every caught error.
- Never expose raw error messages or stack traces in responses.

---

## Input Validation — Always Use Zod

```typescript
// ✅ Good
const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  year_of_study: z.number().int().min(1).max(4),
})

const body = await request.json()
const parsed = RegisterSchema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
}
// parsed.data is now fully typed and safe

// ❌ Bad
const { name, email } = await request.json()
// Directly using user input without validation
```

---

## Database Query Rules

```typescript
// ✅ Good — use Prisma, fully typed
const student = await prisma.user.findUnique({
  where: { id: studentId },
  select: { id: true, name: true, email: true, roadmap_type: true } // select only what you need
})

// ❌ Bad — raw SQL without sanitisation
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`)

// ✅ Good — pagination always
const tasks = await prisma.task.findMany({
  where: { student_id: id },
  take: limit,
  skip: (page - 1) * limit,
  orderBy: { generated_at: 'desc' }
})

// ❌ Bad — unbounded query
const allTasks = await prisma.task.findMany()
```

**Rules:**
- Always use `select` to specify only the fields needed — never return full model when subset needed.
- Always paginate queries that could return more than 100 rows.
- Use Prisma transactions for multi-step writes: `prisma.$transaction([...])`
- Never use `deleteMany` without a specific `where` clause.

---

## Error Handling Pattern

```typescript
// ✅ Good — specific error handling
try {
  const result = await externalApiCall()
  return result
} catch (error) {
  if (error instanceof ExternalApiError) {
    // Handle gracefully — return cached or default
    return fallbackData
  }
  // Unknown error — log and return generic message
  console.error('[functionName] Unexpected error:', error)
  throw new Error('Service temporarily unavailable')
}
```

**HTTP Status codes to always use correctly:**
- `200` OK
- `201` Created (new resource)
- `400` Bad request (invalid input)
- `401` Unauthenticated (no/invalid token)
- `403` Unauthorised (valid token, wrong role)
- `404` Not found
- `409` Conflict (duplicate, already exists)
- `410` Gone (expired resource — e.g., expired task)
- `429` Rate limited
- `500` Server error (internal — never expose details)

---

## React Component Pattern (Web)

```typescript
// ✅ Good
'use client'

import { useState } from 'react'
import type { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  onSubmit: (taskId: string, content: string) => Promise<void>
}

export function TaskCard({ task, onSubmit }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (content: string) => {
    setLoading(true)
    setError(null)
    try {
      await onSubmit(task.id, content)
    } catch {
      setError('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-6">
      {/* Component content */}
    </div>
  )
}
```

**Rules:**
- Every interactive component handles loading, error, and empty states.
- Never let a component crash silently — always show a message.
- Props typed with explicit interfaces — no inline type definitions.
- `'use client'` only when actually using browser APIs or interactivity.
- Server components by default in Next.js App Router.

---

## React Native / Expo Component Pattern

```typescript
// ✅ Good
import { View, Text, Pressable } from 'react-native'
import type { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  onPress: () => void
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-neutral-200 p-4 bg-white"
    >
      <Text className="text-lg font-semibold text-neutral-900">{task.title}</Text>
      <Text className="mt-2 text-sm text-neutral-500">{task.description}</Text>
    </Pressable>
  )
}
```

**Rules:**
- NativeWind classes — same as Tailwind, no inline styles.
- Never use `style={{ }}` except for dynamic values NativeWind can't handle.
- All touch targets use `Pressable`, not `TouchableOpacity` (React Native 0.70+).
- Images use `expo-image` not `<Image>` from React Native.
- Safe area insets always handled with `useSafeAreaInsets`.

---

## AI API Call Pattern

```typescript
// ✅ Good
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/db/client'

const client = new Anthropic() // uses ANTHROPIC_API_KEY from env

export async function runQualityGate(taskId: string, submission: string): Promise<QualityGateResult> {
  // Load prompt from DB — never hardcode
  const promptConfig = await prisma.aiPrompt.findUnique({
    where: { key: 'quality_gate' }
  })
  if (!promptConfig) throw new Error('Quality gate prompt not configured')

  const response = await client.messages.create({
    model: promptConfig.model,
    max_tokens: promptConfig.max_tokens,
    system: promptConfig.system_prompt,
    messages: [{ role: 'user', content: submission }]
  })

  // Parse JSON safely
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    return JSON.parse(text) as QualityGateResult
  } catch {
    throw new Error('AI returned invalid JSON — retry or use fallback')
  }
}
```

---

## What To Never Do

```typescript
// ❌ Never hardcode credentials
const API_KEY = 'sk-ant-...'

// ❌ Never use any type
const data: any = response.json()

// ❌ Never trust client-provided timestamps
const { timestamp } = req.body
await prisma.task.create({ data: { created_at: timestamp } })
// ✅ Always use server time
await prisma.task.create({ data: { created_at: new Date() } })

// ❌ Never log sensitive data
console.log('User logged in:', { email, password })

// ❌ Never expose DB errors
return NextResponse.json({ error: error.message }, { status: 500 })
// ✅ Log internally, return generic
console.error('[route]', error)
return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })

// ❌ Never skip validation on "safe" routes
// Every route that touches DB needs input validation

// ❌ Never use localStorage in React Native
localStorage.setItem('token', jwt)
// ✅ Use expo-secure-store
await SecureStore.setItemAsync('token', jwt)
```
