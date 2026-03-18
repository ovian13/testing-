# T1_02 — VIBE CODE RULES
> Type 1 — Human Reference. Read before every build session.
> These rules protect the product from the only real enemy: confusion.

---

## The Golden Rule
**One person owns the system. The other two build inside it.**

That person is Vimal — not because he codes best, but because he thinks in systems.
His job during vibe coding is not to write the most code. It is to:
- Define what gets built and in what order (via briefs in `/docs/briefs/`)
- Set the structure that AI builds *inside*
- Review outputs before they connect to each other
- Catch when two pieces don't talk to each other

---

## Before You Open Any AI Tool

### Step 1 — Get Vimal's Brief
Every build session starts with a written brief from Vimal.
Briefs live in `/docs/briefs/`. Use the template at the bottom of `T1_05_GIT_AND_LOGS.md`.

**If no brief exists, the session does not start. No exceptions.**

### Step 2 — Load the AI Context Files
Before your first prompt, paste these files into your AI tool's context window.
In Cursor/Windsurf use `@filename`. In Claude/ChatGPT, paste the content.

**Always load:**
- `docs/ai/T2_01_PROJECT_CONTEXT.md`
- `docs/ai/T2_05_CODE_STANDARDS.md`
- `docs/ai/T2_06_SECURITY_RULES.md`

**For feature work, also load:**
- `docs/ai/T2_02_TECH_ARCHITECTURE.md` (when building anything structural)
- `docs/ai/T2_03_DATABASE_SCHEMA.md` (when touching DB or writing queries)
- `docs/ai/T2_04_API_CONTRACTS.md` (when building API routes or calling APIs)
- `docs/ai/T2_07_FEATURE_SPECS.md` (when building a specific platform feature)

### Step 3 — Claim Your File
Post in team chat: *"I'm working on [filename/feature] right now."*
Two people never work on the same file at the same time.

### Step 4 — Check the Stack
Re-read `docs/ai/T2_02_TECH_ARCHITECTURE.md` section: "Stack Decisions."
Never introduce a new library without a team decision first.

---

## The Session Opener
**Paste this at the start of every AI session, every time:**

```
You are helping build Eakalaiva — a free skill-tracking and opportunity platform
for Tamil Nadu engineering students from tier-2 and tier-3 colleges.

I am loading your context files now. Read them fully before responding.

[PASTE T2_01_PROJECT_CONTEXT.md content here]
[PASTE T2_05_CODE_STANDARDS.md content here]
[PASTE T2_06_SECURITY_RULES.md content here]
[PASTE ADDITIONAL T2 FILES AS NEEDED]

Rules for this session:
- Follow the code standards exactly as written
- Follow the security rules without exception
- Ask me before introducing any library not in the stack
- After every output: tell me what assumptions you made and what could break
- One feature per session. Do not expand scope.
- Stack: [PASTE YOUR STACK FROM T2_02]
```

---

## While Building

| Rule | Why |
|---|---|
| One feature per session | AI context bleeds across long sessions |
| Read every output before running | Catch hardcoded credentials, broken imports |
| Ask AI "what assumptions did you make?" after every output | Surfaces hidden problems before they become bugs |
| Keep AI_BUILD_LOG updated after every session | Your team's memory for when things break |
| If you don't understand a line — ask AI to explain it | If it can't explain simply, rebuild smaller |
| Never paste AI code across multiple files without reading all of it | Cross-file bugs are the hardest to find |

---

## The Three Tests (Before Every Merge)

### Test 1 — The Plain English Test
Builder explains what they built in 2 sentences to one teammate.

> Example: "This component takes an array of student objects sorted by consistency score and renders the top 10 with name, college, and score. It re-fetches every 60 seconds via the `/api/leaderboard/consistency` endpoint."

**If teammate doesn't understand it in 2 sentences — code doesn't merge.**

### Test 2 — The Connection Test
Answer these before merging:
1. What does this receive as **input**?
2. What does this **output** or return?
3. **Who calls this** and when?

If any answer is "I'm not sure" — find out before merging.

### Test 3 — The Security Test
Run through `docs/ai/T2_06_SECURITY_RULES.md` checklist manually.
Takes 5 minutes. Catches 80% of AI security mistakes.

---

## After Every Session

### Commit Rule
Every active day ends with a commit. Even broken work. Especially broken work.

```
[type] Area: What it does — what works / what's pending
```

Examples (good):
```
feat Leaderboard: top 10 by consistency score — renders correctly / peer score not connected yet
fix Auth: Google OAuth mobile — session persistence fixed / refresh token rotation pending
wip GitHub Integration: API call works — empty repo detection not yet added
config ENV: EXPO_PUBLIC_ variables added for mobile — no values committed
```

### AI Build Log
Add one row to `docs/logs/AI_BUILD_LOG.md` after every session.
Template is in `T1_05_GIT_AND_LOGS.md`.

---

## Hard Rules — Zero Exceptions

| Rule | Consequence if broken |
|---|---|
| 🚫 No credentials in code. Use `.env` | Security breach waiting to happen |
| 🚫 No merge without one person reviewing | Broken code ships to real students |
| 🚫 No AI code in production without manual end-to-end test | AI doesn't know your real data |
| 🚫 If none of you can explain it — delete and rebuild smaller | Mystery code breaks at the worst moment |
| 🚫 No "works on my machine" — test on staging | Production is not your machine |
| 🚫 No new library without team agreement | Stack fragmentation breaks the AI's context |

---

## Mobile-Specific Rules (Expo)

- All API calls from mobile use the same base URL as web — stored in `EXPO_PUBLIC_API_URL`
- All sensitive data on device stored in `expo-secure-store` — never AsyncStorage
- Test on both iOS simulator and Android emulator before marking done
- Push notification permission must be requested gently — explain the value first
- All mobile API calls must handle offline state gracefully — show a clear message, not a crash
- Biometric auth (Face ID / fingerprint) is additive — not a replacement for password

---

## When Something Breaks in Production

1. **Stop.** Don't keep pushing fixes blindly.
2. Check `docs/logs/AI_BUILD_LOG.md` — find last session touching that area.
3. Read the actual code — not the AI's description of it.
4. Fix the smallest possible change first.
5. Log it in `docs/logs/INCIDENT_LOG.md` with root cause.
6. If a real student lost data or streak — acknowledge it directly. Don't hide it.
