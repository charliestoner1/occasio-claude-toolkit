---
name: full-audit
description: Run all audit agents in parallel — timezone, theme, security, pricing, accessibility, performance — and synthesize results into one report
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash, Edit, Write, Task
argument-hint: "[file-or-scope]"
---

# Full Audit — Orchestrator

Run the complete audit suite in parallel and synthesize results into a single actionable report.

**Scope:** $ARGUMENTS (default: full codebase)

## Strategy

Launch audit agents in parallel using the Task tool, then combine their findings into a unified report ranked by severity.

## Step 1: Launch Parallel Audits

Spawn ALL of these as parallel Task agents (subagent_type: Explore). Each gets its own forked context so they don't interfere.

### Wave 1 — Launch simultaneously:

1. **Timezone Audit**
   - Prompt: "Run the audit-timezone skill. Scan all files in app/ and lib/ for timezone anti-patterns: wrong Pattern 1/2 usage, fromZonedTime on calendar dates, duration checks using venueNow, hardcoded timezone strings, UTC offsets in crons. Report findings with severity, file:line, problem, and fix."

2. **Theme Audit**
   - Prompt: "Run the check-theme skill. Audit all .tsx/.css files for theme compatibility issues: text-white on primary/accent backgrounds (should be var(--color-on-primary)), new Tailwind color classes without CSS overrides in globals.css, hardcoded hex colors. Report findings with severity, file:line, problem, and fix."

3. **Security Audit**
   - Prompt: "Run the security-audit skill. Check for: hardcoded secrets, API routes missing auth checks, payment amount tampering risks, injection vulnerabilities (XSS, SQL), data exposure in API responses, missing rate limiting. Cross-reference with __tests__/security/auth-enforcement.test.ts for coverage gaps. Report findings with severity, file:line, problem, and fix."

4. **Pricing Audit**
   - Prompt: "Run the pricing-verify skill. Verify: revenue formula consistency (bottleSubtotal + signsSubtotal + extraGuestsSubtotal - promoDiscount), processing fee calculation (3.3% + $0.30), all three payment modes handled, depositAmountPaid vs total charge distinction, server-side promo code verification, Prisma select clauses include financial fields. Report findings with severity, file:line, problem, and fix."

5. **Accessibility Audit**
   - Prompt: "Run the a11y-audit skill. Focus on the customer-facing booking flow (app/booking/*, components/booking/*). Check: semantic HTML, ARIA labels on interactive elements, keyboard navigation (focus-visible, escape key), color contrast ratios, form accessibility (labels, error messages), touch target sizes (44px minimum). Report findings with severity, file:line, problem, and fix."

6. **Performance Audit**
   - Prompt: "Run the perf-audit skill. Check: unnecessary 'use client' directives, large client components that could be split, missing next/image usage, missing Suspense boundaries, client-side fetching that could be server-side, heavy dependencies not dynamically imported (react-big-calendar, react-easy-crop), animation performance. Report findings with severity, file:line, problem, and fix."

7. **Theme Visual Quality**
   - Prompt: "Run `npx tsx scripts/review-themes.ts` and report the results. Flag any themes with FAIL or NEEDS WORK verdicts. For each issue, include the theme name, failing color pair, actual ratio vs required ratio, and suggested fix. Summarize with the overall pass/fail count."

## Step 2: Collect Results

Wait for all agents to complete. Extract findings from each.

## Step 3: Synthesize Report

Combine all findings into a single report, deduplicated and ranked:

```
# Full Audit Report

## Summary
| Audit | Critical | High | Medium | Low |
|-------|----------|------|--------|-----|
| Timezone | X | X | X | X |
| Theme | X | X | X | X |
| Security | X | X | X | X |
| Pricing | X | X | X | X |
| Accessibility | X | X | X | X |
| Performance | X | X | X | X |
| Theme Quality | X | X | X | X |
| **Total** | **X** | **X** | **X** | **X** |

## Critical Issues (fix immediately)
1. [SECURITY] file:line — Description → Fix
2. [PRICING] file:line — Description → Fix
...

## High Issues (fix before next deploy)
1. [TIMEZONE] file:line — Description → Fix
...

## Medium Issues (fix soon)
...

## Low Issues (nice to have)
...

## Passed Checks
- [list of categories that came back clean]

## Recommended Fix Order
1. [highest impact, easiest fix first]
2. ...
```

## Step 4: Offer to Fix

After presenting the report, ask:
"Want me to fix the critical and high issues now?"

If yes, create a todo list and work through fixes systematically, running `/preflight` at the end.
