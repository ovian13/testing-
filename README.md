# Eakalaiva — Project Repository

> *If you cannot change the college you came from, change what you can prove.*
> **Prove. Grow. Rise.**

Eakalaiva is a free skill-tracking and opportunity platform for Tamil Nadu engineering students from tier-2 and tier-3 colleges — built to close the gap between high-tier and low-tier colleges by making skill visible where pedigree cannot speak.

---

## The One Filter

> **Does this close the gap or widen it?**

Every feature, task, line of code, or decision ends with this question.

---

## Repository Structure

```
eakalaiva/
├── .env.example                      ← Copy to .env — never commit .env
├── .gitignore
│
├── docs/
│   ├── team/                         ← T1 files — humans read, load every Monday
│   │   ├── T1_01_TEAM_OS.md
│   │   ├── T1_02_VIBE_CODE_RULES.md
│   │   ├── T1_03_PROMPT_PLAYBOOK.md
│   │   ├── T1_04_PRODUCT_ROADMAP.md
│   │   └── T1_05_GIT_AND_LOGS.md
│   ├── ai/                           ← T2 files — AI reads at every session start
│   │   ├── T2_01_PROJECT_CONTEXT.md
│   │   ├── T2_02_TECH_ARCHITECTURE.md
│   │   ├── T2_03_DATABASE_SCHEMA.md
│   │   ├── T2_04_API_CONTRACTS.md
│   │   ├── T2_05_CODE_STANDARDS.md
│   │   ├── T2_06_SECURITY_RULES.md
│   │   └── T2_07_FEATURE_SPECS.md
│   ├── briefs/                       ← Vimal's weekly build briefs
│   └── logs/
│       ├── AI_BUILD_LOG.md
│       ├── DECISION_LOG.md
│       ├── EQUITY_AND_COMP.md
│       ├── INCIDENT_LOG.md
│       ├── KNOWN_ISSUES.md
│       ├── OUTREACH_LOG.md
│       └── WEEKLY_REVIEW.md
│
├── web/                              ← Next.js 14 (App Router) + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   └── src/
│       ├── app/
│       │   ├── (auth)/               ← login, register, verify-email, reset-password
│       │   ├── (onboarding)/
│       │   ├── (student)/            ← dashboard, tasks, profile, leaderboard, opportunities, settings
│       │   ├── (admin)/              ← admin dashboard, users, moderation, roadmaps, prompts, analytics
│       │   ├── (company)/            ← company dashboard, search, post
│       │   ├── (college)/            ← college dashboard
│       │   └── api/                  ← All API routes (auth, tasks, student, leaderboard, integrations, webhooks)
│       ├── components/
│       │   ├── ui/                   ← shadcn/ui base components
│       │   ├── auth/
│       │   ├── student/              ← TaskCard, SubmissionForm, StreakBadge, ScoreRing
│       │   ├── leaderboard/
│       │   ├── profile/
│       │   └── admin/
│       ├── lib/
│       │   ├── ai/                   ← onboarding, taskGenerator, qualityGate, streakReminder
│       │   ├── auth/
│       │   ├── db/
│       │   ├── integrations/         ← github.ts, leetcode.ts
│       │   ├── gamification/         ← xp.ts, streak.ts, badges.ts, scores.ts
│       │   └── utils/
│       └── types/
│
├── mobile/                           ← Expo (React Native) + NativeWind
│   └── src/
│       ├── app/
│       │   ├── (auth)/               ← login, register, onboarding
│       │   ├── (tabs)/               ← dashboard, tasks, leaderboard, opportunities, profile
│       │   └── profile/
│       ├── components/
│       ├── lib/
│       │   ├── api/                  ← shared API client (calls web API)
│       │   ├── auth/                 ← expo-secure-store token management
│       │   ├── offline/
│       │   └── notifications/        ← Expo Push
│       └── types/
│
└── discord-bot/                      ← discord.js v14
    ├── commands/                     ← /verify
    └── events/                       ← progressPost, welcome
```

---

## Stack

| Layer | Choice |
|---|---|
| Web Framework | Next.js 14 (App Router) + TypeScript |
| Mobile | Expo (React Native) + NativeWind v4 |
| Database | PostgreSQL via Supabase + Prisma ORM |
| Auth | NextAuth.js v5 (web) / expo-auth-session (mobile) |
| AI | Anthropic Claude |
| Email | Resend |
| Payments | Razorpay |
| Hosting | Vercel (web) + EAS (mobile builds) |

---

## Team

| Role | Person |
|---|---|
| The Compass (Product) | Vimal |
| The Engine (Frontend/Full-stack) | Ramadass |
| The Bridge (Community/UX) | Ovian |
