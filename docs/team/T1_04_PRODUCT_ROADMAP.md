# T1_04 — FULL PRODUCT ROADMAP
> Type 1 — Human Reference. This is the complete build plan from zero to full product.
> Web + Android + iOS. Every phase has milestones, owners, and success criteria.

---

## The Five Phases

| Phase | Name | Focus | Duration |
|---|---|---|---|
| 0 | Foundation | Stack setup, repo, schema, env | Week 1 |
| 1 | MVP Web | Core loop on web — usable by real students | Weeks 2–7 |
| 2 | Full Web | Complete web platform — all features | Weeks 8–16 |
| 3 | Mobile | iOS + Android — same core loop | Weeks 17–24 |
| 4 | Full Platform | Companies, colleges, Discord bot, analytics | Weeks 25–32 |

---

## PHASE 0 — FOUNDATION
### Week 1 | All Three Founders

**Goal:** Everything is set up. Any founder can pull the repo and run the project in 10 minutes.

#### Milestones
- [ ] GitHub repo created — private, main/dev/staging branches set up per T1_05_GIT_AND_LOGS.md
- [ ] `/docs/team/` and `/docs/ai/` folders committed with all T1 and T2 files
- [ ] Tech stack finalised and documented in T2_02_TECH_ARCHITECTURE.md
- [ ] `.env.example` committed — all variable names, no values
- [ ] Supabase project created — dev and prod environments
- [ ] Prisma schema created from T2_03_DATABASE_SCHEMA.md and migrated
- [ ] Next.js project scaffolded with Tailwind, TypeScript, folder structure from T2_02
- [ ] Expo project scaffolded with NativeWind, TypeScript, same folder structure
- [ ] Vercel project connected to GitHub (auto-deploy on push to main)
- [ ] EAS project configured for Expo mobile builds
- [ ] Resend account set up, welcome email template created
- [ ] Anthropic API key configured and tested
- [ ] DECISION_LOG.md updated with all stack decisions
- [ ] All three founders can run both web and mobile locally

**Owner assignment:**
- Vimal: Writes all T2 files, makes all stack decisions, sets up Supabase schema
- Ramadass: Scaffolds Next.js, connects Vercel, sets up Prisma
- Ovian: Scaffolds Expo, configures EAS, sets up Resend

**Phase 0 is done when:** All three founders run `npm run dev` and see the app. No exceptions.

---

## PHASE 1 — MVP WEB
### Weeks 2–7 | Core Student Loop on Web

**Goal:** A real student (not a founder) can register, get a roadmap, complete a task, and appear on a leaderboard.

---

### Milestone 1.1 — Auth & Onboarding (Week 2)
- [ ] Registration page — email + Google OAuth
- [ ] Email verification flow
- [ ] Login page
- [ ] Password reset flow
- [ ] AI Onboarding session — 7-question conversation → roadmap assigned
- [ ] Student dashboard shell (empty but navigable after onboarding)

**Owner:** Ramadass (auth endpoints), Ovian (UI), Vimal (AI onboarding prompt — load from DB)

---

### Milestone 1.2 — Core Task Loop (Weeks 3–4)
- [ ] Specialist roadmap loaded with minimum 30 real steps (content by Vimal)
- [ ] Daily task generation — AI generates 3 tasks per day
- [ ] Task view page — shows today's tasks
- [ ] Submission flow — student submits text/link as proof
- [ ] AI quality gate — pass/fail with specific feedback
- [ ] XP system — releases on pass, withheld on fail
- [ ] Basic streak tracking — increments on verified submission
- [ ] Student can resubmit same task same day on fail

**Owner:** Ramadass (task generation + quality gate endpoints), Ovian (task UI), Vimal (AI prompt content)

---

### Milestone 1.3 — Proof Layer (Weeks 5–6)
- [ ] GitHub integration — connect username, verify, show contribution graph on profile
- [ ] Public student profile page — streak, XP, tasks, GitHub
- [ ] Consistency Leaderboard — top students statewide
- [ ] Campus Leaderboard — top student per college
- [ ] Shareable profile URL: /profile/:username
- [ ] "Verified by Eakalaiva" badge on 30+ day profiles

**Owner:** Ramadass (GitHub API, leaderboard), Ovian (profile UI)

---

### Milestone 1.4 — Admin Foundation (Week 7)
- [ ] Admin dashboard — user count, active streaks, submissions today
- [ ] Submission approvals page — review flagged submissions
- [ ] Roadmap management — edit steps and content without code changes
- [ ] First AI prompt editor — edit onboarding and quality gate prompts from UI

**Owner:** Ramadass (admin endpoints), Ovian (admin UI)

---

### MVP Success Criteria (6 tests — all must pass)
1. A stranger (not a founder) registers, completes onboarding, receives a roadmap
2. That stranger completes one verified task and earns XP
3. Their profile is publicly visible with real GitHub linked
4. Their name appears on the Consistency Leaderboard
5. An admin can see all of this in the dashboard live
6. An incubator member is shown a live demo without crashes or empty states

**If all 6 pass → Phase 1 done. Start Phase 2.**

---

## PHASE 2 — FULL WEB PLATFORM
### Weeks 8–16 | Complete Feature Set on Web

**Goal:** Everything in the product design is live on web. Students, admins, and eventually companies have full functionality.

---

### Milestone 2.1 — All Three Roadmap Types (Week 8)
- [ ] Rusher Map loaded (minimum 20 steps — job-ready path, 2–3 months)
- [ ] Explorer Map loaded (minimum 15 steps — broad discovery, 2–4 weeks)
- [ ] Roadmap selection page after onboarding (if Explorer completes → prompted to choose Specialist or Rusher)
- [ ] Roadmap switching rules enforced (once per 30 days)

**Owner:** Vimal (all content), Ramadass (roadmap switching logic)

---

### Milestone 2.2 — Full Gamification (Weeks 9–10)
- [ ] All 6 badge types implemented (see T2_07_FEATURE_SPECS.md — Badges)
- [ ] All streak multipliers implemented (7/30/60/90 day)
- [ ] Streak grace period / freeze day feature
- [ ] XP level system — levels 1–50 with thresholds
- [ ] Rising Stars leaderboard (30-day growth velocity)
- [ ] Specialist leaderboard per roadmap domain
- [ ] Weekly challenge system — platform-wide same challenge per roadmap
- [ ] Monthly quest — AI-personalised per student weakness

**Owner:** Ramadass (all gamification logic), Ovian (leaderboard UI)

---

### Milestone 2.3 — Community & Peer Validation (Weeks 11–12)
- [ ] Peer validation system — students can validate each other's step completions
- [ ] Relationship graph for peer approval farming detection
- [ ] Mutual-only approval pattern detection → auto-freeze → moderator queue
- [ ] Resource submission system — students contribute resources to roadmap steps
- [ ] AI resource quality gate — reviews submissions before publishing
- [ ] Community resources visible on roadmap step pages
- [ ] Daily progress posts concept (precursor to Discord integration)

**Owner:** Ramadass (peer validation backend), Ovian (community UI)

---

### Milestone 2.4 — LeetCode & Full Proof Layer (Week 13)
- [ ] LeetCode integration — connect username, fetch stats, display on profile
- [ ] Full three-score system — Consistency, Depth, Proof scores live
- [ ] Percentile rankings within each roadmap type
- [ ] Proof score enhanced — hackathon wins, internship records
- [ ] Hackathon participation badge verification (submission link + moderator check)

**Owner:** Ramadass (LeetCode API, score system), Ovian (profile enhancements)

---

### Milestone 2.5 — Opportunity Explorer (Week 14)
- [ ] Opportunity Explorer page — hackathons, internships, scholarships
- [ ] Opportunities matched to each student's roadmap and skill level
- [ ] Students can apply/register directly from the platform
- [ ] Opportunity admin panel — add/edit/remove listings

**Owner:** Ovian (opportunity UI + outreach to list real opportunities), Ramadass (matching logic)

---

### Milestone 2.6 — Full Admin Suite (Weeks 15–16)
- [ ] Full user management — view, suspend, edit roles
- [ ] AI model configuration — switch AI provider from UI without code changes
- [ ] All AI prompts editable from admin UI (no code deploy needed)
- [ ] Full moderation panel — queue, review, warn, reject
- [ ] Notification system — platform-wide announcements
- [ ] Analytics dashboard — charts for growth, retention, roadmap completion rates
- [ ] Anti-cheat review dashboard — flagged accounts, anomaly reports

**Owner:** Ramadass (all admin endpoints), Ovian (admin UI)

**Phase 2 done when:** 50 real students are using the platform weekly with no critical bugs open.

---

## PHASE 3 — MOBILE (iOS + ANDROID)
### Weeks 17–24 | Expo React Native App

**Goal:** Full student experience available on iOS and Android. All Phase 2 features accessible on mobile.

**Key principle:** The Expo app calls the same API as the web. No new backend work needed — only new UI.

---

### Milestone 3.1 — Mobile Auth & Onboarding (Weeks 17–18)
- [ ] Registration screen (NativeWind styled)
- [ ] Google OAuth via expo-auth-session
- [ ] Login screen
- [ ] Password reset flow
- [ ] AI onboarding session — native chat UI (not a web view)
- [ ] Secure token storage via expo-secure-store
- [ ] Biometric login option (Face ID / fingerprint) as convenience layer

**Owner:** Ovian (all mobile UI), Ramadass (any mobile-specific API adjustments)

---

### Milestone 3.2 — Core Mobile Loop (Weeks 19–20)
- [ ] Dashboard screen — today's tasks, streak counter, XP
- [ ] Task screen — view tasks, submit with text, link, or camera (photo upload)
- [ ] Submission result screen — pass/fail with AI feedback
- [ ] Streak screen — visual streak tracker, freeze day activation
- [ ] Offline mode — view cached tasks, queue submission drafts

**Owner:** Ovian (UI), Ramadass (offline caching, queue system)

---

### Milestone 3.3 — Mobile Profile & Leaderboard (Weeks 21–22)
- [ ] Own profile screen — scores, badges, GitHub, LeetCode
- [ ] Public profile view
- [ ] Leaderboard screen — all four boards, tap to see profile
- [ ] Profile share button — generates shareable image card (streak, score, rank)
- [ ] Push notifications — streak reminders, badge alerts, opportunity alerts

**Owner:** Ovian (UI), Ramadass (share card generation, push notification setup)

---

### Milestone 3.4 — Mobile Opportunities & Community (Weeks 23–24)
- [ ] Opportunity Explorer screen
- [ ] Saved opportunities
- [ ] Peer validation on mobile
- [ ] App Store submission (iOS)
- [ ] Play Store submission (Android)
- [ ] Crashlytics / error monitoring configured

**Owner:** Ovian (UI + store submissions), Ramadass (error monitoring)

**Phase 3 done when:** App live on both stores with at least 100 downloads in first week.

---

## PHASE 4 — FULL PLATFORM
### Weeks 25–32 | Companies, Colleges, Discord Bot

**Goal:** Revenue streams live. College partnerships signed. Discord community active.

---

### Milestone 4.1 — Company Dashboard (Weeks 25–27)
- [ ] Company registration and verification
- [ ] Subscription payment — Razorpay integration (India-first)
- [ ] Talent search with all filters
- [ ] Job and hackathon posting system
- [ ] Candidate bookmark and pipeline management
- [ ] Opportunity-student matching notifications

**Owner:** Ramadass (payments, search), Ovian (company UI + first company outreach)

---

### Milestone 4.2 — College Partnership Dashboard (Weeks 28–29)
- [ ] College admin registration and verification
- [ ] Annual partnership payment
- [ ] Student progress dashboard per college
- [ ] Campus leaderboard branding customisation
- [ ] NAAC-ready data export
- [ ] Placement analytics (internships, hackathon wins from platform)

**Owner:** Ramadass (college endpoints), Ovian (college UI + outreach to first 3 partner colleges)

---

### Milestone 4.3 — Discord Bot (Weeks 30–31)
- [ ] Bot setup with discord.js
- [ ] /verify command — checks DB, assigns roadmap role, unlocks channels
- [ ] Daily progress post recording — bot detects post in #post-your-progress, mods validate, bot records to DB
- [ ] Weekly leaderboard auto-post every Monday 9am
- [ ] Streak reminder DMs at 9pm if no activity
- [ ] Opportunity alerts via webhook
- [ ] Welcome DM for new members
- [ ] Anti-farming: bot detects unusual validation patterns, flags to moderator

**Owner:** Ramadass (bot build), Ovian (Discord server setup, channel structure, moderation)

---

### Milestone 4.4 — Analytics & Scale (Week 32)
- [ ] Full analytics pipeline — student cohort analysis, retention curves
- [ ] A/B test infrastructure for onboarding flow
- [ ] Performance optimisation — all API responses under 300ms
- [ ] Database query audit — remove N+1 queries
- [ ] CDN for all static assets
- [ ] Rate limiting hardened across all endpoints
- [ ] Full security audit

**Owner:** Vimal (decisions on what to measure), Ramadass (implementation)

**Phase 4 done when:** First paying company subscribed. First college partnership signed. Discord has 200+ members.

---

## Feature Checklist — Full Product

### Student Features
- [x] AI Onboarding Session
- [x] Three Roadmap Types (Specialist / Rusher / Explorer)
- [x] AI Companion (daily tasks, nudges, progress awareness)
- [x] XP & Levels
- [x] All Badges & Achievements
- [x] Streaks & Multipliers + Freeze Day
- [x] Weekly Challenges
- [x] Monthly Quests (AI-personalised)
- [x] Public Verified Profile
- [x] GitHub Live Integration
- [x] LeetCode Live Integration
- [x] Peer Validation
- [x] All Four Leaderboards
- [x] Opportunity Explorer
- [x] Resource Submissions
- [x] Community (Discord)
- [x] Daily Progress Posts
- [x] Mobile App (iOS + Android)
- [x] Push Notifications
- [x] Offline Mode

### Company Features
- [x] Company Dashboard
- [x] Talent Search with Filters
- [x] Job + Hackathon Posting
- [x] Subscription Payments

### College Features
- [x] College Partnership Dashboard
- [x] Student Progress Analytics
- [x] Campus Leaderboard Branding
- [x] NAAC Data Export
- [x] Placement Analytics

### Admin Features
- [x] Full Admin Dashboard
- [x] User Management
- [x] Roadmap Management
- [x] AI Prompts Editor (no code deploy)
- [x] AI Model Configuration
- [x] Moderation Panel
- [x] Anti-Cheat Review Dashboard
- [x] Notification System
- [x] Analytics Dashboard
