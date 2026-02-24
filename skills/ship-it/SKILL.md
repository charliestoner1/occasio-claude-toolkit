---
name: ship-it
description: Full deployment readiness pipeline — build, tests, code review, dependency check, and security scan in parallel
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Task
argument-hint: "[--fix]"
---

# Ship It — Deployment Readiness Pipeline

Run everything needed to confirm this codebase is ready to deploy. More thorough than `/preflight` — this is the "I'm about to push to production" check.

**Arguments:**
- No args: audit only (report findings)
- `--fix`: automatically fix issues found

## Pipeline

### Phase 1: Build & Test (sequential — must pass first)

Run these sequentially because later checks are meaningless if the build fails:

1. **TypeScript Build**
   ```bash
   npm run build
   ```
   If this fails, stop and fix build errors first (use `/fix-build` approach).

2. **Test Suite**
   ```bash
   npm test
   ```
   Report any failures. If tests fail, note them but continue with audits.

3. **Security Tests**
   ```bash
   npm run test:security
   ```
   Verify all 61+ auth enforcement tests pass.

### Phase 2: Parallel Audits (launch simultaneously)

Only proceed here if build passes. Launch as parallel Task agents:

1. **Code Review** (subagent_type: Explore)
   - Prompt: "Review all uncommitted changes (git diff HEAD + untracked files) against project conventions. Check for: timezone pattern misuse, theme compatibility (text-white on primary backgrounds), mobile responsiveness (44px touch targets), security (auth checks on new routes), financial accuracy (revenue formula, fee calculation, payment modes), Prisma select clauses, code quality (console.log, unused imports, any types). Report each issue with severity, file:line, and fix."

2. **Dependency Audit** (subagent_type: Explore)
   - Prompt: "Run npm audit and npm outdated. Report: security vulnerabilities (critical/high/moderate), outdated packages with available updates (prioritize next, prisma, react), and any unused dependencies that could be removed. Summarize actionable items."

3. **Quick Security Scan** (subagent_type: Explore)
   - Prompt: "Quick security scan: check for hardcoded secrets in app/ and lib/ (API keys, passwords, tokens not from env vars), new API routes missing auth checks (cross-ref with __tests__/security/auth-enforcement.test.ts), and any unprotected admin/staff endpoints. Report findings only — no false positives from test fixtures."

4. **Vercel Env Var Check** (subagent_type: Bash)
   - Compare local `.env` keys against what's deployed on Vercel production.
   - Steps:
     1. Run `vercel env ls production` to get all deployed env var names
     2. Read the active local `.env` file (check `.env.local` first, then `.env`) and extract all key names (lines matching `KEY=value`, ignoring comments and blank lines)
     3. Also check `.env.example` for any keys that should exist
     4. Diff the sets:
        - **Missing on Vercel**: keys in local `.env` but NOT on Vercel (potential deploy failures)
        - **Missing locally**: keys on Vercel but NOT in local `.env` (informational only — may be venue-specific)
        - **In .env.example but missing from Vercel**: keys that the project expects but aren't deployed
     5. Ignore `NEXT_PUBLIC_` prefix differences and known local-only vars like `DATABASE_URL` (Vercel auto-injects this via Neon integration)
   - Report format:
     ```
     ## Vercel Env Vars
     - Missing on Vercel (BLOCKERS): [list or "none"]
     - Missing locally (info only): [list or "none"]
     - Expected (.env.example) but not deployed: [list or "none"]
     ```

### Phase 3: Synthesize & Decide

Combine all results:

```
# Ship It — Readiness Report

## Build & Tests
- Build: PASS / FAIL
- Tests: X passed, Y failed
- Security tests: PASS / FAIL

## Code Review
- Issues: X critical, Y high, Z medium
- [list critical/high issues]

## Dependencies
- Vulnerabilities: X critical, Y high
- Outdated: X major, Y minor, Z patch

## Security
- Issues found: [list]

## Vercel Env Vars
- Missing on Vercel: [list or "none"]
- Missing locally: [list or "none"]
- Expected but not deployed: [list or "none"]

## Verdict
🟢 SHIP IT — No blockers found
🟡 FIX FIRST — [N] issues need attention before deploy
🔴 DO NOT SHIP — Critical issues found
```

### Phase 4: Auto-Fix (if `--fix` flag)

If `--fix` was passed and issues were found:
1. Create a todo list of all fixable issues
2. Fix them in order of severity (critical → high → medium)
3. Re-run build and tests after fixes
4. Report what was fixed and what needs manual attention

### Phase 5: Final Checklist

Regardless of verdict, remind about:
- [ ] Database migrations applied to production?
- [ ] Environment variables set on Vercel? (auto-checked in Phase 2)
- [ ] Cron job schedules correct in vercel.json?
- [ ] Feature flags configured for the target venue?
