# T2_02 — STACK & ARCHITECTURE
> Load when building anything structural, adding libraries, or working across web and mobile.
> Stack is locked. Never suggest deviating without flagging it explicitly.

---

## Locked Stack

| Layer | Choice | Note |
|---|---|---|
| Web Framework | Next.js 14 App Router + TypeScript | API routes built-in |
| Mobile | Expo (React Native) + TypeScript | iOS + Android from one codebase |
| Styling Web | Tailwind CSS | |
| Styling Mobile | NativeWind v4 | Same Tailwind classes in React Native |
| Database | PostgreSQL via Supabase | Free tier, dashboard, realtime |
| ORM | Prisma | Best AI codegen, type-safe |
| Auth Web | NextAuth.js v5 | Google OAuth + JWT |
| Auth Mobile | expo-auth-session + expo-secure-store | |
| AI Provider | Anthropic Claude | Haiku for high-freq, Sonnet for quality |
| Email | Resend | |
| Push Notifications | Expo Push Notifications | iOS + Android unified |
| Payments | Razorpay | India-first |
| File Storage | Supabase Storage | Already in stack |
| Discord Bot | discord.js v14 | |
| Web Hosting | Vercel | Auto-deploys from GitHub |
| Mobile Builds | EAS (Expo Application Services) | |
| Error Monitoring | Sentry | Web + React Native |

**Rule:** Never suggest adding a library outside this stack without explicitly flagging it.

---

## How Web and Mobile Connect

```
Next.js Web (Vercel)          Expo Mobile (iOS/Android)
       │                              │
       └──────── HTTPS API calls ─────┘
                      │
              Next.js API Routes
              /api/**
                      │
                 Prisma ORM
                      │
              Supabase PostgreSQL
```

Mobile app calls the same API as web. Same endpoints, same auth (JWT in Authorization header). No mobile-specific endpoints unless absolutely necessary.

---

## AI Model Strategy

```
Haiku 4.5  → High-frequency, short-output
             Quality gate, task generation, resource review,
             streak reminders

Sonnet 4.6 → Low-frequency, quality-critical  
             AI onboarding session, monthly quest generation

Opus 4.6   → Not needed for MVP or v1
```

Always use prompt caching on system prompts (same prompt every call):
```typescript
system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }]
```

Always load prompts from DB (ai_prompts table). Never hardcode.

---

## Folder Structure

```
docs/
├── team/          T1 files — humans read
├── ai/            T2 files — AI reads
│   └── personal/  T2_ME_*.md — personal context per person
├── briefs/        Vimal's build briefs
└── logs/          Team logs

web/
├── prisma/
│   └── schema.prisma
├── public/
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   ├── verify-email/page.tsx
    │   │   └── reset-password/page.tsx
    │   ├── (onboarding)/onboarding/page.tsx
    │   ├── (student)/
    │   │   ├── dashboard/page.tsx
    │   │   ├── tasks/page.tsx
    │   │   ├── profile/[username]/page.tsx
    │   │   ├── leaderboard/page.tsx
    │   │   └── opportunities/page.tsx
    │   ├── (admin)/admin/
    │   │   ├── dashboard/page.tsx
    │   │   ├── users/page.tsx
    │   │   ├── moderation/page.tsx
    │   │   ├── roadmaps/page.tsx
    │   │   └── prompts/page.tsx
    │   ├── (company)/company/
    │   └── (college)/college/
    │   └── api/
    │       ├── auth/
    │       ├── onboarding/
    │       ├── tasks/
    │       ├── student/
    │       ├── leaderboard/
    │       ├── integrations/
    │       ├── admin/
    │       ├── company/
    │       ├── college/
    │       └── webhooks/
    ├── components/
    │   ├── ui/           ← shadcn/ui — Ovian owns
    │   ├── auth/         ← Ovian owns
    │   ├── student/      ← Ovian owns
    │   ├── leaderboard/  ← Ovian owns
    │   ├── profile/      ← Ovian owns
    │   └── admin/        ← Ovian owns
    ├── lib/
    │   ├── ai/           ← Ramadass owns
    │   ├── auth/         ← Ramadass owns
    │   ├── db/           ← Ramadass owns
    │   ├── integrations/ ← Ramadass owns
    │   ├── gamification/ ← Ramadass owns
    │   └── utils/        ← shared, coordinate before touching
    └── types/            ← shared, coordinate before touching

mobile/
└── src/
    ├── app/              ← Expo Router — Ovian owns
    ├── components/       ← Ovian owns
    └── lib/
        ├── api/client.ts ← shared API client
        ├── auth/         ← Ovian owns
        └── offline/      ← Ovian owns

discord-bot/              ← Ramadass owns
```

---

## Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NODE_ENV=development

# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=
AI_MODEL_FAST=claude-haiku-4-5-20251001
AI_MODEL_QUALITY=claude-sonnet-4-6

# Integrations
GITHUB_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=noreply@eakalaiva.in
DISCORD_BOT_TOKEN=
DISCORD_SERVER_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mobile (EXPO_PUBLIC_ prefix for client-side)
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Monitoring
SENTRY_DSN=
```

---

## Design Tokens

```typescript
// Never hardcode colors. Use these always.
primary: '#6366F1'      // Indigo — brand
primary_dark: '#4F46E5'
accent: '#F59E0B'       // Amber — streak, achievements
success: '#10B981'      // Green — pass, verified
danger: '#EF4444'       // Red — fail, warning
neutral_50: '#F9FAFB'
neutral_900: '#111827'
```

---

## Cron Jobs

| Job | Schedule (UTC) | Function |
|---|---|---|
| Reset expired streaks | 00:05 daily | checkAndResetStreaks() |
| Generate daily tasks | 06:00 daily | generateDailyTasksForAll() |
| Send streak reminders | 15:30 daily (≈9pm IST) | sendStreakReminders() |
| Recompute scores | 02:00 daily | recomputeAllScores() |
| GitHub re-verify | Sunday 03:00 | reverifyGitHubAccounts() |
| LeetCode refresh | 04:00 daily | refreshLeetCodeStats() |
| Leaderboard rebuild | Hourly | rebuildLeaderboardCache() |

All jobs must be idempotent (safe to run twice).
