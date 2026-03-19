# T2_03 — DATABASE SCHEMA
> Load when writing any DB query, model, or migration.
> Canonical schema. Match this exactly. Update this file when schema changes.

---

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole { STUDENT ADMIN MODERATOR COMPANY COLLEGE_ADMIN }
enum UserStatus { UNVERIFIED ACTIVE SUSPENDED DELETED }
enum RoadmapType { SPECIALIST RUSHER EXPLORER }
enum Domain { FULL_STACK EMBEDDED_SYSTEMS DATA_SCIENCE CYBERSECURITY MOBILE_DEV DEVOPS AI_ML }
enum TaskStatus { GENERATED SUBMITTED PASSED FAILED EXPIRED }
enum SubmissionStatus { PENDING_AI PASSED FAILED FLAGGED MODERATOR_APPROVED MODERATOR_REJECTED }
enum BadgeType { FIRST_COMMIT WARRIOR_30 WARRIOR_60 WARRIOR_90 BRIDGE_BUILDER PEER_APPROVED HACKATHON_FINISHER TOP_10_TN TOP_1_TN RUSHER_COMPLETE SPECIALIST_COMPLETE FIRST_INTERNSHIP OPEN_SOURCE_MERGED }
enum LeaderboardType { CONSISTENCY SPECIALIST RISING_STARS CAMPUS }
enum OpportunityType { JOB INTERNSHIP HACKATHON SCHOLARSHIP }
enum NotificationType { STREAK_REMINDER STREAK_CRITICAL BADGE_EARNED NEW_TASK LEADERBOARD_MILESTONE PEER_VALIDATION OPPORTUNITY_MATCH PLATFORM_ANNOUNCEMENT }

model User {
  id                    String      @id @default(cuid())
  email                 String      @unique
  password_hash         String?
  name                  String
  avatar_url            String?
  role                  UserRole    @default(STUDENT)
  status                UserStatus  @default(UNVERIFIED)
  college_name          String?
  college_slug          String?
  year_of_study         Int?
  domain_interest       Domain?
  username              String      @unique
  profile_visible       Boolean     @default(true)
  bio                   String?     @db.Text
  email_verified        Boolean     @default(false)
  google_id             String?     @unique
  verification_token    String?
  verification_token_expires DateTime?
  reset_token           String?
  reset_token_expires   DateTime?
  last_login            DateTime?
  onboarding_complete   Boolean     @default(false)
  roadmap_type          RoadmapType?
  roadmap_assigned_at   DateTime?
  roadmap_changed_at    DateTime?
  github_username       String?
  github_verified       Boolean     @default(false)
  github_verified_at    DateTime?
  leetcode_username     String?
  leetcode_verified     Boolean     @default(false)
  leetcode_stats        Json?
  expo_push_token       String?
  notification_prefs    Json?
  enhanced_review       Boolean     @default(false)
  suspension_reason     String?
  deleted_at            DateTime?
  created_at            DateTime    @default(now())
  updated_at            DateTime    @updatedAt

  streak                Streak?
  score                 StudentScore?
  xp_ledger             XpLedger[]
  badges                Badge[]
  tasks                 Task[]
  submissions           Submission[]
  peer_given            PeerValidation[] @relation("Validator")
  peer_received         PeerValidation[] @relation("Validated")
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

model Session {
  id          String   @id @default(cuid())
  user_id     String
  token       String   @unique
  expires_at  DateTime
  device_info String?
  ip_address  String?
  created_at  DateTime @default(now())
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  @@index([user_id])
  @@index([token])
}

model OnboardingSession {
  id           String    @id @default(cuid())
  user_id      String
  messages     Json
  completed    Boolean   @default(false)
  result       Json?
  created_at   DateTime  @default(now())
  completed_at DateTime?
  user         User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  @@index([user_id])
}

model Roadmap {
  id          String      @id @default(cuid())
  type        RoadmapType @unique
  title       String
  description String      @db.Text
  duration    String
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
  resources       Json?
  submission_type String
  base_xp         Int      @default(100)
  requires_peer   Boolean  @default(false)
  active          Boolean  @default(true)
  roadmap         Roadmap  @relation(fields: [roadmap_id], references: [id])
  tasks           Task[]
  resources_sub   ResourceSubmission[]
  @@unique([roadmap_id, step_number])
  @@index([roadmap_id])
}

model Task {
  id              String      @id @default(cuid())
  student_id      String
  step_id         String?
  title           String
  description     String      @db.Text
  expected_output String      @db.Text
  submission_type String
  base_xp         Int
  difficulty      String
  status          TaskStatus  @default(GENERATED)
  generated_at    DateTime    @default(now())
  submitted_at    DateTime?
  expires_at      DateTime
  student         User        @relation(fields: [student_id], references: [id], onDelete: Cascade)
  step            RoadmapStep? @relation(fields: [step_id], references: [id])
  submission      Submission?
  @@index([student_id])
  @@index([status])
  @@index([generated_at])
}

model Submission {
  id              String            @id @default(cuid())
  task_id         String            @unique
  student_id      String
  content         String            @db.Text
  github_link     String?
  screenshot_url  String?
  status          SubmissionStatus  @default(PENDING_AI)
  ai_result       String?
  ai_feedback     String?           @db.Text
  ai_improvement  String?           @db.Text
  xp_awarded      Int               @default(0)
  flag_reason     String?
  created_at      DateTime          @default(now())
  reviewed_at     DateTime?
  task            Task              @relation(fields: [task_id], references: [id], onDelete: Cascade)
  student         User              @relation(fields: [student_id], references: [id])
  moderation_logs ModerationLog[]
  @@index([student_id])
  @@index([status])
  @@index([created_at])
}

model Streak {
  id                     String    @id @default(cuid())
  student_id             String    @unique
  current_streak         Int       @default(0)
  longest_streak         Int       @default(0)
  last_active_date       DateTime?
  freeze_used_this_period Boolean  @default(false)
  multiplier             Float     @default(1.0)
  created_at             DateTime  @default(now())
  updated_at             DateTime  @updatedAt
  student                User      @relation(fields: [student_id], references: [id], onDelete: Cascade)
}

model XpLedger {
  id          String   @id @default(cuid())
  student_id  String
  xp_amount   Int
  source      String
  source_id   String?
  multiplier  Float    @default(1.0)
  final_xp    Int
  created_at  DateTime @default(now())
  student     User     @relation(fields: [student_id], references: [id], onDelete: Cascade)
  @@index([student_id])
  @@index([created_at])
}

model StudentScore {
  id                     String   @id @default(cuid())
  student_id             String   @unique
  consistency_score      Float    @default(0)
  depth_score            Float    @default(0)
  proof_score            Float    @default(0)
  total_xp               Int      @default(0)
  current_level          Int      @default(1)
  consistency_percentile Float    @default(0)
  depth_percentile       Float    @default(0)
  proof_percentile       Float    @default(0)
  last_computed_at       DateTime @default(now())
  student                User     @relation(fields: [student_id], references: [id], onDelete: Cascade)
}

model Badge {
  id         String    @id @default(cuid())
  student_id String
  type       BadgeType
  earned_at  DateTime  @default(now())
  student    User      @relation(fields: [student_id], references: [id], onDelete: Cascade)
  @@unique([student_id, type])
  @@index([student_id])
}

model PeerValidation {
  id            String   @id @default(cuid())
  submission_id String
  validator_id  String
  validated_id  String
  approved      Boolean
  created_at    DateTime @default(now())
  validator     User     @relation("Validator", fields: [validator_id], references: [id])
  validated     User     @relation("Validated", fields: [validated_id], references: [id])
  @@index([validator_id])
  @@index([validated_id])
}

model LeaderboardCache {
  id         String          @id @default(cuid())
  type       LeaderboardType
  scope      String
  data       Json
  cached_at  DateTime        @default(now())
  expires_at DateTime
  @@unique([type, scope])
}

model WeeklyChallenge {
  id           String      @id @default(cuid())
  roadmap_type RoadmapType
  title        String
  description  String      @db.Text
  starts_at    DateTime
  ends_at      DateTime
  xp_reward    Int
  badge_reward BadgeType?
  active       Boolean     @default(true)
  completions  ChallengeCompletion[]
}

model ChallengeCompletion {
  id           String          @id @default(cuid())
  challenge_id String
  student_id   String
  completed_at DateTime        @default(now())
  challenge    WeeklyChallenge @relation(fields: [challenge_id], references: [id])
  @@unique([challenge_id, student_id])
}

model MonthlyQuest {
  id                String    @id @default(cuid())
  student_id        String
  title             String
  description       String    @db.Text
  target_area       String
  final_output      String    @db.Text
  weekly_milestones Json
  xp_reward         Int
  badge_reward      BadgeType?
  month             Int
  year              Int
  completed         Boolean   @default(false)
  created_at        DateTime  @default(now())
  @@unique([student_id, month, year])
  @@index([student_id])
}

model Opportunity {
  id               String          @id @default(cuid())
  type             OpportunityType
  title            String
  company          String?
  organiser        String?
  description      String          @db.Text
  url              String
  deadline         DateTime?
  eligible_domains Domain[]
  eligible_years   Int[]
  is_remote        Boolean         @default(false)
  active           Boolean         @default(true)
  featured         Boolean         @default(false)
  created_at       DateTime        @default(now())
  @@index([type])
  @@index([active])
}

model ResourceSubmission {
  id                 String      @id @default(cuid())
  step_id            String
  submitted_by       String
  title              String
  url                String
  description        String      @db.Text
  ai_recommendation  String?
  status             String      @default("pending")
  created_at         DateTime    @default(now())
  step               RoadmapStep @relation(fields: [step_id], references: [id])
  submitter          User        @relation(fields: [submitted_by], references: [id])
  @@index([step_id])
  @@index([status])
}

model Notification {
  id         String           @id @default(cuid())
  student_id String
  type       NotificationType
  title      String
  body       String
  data       Json?
  read       Boolean          @default(false)
  sent_push  Boolean          @default(false)
  created_at DateTime         @default(now())
  student    User             @relation(fields: [student_id], references: [id], onDelete: Cascade)
  @@index([student_id])
  @@index([read])
}

model ModerationLog {
  id            String     @id @default(cuid())
  submission_id String
  student_id    String
  moderator_id  String?
  action        String
  reason        String
  xp_delta      Int        @default(0)
  created_at    DateTime   @default(now())
  submission    Submission @relation(fields: [submission_id], references: [id])
  student       User       @relation(fields: [student_id], references: [id])
  @@index([student_id])
}

model AiPrompt {
  id            String   @id @default(cuid())
  key           String   @unique
  system_prompt String   @db.Text
  model         String   @default("claude-haiku-4-5-20251001")
  temperature   Float    @default(0.7)
  max_tokens    Int      @default(1000)
  active        Boolean  @default(true)
  updated_by    String?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

model Company {
  id                  String   @id @default(cuid())
  name                String
  email               String   @unique
  password_hash       String
  website             String?
  verified            Boolean  @default(false)
  subscription_active Boolean  @default(false)
  subscription_ends   DateTime?
  created_at          DateTime @default(now())
}

model CollegePartnership {
  id                  String   @id @default(cuid())
  college_name        String   @unique
  college_slug        String   @unique
  admin_email         String   @unique
  password_hash       String
  partnership_active  Boolean  @default(false)
  partnership_ends    DateTime?
  logo_url            String?
  created_at          DateTime @default(now())
}
```

---

## Key Design Decisions

- **User soft delete:** `deleted_at` — never hard delete, audit trail preserved
- **XpLedger append-only:** Never update XP directly. Always ledger rows. Enables XP reversal on moderation rejection.
- **All timestamps UTC:** Application layer never converts to local time before storage
- **LeaderboardCache:** Computed data cached in DB. Invalidated after every submission pass.
- **AiPrompt in DB:** All AI behaviour editable from admin UI without code deploy
- **Streak separate table:** Isolates streak logic, simplifies daily reset cron
