---
name: review-changes
description: Deep code review of uncommitted changes — checks all project gotchas (timezone, theme, mobile, security, pricing, Prisma) in one pass
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(git *)
argument-hint: "[branch-or-commit-range]"
---

# Code Review — All Gotchas in One Pass

Review uncommitted changes (or a branch/commit range) against every project convention and known footgun.

## Scope

- **No arguments**: Review all uncommitted changes (`git diff HEAD` + untracked files)
- **Branch name**: Review changes between that branch and current HEAD (`git diff branch...HEAD`)
- **Commit range**: Review the specified range (`git diff a..b`)

## Step 1: Gather Changes

```bash
# Get changed files
git diff --name-only HEAD        # unstaged
git diff --cached --name-only    # staged
git ls-files --others --exclude-standard  # untracked

# Get the actual diffs
git diff HEAD
git diff --cached
```

Filter to code files only: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.json` (ignore lock files, generated files).

## Step 2: Run All Checks

For each changed file, run these checks. Only report issues — don't report clean files.

### A. Timezone Patterns
- [ ] `fromZonedTime` used with `reservation.date`, `event.date`, or `tableInventory.date` → CRITICAL
- [ ] `subHours`/`addHours` called on `toZonedTime()` result instead of raw `new Date()` → CRITICAL
- [ ] `new Date()` used for date comparison without `toZonedTime` first → HIGH
- [ ] Hardcoded timezone string (not from `venue.timezone`) → MEDIUM
- [ ] Date displayed without timezone conversion → MEDIUM

### B. Theme Compatibility
- [ ] `text-white` on primary/accent background (should be `var(--color-on-primary)` or `var(--color-on-accent)`) → CRITICAL
- [ ] New hardcoded Tailwind color class without CSS override in `globals.css` → HIGH
- [ ] Hardcoded hex colors that should use CSS variables → MEDIUM
- [ ] Exception: status badges (red/green/blue) with `text-white` are fine

### C. Mobile Responsiveness
- [ ] Interactive elements smaller than 44px (buttons, links, toggles) → HIGH
- [ ] Missing responsive classes (no `md:` breakpoint variants for layout changes) → MEDIUM
- [ ] Fixed widths that could overflow on mobile → MEDIUM
- [ ] `onClick` without corresponding touch event handling (if needed) → LOW

### D. Security
- [ ] New API route in `app/api/admin/` or `app/api/staff/` missing auth check → CRITICAL
- [ ] New API route not added to `__tests__/security/auth-enforcement.test.ts` → HIGH
- [ ] SQL/NoSQL injection risk (raw user input in queries) → CRITICAL
- [ ] Client-provided values trusted without server-side validation → HIGH
- [ ] Secrets or API keys in code (not env vars) → CRITICAL

### E. Financial Accuracy
- [ ] Revenue calculated using `minimumSpend` instead of component subtotals → CRITICAL
- [ ] Processing fee calculated incorrectly (should be 3.3% + $0.30) → CRITICAL
- [ ] Missing payment mode handling (must support deposit/full/split) → HIGH
- [ ] `depositAmountPaid` confused with total LINQ charge → HIGH
- [ ] Client-side discount amount trusted without server verification → CRITICAL

### F. Prisma / Database
- [ ] `findMany` without `take` limit → MEDIUM
- [ ] `select` clause missing financial fields (if querying reservations) → HIGH
- [ ] Missing `where` clause on delete/update (unbounded mutation) → CRITICAL

### G. Code Quality
- [ ] `console.log` left in production code (should be removed or use proper logger) → LOW
- [ ] Unused imports → LOW
- [ ] Hardcoded model IDs (should use `lib/config/ai.ts`) → MEDIUM
- [ ] `any` type that could be more specific → LOW
- [ ] Error swallowed without logging → MEDIUM

## Step 3: Report

### Format
```
## Review Summary

Files reviewed: N
Issues found: N (X critical, Y high, Z medium)

### Critical Issues
- [file:line] Description → Fix

### High Issues
- [file:line] Description → Fix

### Medium Issues
- [file:line] Description → Fix

### Low Issues
- [file:line] Description → Fix

### Clean Files
- file1.ts, file2.tsx (no issues)
```

### Verdict
- **Ship it** — No critical or high issues
- **Fix first** — Critical or high issues found, list what must be fixed
- **Needs discussion** — Architectural concerns that need team input
