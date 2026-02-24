---
name: preflight
description: Run pre-deployment checks — build, tests, security, and common issue detection
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash(npm *), Bash(npx *), Read, Grep, Glob
argument-hint: "[--skip-tests] [--quick]"
---

# Pre-Flight Checks

Run the full pre-deployment verification for Cantina Booking. This catches TypeScript errors, missing Prisma select fields, broken imports, auth gaps, and theme issues before they hit production.

## Steps

### 1. TypeScript Build Check
Run `npm run build` and capture output. This is the most important check — it catches:
- Missing financial fields in Prisma `select` clauses
- Bad imports and broken references
- Type mismatches

If the build fails, analyze the error and suggest a fix. Common patterns:
- `Property 'X' does not exist` → missing field in a Prisma select clause
- `Module not found` → bad import path or missing dependency
- `Type 'X' is not assignable` → type mismatch, often from Prisma schema changes

### 2. Run Tests
Unless `$ARGUMENTS` contains `--skip-tests`:
```bash
npm test
```

If tests fail, show which tests failed and suggest fixes.

### 3. Security Test Suite
```bash
npm run test:security
```
Verify all 61+ auth enforcement tests pass. If a new API route was added, check whether it needs to be added to `__tests__/security/auth-enforcement.test.ts`.

### 4. Quick Scan (if `--quick` is NOT in arguments)

Scan for common issues:
- **Hardcoded timezone**: Search for `"America/"` or `"UTC"` in app/ and lib/ that isn't in config files — should use `venue.timezone`
- **Hardcoded model IDs**: Search for `claude-` in app/ and lib/ that isn't in `lib/config/ai.ts` — should use centralized config
- **Missing theme overrides**: Search for new Tailwind color classes (bg-emerald, bg-amber, text-emerald, etc.) in recently changed files that don't have corresponding CSS overrides in `globals.css`
- **Unprotected API routes**: Check if any new files in `app/api/admin/` or `app/api/staff/` are missing auth checks

### 5. Report

Summarize results:
- Build: PASS/FAIL
- Tests: X passed, Y failed
- Security: PASS/FAIL
- Scan: Issues found (if any)

If everything passes, say "All clear — ready to deploy."
