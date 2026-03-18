# T2_02 — TECH ARCHITECTURE
> Type 2 — AI Reference. Load when building anything structural, adding libraries, or working across web and mobile.

---

## Stack Decisions (Locked — Do Not Deviate Without Team Decision)

| Layer | Choice | Why |
|---|---|---|
| **Web Framework** | Next.js 14 (App Router) + TypeScript | Best AI codegen support, API routes built-in, serves web + mobile |
| **Mobile Framework** | Expo (React Native) + TypeScript | Single codebase for iOS + Android, best small-team option |
| **Styling (Web)** | Tailwind CSS | AI generates Tailwind well, fastest iteration |
| **Styling (Mobile)** | NativeWind v4 | Tailwind classes work in React Native — same knowledge, both platforms |
| **Database** | PostgreSQL via Supabase | Free tier, realtime, storage, built-in auth option, dashboard |
| **ORM** | Prisma | Best AI codegen, type-safe, migration system |
| **Auth (Web)** | NextAuth.js v5 | Handles Google OAuth cleanly with Next.js |
| **Auth (Mobile)** | expo-auth-session + expo-secure-store | Official Expo auth, secure token storage |
| **AI Provider** | Anthropic Claude (claude-sonnet-4-20250514) | Platform AI companion, quality gate, onboarding |
| **Email** | Resend | Simple API, free tier, React email templates |
| **Push Notifications** | Expo Push Notifications | Handles iOS + Android from one API, free |
| **Payments** | Razorpay | India-first, best UPI/card support |
| **File Storage** | Supabase Storage | Already in stack, avoids extra service |
| **Discord Bot** | discord.js v14 | Standard, best documentation |
| **Web Hosting** | Vercel | Auto-deploys from GitHub, optimal for Next.js |
| **Mobile Builds** | EAS (Expo Application Services) | Official Expo CI/CD for store submissions |
| **Error Monitoring** | Sentry | Web + React Native SDK, free tier |

**Rule for AI:** Never suggest adding a library outside this stack without explicitly flagging it. The team must agree before any new dependency is introduced.

---

## How Web and Mobile Connect

The Expo mobile app is a **separate app calling the same Next.js API** as the web.

```
┌─────────────────┐      ┌─────────────────┐
│   Next.js Web   │      │   Expo Mobile   │
│   (Vercel)      │      │   (iOS/Android) │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │    HTTPS API calls     │
         └──────────┬─────────────┘
                    │
         ┌──────────▼─────────────┐
         │   Next.js API Routes   │
         │   /api/**              │
         └──────────┬─────────────┘
                    │
         ┌──────────▼─────────────┐
         │   Prisma ORM           │
         └──────────┬─────────────┘
                    │
         ┌──────────▼─────────────┐
         │   Supabase PostgreSQL  │
         └────────────────────────┘
```

**Mobile-specific rule:** All API calls from mobile include the JWT in Authorization header. Same endpoints, same auth. No mobile-specific endpoints unless absolutely necessary.

---

## Folder Structure (Complete)

```
eakalaiva/
├── .env.example
├── .gitignore
├── package.json
├── turbo.json                    ← Turborepo config (if using monorepo)
│
├── docs/
│   ├── team/                     ← T1 files (humans read)
│   │   ├── T1_01_TEAM_OS.md
│   │   ├── T1_02_VIBE_CODE_RULES.md
│   │   ├── T1_03_PROMPT_PLAYBOOK.md
│   │   ├── T1_04_PRODUCT_ROADMAP.md
│   │   └── T1_05_GIT_AND_LOGS.md
│   ├── ai/                       ← T2 files (AI reads)
│   │   ├── T2_01_PROJECT_CONTEXT.md
│   │   ├── T2_02_TECH_ARCHITECTURE.md
│   │   ├── T2_03_DATABASE_SCHEMA.md
│   │   ├── T2_04_API_CONTRACTS.md
│   │   ├── T2_05_CODE_STANDARDS.md
│   │   ├── T2_06_SECURITY_RULES.md
│   │   └── T2_07_FEATURE_SPECS.md
│   ├── briefs/                   ← Vimal's build briefs
│   └── logs/
│       ├── AI_BUILD_LOG.md
│       ├── INCIDENT_LOG.md
│       ├── DECISION_LOG.md
│       ├── WEEKLY_REVIEW.md
│       ├── KNOWN_ISSUES.md
│       ├── OUTREACH_LOG.md
│       └── EQUITY_AND_COMP.md
│
├── web/                          ← Next.js app
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   └── src/
│       ├── app/                  ← Next.js App Router
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   ├── register/
│       │   │   │   └── page.tsx
│       │   │   ├── verify-email/
│       │   │   │   └── page.tsx
│       │   │   ├── forgot-password/
│       │   │   │   └── page.tsx
│       │   │   └── reset-password/
│       │   │       └── page.tsx
│       │   ├── (onboarding)/
│       │   │   └── onboarding/
│       │   │       └── page.tsx
│       │   ├── (student)/
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── tasks/
│       │   │   │   └── page.tsx
│       │   │   ├── profile/
│       │   │   │   └── [username]/
│       │   │   │       └── page.tsx
│       │   │   ├── leaderboard/
│       │   │   │   └── page.tsx
│       │   │   ├── opportunities/
│       │   │   │   └── page.tsx
│       │   │   └── settings/
│       │   │       └── page.tsx
│       │   ├── (admin)/
│       │   │   ├── admin/
│       │   │   │   ├── dashboard/
│       │   │   │   ├── users/
│       │   │   │   ├── moderation/
│       │   │   │   ├── roadmaps/
│       │   │   │   ├── prompts/
│       │   │   │   └── analytics/
│       │   ├── (company)/
│       │   │   └── company/
│       │   │       ├── dashboard/
│       │   │       ├── search/
│       │   │       └── post/
│       │   ├── (college)/
│       │   │   └── college/
│       │   │       └── dashboard/
│       │   └── api/
│       │       ├── auth/
│       │       │   ├── register/route.ts
│       │       │   ├── login/route.ts
│       │       │   ├── google/route.ts
│       │       │   ├── verify-email/route.ts
│       │       │   ├── forgot-password/route.ts
│       │       │   └── reset-password/route.ts
│       │       ├── onboarding/
│       │       │   └── message/route.ts
│       │       ├── tasks/
│       │       │   ├── today/route.ts
│       │       │   └── submit/route.ts
│       │       ├── student/
│       │       │   ├── dashboard/route.ts
│       │       │   └── profile/[username]/route.ts
│       │       ├── leaderboard/
│       │       │   ├── consistency/route.ts
│       │       │   ├── specialist/route.ts
│       │       │   ├── rising-stars/route.ts
│       │       │   └── campus/[college_slug]/route.ts
│       │       ├── integrations/
│       │       │   ├── github/route.ts
│       │       │   └── leetcode/route.ts
│       │       ├── admin/
│       │       │   ├── stats/route.ts
│       │       │   ├── moderation/route.ts
│       │       │   └── prompts/route.ts
│       │       ├── company/
│       │       │   └── talent/search/route.ts
│       │       ├── college/
│       │       │   └── dashboard/[college_slug]/route.ts
│       │       └── webhooks/
│       │           └── discord/route.ts
│       ├── components/
│       │   ├── ui/               ← shadcn/ui components
│       │   ├── auth/
│       │   ├── student/
│       │   │   ├── TaskCard.tsx
│       │   │   ├── SubmissionForm.tsx
│       │   │   ├── StreakBadge.tsx
│       │   │   └── ScoreRing.tsx
│       │   ├── leaderboard/
│       │   │   ├── LeaderboardTable.tsx
│       │   │   └── CampusBoard.tsx
│       │   ├── profile/
│       │   │   ├── PublicProfile.tsx
│       │   │   └── GitHubGraph.tsx
│       │   └── admin/
│       ├── lib/
│       │   ├── ai/
│       │   │   ├── onboarding.ts
│       │   │   ├── taskGenerator.ts
│       │   │   ├── qualityGate.ts
│       │   │   ├── streakReminder.ts
│       │   │   ├── questGenerator.ts
│       │   │   └── resourceReviewer.ts
│       │   ├── auth/
│       │   │   ├── session.ts
│       │   │   └── middleware.ts
│       │   ├── db/
│       │   │   └── client.ts
│       │   ├── integrations/
│       │   │   ├── github.ts
│       │   │   └── leetcode.ts
│       │   ├── gamification/
│       │   │   ├── xp.ts
│       │   │   ├── streak.ts
│       │   │   ├── badges.ts
│       │   │   └── scores.ts
│       │   └── utils/
│       │       ├── validation.ts
│       │       └── formatting.ts
│       └── types/
│           ├── student.ts
│           ├── task.ts
│           ├── leaderboard.ts
│           └── api.ts
│
├── mobile/                       ← Expo app
│   ├── app.json
│   ├── eas.json
│   ├── tailwind.config.js        ← NativeWind config
│   ├── babel.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/                  ← Expo Router
│       │   ├── (auth)/
│       │   │   ├── login.tsx
│       │   │   ├── register.tsx
│       │   │   └── onboarding.tsx
│       │   ├── (tabs)/
│       │   │   ├── dashboard.tsx
│       │   │   ├── tasks.tsx
│       │   │   ├── leaderboard.tsx
│       │   │   ├── opportunities.tsx
│       │   │   └── profile.tsx
│       │   └── profile/
│       │       └── [username].tsx
│       ├── components/
│       │   ├── ui/
│       │   ├── student/
│       │   └── leaderboard/
│       ├── lib/
│       │   ├── api/
│       │   │   └── client.ts     ← shared API client (calls web API)
│       │   ├── auth/
│       │   │   └── session.ts    ← expo-secure-store token management
│       │   ├── offline/
│       │   │   └── cache.ts
│       │   └── notifications/
│       │       └── push.ts
│       └── types/                ← same types as web (shared or duplicated)
│
└── discord-bot/
    ├── index.ts
    ├── commands/
    │   └── verify.ts
    └── events/
        ├── progressPost.ts
        └── welcome.ts
```

---

## Environment Variables (Complete)

```bash
# ═══════════════════════════════════
# EAKALAIVA — ENVIRONMENT VARIABLES
# ═══════════════════════════════════
# Copy to .env — NEVER commit .env

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@host:5432/eakalaiva

# Auth — JWT
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Auth — Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI — Anthropic
ANTHROPIC_API_KEY=
AI_MODEL=claude-sonnet-4-20250514

# GitHub Integration
GITHUB_TOKEN=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@eakalaiva.in

# Discord Bot
DISCORD_BOT_TOKEN=
DISCORD_SERVER_ID=
DISCORD_WEBHOOK_URL=

# Payments (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Error Monitoring
SENTRY_DSN=

# ─── Mobile (Expo) — prefix EXPO_PUBLIC_ for client-side ───
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Design Tokens (Use These Everywhere — Never Hardcode Colors)

```typescript
// Tailwind config — primary palette
const colors = {
  primary: {
    DEFAULT: '#6366F1',   // Indigo — main brand
    dark: '#4F46E5',
    light: '#A5B4FC',
  },
  accent: {
    DEFAULT: '#F59E0B',   // Amber — streak, achievements
    dark: '#D97706',
  },
  success: '#10B981',     // Green — pass, verified
  danger: '#EF4444',      // Red — fail, warning
  neutral: {
    50: '#F9FAFB',
    900: '#111827',
  }
}
```

---

## Cron Jobs (Server-Side Scheduled Tasks)

| Job | Schedule | Function |
|---|---|---|
| Reset expired streaks | 00:05 UTC daily | `checkAndResetStreaks()` |
| Generate daily tasks | 06:00 UTC daily | `generateDailyTasksForAllActive()` |
| Send streak reminders | 15:30 UTC (≈9pm IST) | `sendStreakReminders()` |
| Recompute scores | 02:00 UTC daily | `recomputeAllScores()` |
| GitHub re-verification | Every Sunday 03:00 UTC | `reverifyGitHubAccounts()` |
| LeetCode stats refresh | 04:00 UTC daily | `refreshLeetCodeStats()` |
| Leaderboard rebuild | Every hour | `rebuildLeaderboardCache()` |

Use Vercel Cron or a separate cron service. All jobs must be idempotent (safe to run twice).
