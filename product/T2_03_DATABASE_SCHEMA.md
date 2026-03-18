# T2_03 — DATABASE SCHEMA
> Type 2 — AI Reference. Load when writing any DB query, migration, or model.
> This is the canonical schema. Do not add fields without updating this file.

---

## Schema (Prisma Format)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ══════════════════════════════════════
// ENUMS
// ══════════════════════════════════════

enum UserRole {
  STUDENT
  ADMIN
  MODERATOR
  COMPANY
  COLLEGE_ADMIN
}

enum UserStatus {
  UNVERIFIED
  ACTIVE
  SUSPENDED
  DELETED
}

enum RoadmapType {
  SPECIALIST
  RUSHER
  EXPLORER
}

enum Domain {
  FULL_STACK
  EMBEDDED_SYSTEMS
  DATA_SCIENCE
  CYBERSECURITY
  MOBILE_DEV
  DEVOPS
  AI_ML
}

enum TaskStatus {
  GENERATED
  SUBMITTED
  PASSED
  FAILED
  EXPIRED
}

enum SubmissionStatus {
  PENDING_AI
  PASSED
  FAILED
  FLAGGED
  MODERATOR_APPROVED
  MODERATOR_REJECTED
}

enum BadgeType {
  FIRST_COMMIT
  WARRIOR_30
  WARRIOR_60
  WARRIOR_90
  BRIDGE_BUILDER
  PEER_APPROVED
  HACKATHON_FINISHER
  TOP_10_TN
  TOP_1_TN
  RUSHER_COMPLETE
  SPECIALIST_COMPLETE
  FIRST_INTERNSHIP
  OPEN_SOURCE_MERGED
}

enum LeaderboardType {
  CONSISTENCY
  SPECIALIST
  RISING_STARS
  CAMPUS
}

enum OpportunityType {
  JOB
  INTERNSHIP
  HACKATHON
  SCHOLARSHIP
}

enum NotificationType {
  STREAK_REMINDER
  STREAK_CRITICAL
  BADGE_EARNED
  NEW_TASK
  LEADERBOARD_MILESTONE
  PEER_VALIDATION
  OPPORTUNITY_MATCH
  PLATFORM_ANNOUNCEMENT
}

// ══════════════════════════════════════
// USERS
// ══════════════════════════════════════

model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password_hash         String?   // null if Google-only account
  name                  String
  avatar_url            String?
  role                  UserRole  @default(STUDENT)
  status                UserStatus @default(UNVERIFIED)

  // Profile
  college_name          String?
  college_slug          String?   // URL-safe version of college_name
  year_of_study         Int?      // 1-4
  domain_interest       Domain?
  username              String    @unique // auto-generated from name
  profile_visible       Boolean   @default(true)
  bio                   String?   @db.Text

  // Auth
  email_verified        Boolean   @default(false)
  google_id             String?   @unique
  verification_token    String?   // hashed, for email verify
  verification_token_expires DateTime?
  reset_token           String?   // hashed, for password reset
  reset_token_expires   DateTime?
  last_login            DateTime?

  // Onboarding
  onboarding_complete   Boolean   @default(false)
  roadmap_type          RoadmapType?
  roadmap_assigned_at   DateTime?
  roadmap_changed_at    DateTime? // for 30-day change limit

  // Integrations
  github_username       String?
  github_verified       Boolean   @default(false)
  github_verified_at    DateTime?
  leetcode_username     String?
  leetcode_verified     Boolean   @default(false)
  leetcode_stats        Json?     // cached stats object

  // Mobile
  expo_push_token       String?   // for push notifications
  notification_prefs    Json?     // per-type preferences

  // Anti-cheat
  enhanced_review       Boolean   @default(false) // flag for extra scrutiny
  suspension_reason     String?

  // Soft delete
  deleted_at            DateTime?

  created_at            DateTime  @default(now())
  updated_at            DateTime  @updatedAt

  // Relations
  streak                Streak?
  xp_ledger             XpLedger[]
  badges                Badge[]
  tasks                 Task[]
  submissions           Submission[]
  peer_validations_given PeerValidation[] @relation("Validator")
  peer_validations_received PeerValidation[] @relation("Validated")
  onboarding_sessions   OnboardingSession[]
  notifications         Notification[]
  resource_submissions  ResourceSubmission[]
  moderation_logs       ModerationLog[]
  sessions              Session[]

  @@index([email])
  @@index([college_slug])
  @@index([roadmap_type])
  @@index([username])
  @@index([status])
}

// ══════════════════════════════════════
// AUTH SESSIONS
// ══════════════════════════════════════

model Session {
  id          String   @id @default(cuid())
  user_id     String
  token       String   @unique
  expires_at  DateTime
  device_info String?  // user agent for anomaly detection
  ip_address  String?
  created_at  DateTime @default(now())

  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([token])
}

// ══════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════

model OnboardingSession {
  id            String   @id @default(cuid())
  user_id       String
  messages      Json     // array of { role, content, timestamp }
  completed     Boolean  @default(false)
  result        Json?    // OnboardingResult when complete
  created_at    DateTime @default(now())
  completed_at  DateTime?

  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

// ══════════════════════════════════════
// ROADMAPS
// ══════════════════════════════════════

model Roadmap {
  id          String      @id @default(cuid())
  type        RoadmapType @unique
  title       String
  description String      @db.Text
  duration    String      // "6-12 months", "2-3 months", "2-4 weeks"
  active      Boolean     @default(true)
  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt

  steps       RoadmapStep[]
}

model RoadmapStep {
  id              String   @id @default(cuid())
  roadmap_id      String
  step_number     Int
  title           String
  description     String   @db.Text
  resources       Json?    // array of { title, url, type }
  submission_type String   // "github_link" | "text" | "screenshot_url" | "any"
  base_xp         Int      @default(100)
  requires_peer   Boolean  @default(false)
  active          Boolean  @default(true)

  roadmap         Roadmap  @relation(fields: [roadmap_id], references: [id])
  tasks           Task[]
  resources_sub   ResourceSubmission[]

  @@unique([roadmap_id, step_number])
  @@index([roadmap_id])
}

// ══════════════════════════════════════
// TASKS
// ══════════════════════════════════════

model Task {
  id              String     @id @default(cuid())
  student_id      String
  step_id         String?
  title           String
  description     String     @db.Text
  expected_output String     @db.Text
  submission_type String
  base_xp         Int
  difficulty      String     // "easy" | "medium" | "hard"
  status          TaskStatus @default(GENERATED)
  generated_at    DateTime   @default(now())
  submitted_at    DateTime?
  expires_at      DateTime   // end of the day UTC

  student         User       @relation(fields: [student_id], references: [id], onDelete: Cascade)
  step            RoadmapStep? @relation(fields: [step_id], references: [id])
  submission      Submission?

  @@index([student_id])
  @@index([status])
  @@index([generated_at])
}

// ══════════════════════════════════════
// SUBMISSIONS
// ══════════════════════════════════════

model Submission {
  id              String           @id @default(cuid())
  task_id         String           @unique
  student_id      String
  content         String           @db.Text
  github_link     String?
  screenshot_url  String?
  status          SubmissionStatus @default(PENDING_AI)
  ai_result       String?          // "pass" | "fail"
  ai_feedback     String?          @db.Text
  ai_improvement  String?          @db.Text
  xp_awarded      Int              @default(0)
  flag_reason     String?          // why it was flagged
  created_at      DateTime         @default(now())
  reviewed_at     DateTime?

  task            Task             @relation(fields: [task_id], references: [id], onDelete: Cascade)
  student         User             @relation(fields: [student_id], references: [id])
  moderation_logs ModerationLog[]

  @@index([student_id])
  @@index([status])
  @@index([created_at])
}

// ══════════════════════════════════════
// STREAKS
// ══════════════════════════════════════

model Streak {
  id                  String    @id @default(cuid())
  student_id          String    @unique
  current_streak      Int       @default(0)
  longest_streak      Int       @default(0)
  last_active_date    DateTime? // UTC date only (no time)
  freeze_days_used    Int       @default(0)
  freeze_used_this_period Boolean @default(false)
  multiplier          Float     @default(1.0)
  created_at          DateTime  @default(now())
  updated_at          DateTime  @updatedAt

  student             User      @relation(fields: [student_id], references: [id], onDelete: Cascade)
}

// ══════════════════════════════════════
// XP & LEVELS
// ══════════════════════════════════════

model XpLedger {
  id          String   @id @default(cuid())
  student_id  String
  xp_amount   Int      // can be negative (XP removal on moderation rejection)
  source      String   // "task_pass" | "badge" | "challenge" | "quest" | "peer_validation" | "moderation_remove"
  source_id   String?  // ID of the task, badge, etc.
  multiplier  Float    @default(1.0)
  final_xp    Int      // xp_amount * multiplier, rounded
  created_at  DateTime @default(now())

  student     User     @relation(fields: [student_id], references: [id], onDelete: Cascade)

  @@index([student_id])
  @@index([created_at])
}

model StudentScore {
  id                  String   @id @default(cuid())
  student_id          String   @unique
  consistency_score   Float    @default(0)
  depth_score         Float    @default(0)
  proof_score         Float    @default(0)
  total_xp            Int      @default(0)
  current_level       Int      @default(1)
  consistency_percentile Float @default(0)
  depth_percentile    Float    @default(0)
  proof_percentile    Float    @default(0)
  last_computed_at    DateTime @default(now())

  student             User     @relation(fields: [student_id], references: [id], onDelete: Cascade)
}

// ══════════════════════════════════════
// BADGES
// ══════════════════════════════════════

model Badge {
  id          String    @id @default(cuid())
  student_id  String
  type        BadgeType
  earned_at   DateTime  @default(now())

  student     User      @relation(fields: [student_id], references: [id], onDelete: Cascade)

  @@unique([student_id, type])
  @@index([student_id])
}

// ══════════════════════════════════════
// PEER VALIDATION
// ══════════════════════════════════════

model PeerValidation {
  id              String   @id @default(cuid())
  submission_id   String
  validator_id    String
  validated_id    String
  approved        Boolean
  created_at      DateTime @default(now())

  validator       User     @relation("Validator", fields: [validator_id], references: [id])
  validated       User     @relation("Validated", fields: [validated_id], references: [id])

  @@index([validator_id])
  @@index([validated_id])
  @@index([submission_id])
}

// ══════════════════════════════════════
// LEADERBOARD CACHE
// ══════════════════════════════════════

model LeaderboardCache {
  id          String          @id @default(cuid())
  type        LeaderboardType
  scope       String          // "global" | college_slug | domain
  data        Json            // cached leaderboard array
  cached_at   DateTime        @default(now())
  expires_at  DateTime

  @@unique([type, scope])
  @@index([type, scope])
}

// ══════════════════════════════════════
// GAMIFICATION — CHALLENGES & QUESTS
// ══════════════════════════════════════

model WeeklyChallenge {
  id              String      @id @default(cuid())
  roadmap_type    RoadmapType
  title           String
  description     String      @db.Text
  starts_at       DateTime
  ends_at         DateTime
  xp_reward       Int
  badge_reward    BadgeType?
  active          Boolean     @default(true)

  completions     ChallengeCompletion[]
}

model ChallengeCompletion {
  id              String          @id @default(cuid())
  challenge_id    String
  student_id      String
  submission_id   String?
  completed_at    DateTime        @default(now())

  challenge       WeeklyChallenge @relation(fields: [challenge_id], references: [id])

  @@unique([challenge_id, student_id])
}

model MonthlyQuest {
  id                  String   @id @default(cuid())
  student_id          String
  title               String
  description         String   @db.Text
  target_area         String
  final_output        String   @db.Text
  weekly_milestones   Json     // array of { week, milestone, completed }
  xp_reward           Int
  badge_reward        BadgeType?
  month               Int      // 1-12
  year                Int
  completed           Boolean  @default(false)
  created_at          DateTime @default(now())

  @@unique([student_id, month, year])
  @@index([student_id])
}

// ══════════════════════════════════════
// OPPORTUNITIES
// ══════════════════════════════════════

model Opportunity {
  id              String          @id @default(cuid())
  type            OpportunityType
  title           String
  company         String?
  organiser       String?
  description     String          @db.Text
  url             String
  deadline        DateTime?
  starts_at       DateTime?
  eligible_domains Domain[]
  eligible_years  Int[]
  location        String?
  is_remote       Boolean         @default(false)
  active          Boolean         @default(true)
  featured        Boolean         @default(false)
  created_at      DateTime        @default(now())

  @@index([type])
  @@index([deadline])
  @@index([active])
}

// ══════════════════════════════════════
// RESOURCES (community-submitted)
// ══════════════════════════════════════

model ResourceSubmission {
  id              String   @id @default(cuid())
  step_id         String
  submitted_by    String
  title           String
  url             String
  description     String   @db.Text
  ai_score        Int?     // quality score from AI reviewer
  ai_recommendation String? // approve | reject | needs_review
  status          String   @default("pending") // pending | approved | rejected
  reviewed_by     String?
  created_at      DateTime @default(now())

  step            RoadmapStep @relation(fields: [step_id], references: [id])
  submitter       User     @relation(fields: [submitted_by], references: [id])

  @@index([step_id])
  @@index([status])
}

// ══════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════

model Notification {
  id          String           @id @default(cuid())
  student_id  String
  type        NotificationType
  title       String
  body        String
  data        Json?
  read        Boolean          @default(false)
  sent_push   Boolean          @default(false)
  created_at  DateTime         @default(now())

  student     User             @relation(fields: [student_id], references: [id], onDelete: Cascade)

  @@index([student_id])
  @@index([read])
  @@index([created_at])
}

// ══════════════════════════════════════
// MODERATION
// ══════════════════════════════════════

model ModerationLog {
  id              String   @id @default(cuid())
  submission_id   String
  student_id      String
  moderator_id    String?
  action          String   // "flagged" | "approved" | "rejected" | "warned"
  reason          String
  xp_delta        Int      @default(0) // negative if XP removed
  created_at      DateTime @default(now())

  submission      Submission @relation(fields: [submission_id], references: [id])
  student         User     @relation(fields: [student_id], references: [id])

  @@index([student_id])
  @@index([submission_id])
}

// ══════════════════════════════════════
// AI PROMPTS (editable from admin UI)
// ══════════════════════════════════════

model AiPrompt {
  id          String   @id @default(cuid())
  key         String   @unique // "onboarding" | "task_generation" | "quality_gate" | etc.
  system_prompt String @db.Text
  model       String   @default("claude-sonnet-4-20250514")
  temperature Float    @default(0.7)
  max_tokens  Int      @default(1000)
  active      Boolean  @default(true)
  updated_by  String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

// ══════════════════════════════════════
// COMPANY
// ══════════════════════════════════════

model Company {
  id                String   @id @default(cuid())
  name              String
  email             String   @unique
  password_hash     String
  website           String?
  description       String?  @db.Text
  verified          Boolean  @default(false)
  subscription_active Boolean @default(false)
  subscription_ends DateTime?
  created_at        DateTime @default(now())

  posted_opportunities Opportunity[]
}

// ══════════════════════════════════════
// COLLEGE PARTNERSHIP
// ══════════════════════════════════════

model CollegePartnership {
  id              String   @id @default(cuid())
  college_name    String   @unique
  college_slug    String   @unique
  admin_email     String   @unique
  password_hash   String
  partnership_active Boolean @default(false)
  partnership_ends DateTime?
  logo_url        String?
  created_at      DateTime @default(now())
}
```

---

## Key Design Decisions

- **Soft delete on User:** `deleted_at` field — never hard delete students. Compliance + audit trail.
- **XpLedger is append-only:** Never update XP directly on User. Always add a ledger row. Compute total from sum. Enables XP reversal on moderation.
- **All timestamps UTC:** PostgreSQL stores timestamps in UTC. Application layer must never convert to local time before storage.
- **LeaderboardCache:** Computed data cached in DB to avoid recomputing on every page load. Invalidated after every submission pass.
- **AiPrompt in DB:** Prompts are never hardcoded. All AI behaviour editable from admin UI without a code deploy.
- **Streak as separate table:** Isolates streak logic from user record. Simplifies the daily reset cron.
