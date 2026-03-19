# T1_04 — WHAT WE BUILD
> The complete product. Phase by phase. Who builds what.

---

## The Five Phases

| Phase | Focus | Time (focused) |
|---|---|---|
| 0 | Foundation — repo, stack, schema, running locally | Week 1 |
| 1 | MVP Web — real students can use it | Weeks 2–7 |
| 2 | Full Web — every feature live | Weeks 8–16 |
| 3 | Mobile — iOS + Android | Weeks 17–24 |
| 4 | Full Platform — companies, colleges, Discord | Weeks 25–32 |

**Don't start Phase 2 until 5 real students use Phase 1.**
Real users tell you what actually matters next.

---

## PHASE 0 — FOUNDATION (Week 1)

**Goal:** All three can run the project locally in 10 minutes.

- [ ] GitHub org repo created, branches set up (main/staging/dev)
- [ ] All docs committed — team/ and ai/ folders
- [ ] Stack decided, T2_02 filled in
- [ ] `.env.example` committed — names only, no values
- [ ] Supabase project created (dev + prod)
- [ ] Prisma schema from T2_03 migrated
- [ ] Next.js scaffolded — Tailwind, TypeScript, folder structure
- [ ] Expo scaffolded — NativeWind, TypeScript
- [ ] Vercel connected to GitHub
- [ ] EAS configured for Expo builds
- [ ] Resend account + welcome email template
- [ ] Anthropic API key tested
- [ ] DECISION_LOG updated with all stack choices

**Vimal:** T2 files, schema decisions, Supabase setup
**Ramadass:** Next.js scaffold, Vercel, Prisma
**Ovian:** Expo scaffold, EAS, Resend

**Done when:** All three run `npm run dev` and see the app.

---

## PHASE 1 — MVP WEB (Weeks 2–7)

**Goal:** A stranger registers, gets a roadmap, completes a task, appears on leaderboard.

### Week 2 — Auth & Onboarding
- [ ] Register page — email + Google OAuth
- [ ] Email verification flow
- [ ] Login page + password reset
- [ ] AI Onboarding — 7-question conversation → roadmap assigned
- [ ] Student dashboard shell

**Ramadass:** auth endpoints, onboarding API
**Ovian:** all auth UI, onboarding chat UI

### Weeks 3–4 — Core Task Loop
- [ ] Specialist roadmap — minimum 30 real steps (Vimal writes content)
- [ ] Daily task generation — 3 tasks per day via AI
- [ ] Task view page
- [ ] Submission flow — student submits text/link
- [ ] AI quality gate — pass/fail with specific feedback
- [ ] XP releases on pass
- [ ] Streak tracking — increments on verified submission

**Ramadass:** task generation, quality gate, XP, streak endpoints
**Ovian:** task UI, submission form, streak display

### Weeks 5–6 — Proof Layer
- [ ] GitHub integration — connect, verify, show graph on profile
- [ ] Public student profile — streak, XP, tasks, GitHub
- [ ] Consistency leaderboard — top students statewide
- [ ] Campus leaderboard — top per college
- [ ] Shareable profile URL /profile/:username

**Ramadass:** GitHub API, leaderboard endpoints
**Ovian:** profile page, leaderboard UI

### Week 7 — Admin Foundation
- [ ] Admin dashboard — users, streaks, submissions today
- [ ] Submission approvals page
- [ ] Roadmap management — edit steps without code deploy
- [ ] AI prompts editor — edit onboarding + quality gate from UI

**Ramadass:** admin endpoints
**Ovian:** admin UI

### MVP Done When (All 6 Must Pass)
1. A stranger registers, completes onboarding, receives roadmap
2. That stranger completes one verified task and earns XP
3. Their profile is publicly visible with real GitHub linked
4. Their name appears on the Consistency Leaderboard
5. An admin can see all of this live in the dashboard
6. An incubator member sees a live demo without crashes

---

## PHASE 2 — FULL WEB (Weeks 8–16)

### Week 8 — All Roadmap Types
- [ ] Rusher Map — 20+ steps
- [ ] Explorer Map — 15+ steps
- [ ] Roadmap selection post-onboarding
- [ ] Roadmap switching rules (once per 30 days)

### Weeks 9–10 — Full Gamification
- [ ] All 6 badge types
- [ ] All streak multipliers + freeze day
- [ ] XP level system levels 1–50
- [ ] Rising Stars leaderboard (30-day growth)
- [ ] Specialist leaderboard per domain
- [ ] Weekly challenge system
- [ ] Monthly quest — AI personalised

### Weeks 11–12 — Community + Peer Validation
- [ ] Peer validation system
- [ ] Relationship graph for farming detection
- [ ] Resource submission system
- [ ] AI resource quality gate

### Week 13 — LeetCode + Full Proof
- [ ] LeetCode integration
- [ ] Full three-score system live
- [ ] Percentile rankings
- [ ] Hackathon wins, internship records

### Week 14 — Opportunity Explorer
- [ ] Opportunities page — hackathons, internships, scholarships
- [ ] Matching to student roadmap and scores
- [ ] Admin: add/edit opportunities

### Weeks 15–16 — Full Admin
- [ ] Full user management
- [ ] AI model switcher from UI
- [ ] Full moderation panel
- [ ] Platform-wide notification system
- [ ] Anti-cheat review dashboard
- [ ] Analytics dashboard

**Phase 2 done when:** 50 real students use it weekly, no critical bugs open.

---

## PHASE 3 — MOBILE (Weeks 17–24)

**Key principle:** Expo calls the same API as web. No new backend needed — only new UI.

### Weeks 17–18 — Mobile Auth & Onboarding
- [ ] Register, login, password reset screens
- [ ] Google OAuth via expo-auth-session
- [ ] AI onboarding — native chat UI (not webview)
- [ ] Secure token storage via expo-secure-store
- [ ] Biometric login option

**Ovian owns all mobile UI**

### Weeks 19–20 — Core Mobile Loop
- [ ] Dashboard — tasks, streak, XP
- [ ] Task screen — submit with text, link, or camera
- [ ] Submission result — pass/fail with AI feedback
- [ ] Streak screen — tracker + freeze activation
- [ ] Offline mode — cached tasks, queued submissions

### Weeks 21–22 — Profile & Leaderboard
- [ ] Own profile screen
- [ ] Public profile view
- [ ] All leaderboards
- [ ] Profile share card — image with streak, score, rank
- [ ] Push notifications

### Weeks 23–24 — Opportunities & Launch
- [ ] Opportunity Explorer screen
- [ ] Peer validation on mobile
- [ ] App Store submission (iOS)
- [ ] Play Store submission (Android)
- [ ] Crashlytics configured

**Phase 3 done when:** App live on both stores, 100+ downloads week one.

---

## PHASE 4 — FULL PLATFORM (Weeks 25–32)

### Weeks 25–27 — Company Dashboard
- [ ] Company registration and verification
- [ ] Razorpay subscription payments
- [ ] Talent search with all filters
- [ ] Job and hackathon posting

### Weeks 28–29 — College Dashboard
- [ ] College admin registration
- [ ] Annual partnership payment
- [ ] Student progress dashboard
- [ ] NAAC data export

### Weeks 30–31 — Discord Bot
- [ ] /verify command
- [ ] Daily progress post recording
- [ ] Weekly leaderboard auto-post Monday 9am
- [ ] Streak reminder DMs 9pm
- [ ] Opportunity alerts
- [ ] Anti-farming detection

### Week 32 — Scale & Security
- [ ] All API responses under 300ms
- [ ] Rate limiting hardened
- [ ] Full security audit
- [ ] CDN for all static assets

**Phase 4 done when:** First paying company. First college partnership. 200+ Discord members.
