---
name: debug
description: Systematic debugging — find root cause before proposing fixes. Use for any non-booking bug, test failure, or unexpected behavior
disable-model-invocation: false
user-invocable: false
allowed-tools: Read, Grep, Glob, Bash
---

# Systematic Debugging

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

Use for any technical issue that isn't booking/payment-specific (use `booking-debug` for those).

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

- Test failures
- Build errors that aren't obvious (for obvious ones, use `fix-build`)
- Unexpected behavior
- Performance problems
- Integration issues
- CSS/layout bugs

**Use ESPECIALLY when:**
- Under time pressure (rushing guarantees rework)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes that didn't work

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read error messages carefully** — don't skip past them. Read stack traces completely. Note line numbers, file paths, error codes.

2. **Reproduce consistently** — can you trigger it reliably? What are the exact steps? If not reproducible, gather more data.

3. **Check recent changes** — `git diff`, recent commits, new dependencies, config changes, environmental differences.

4. **Gather evidence at component boundaries:**
   For multi-component issues (API → service → database, client → API → Prisma):
   - Log what data enters each component
   - Log what data exits
   - Verify env/config propagation
   - Find WHERE it breaks, THEN investigate that specific component

5. **Trace data flow** — where does the bad value originate? What called this with the bad value? Keep tracing up until you find the source. Fix at source, not at symptom.

### Phase 2: Pattern Analysis

1. **Find working examples** — locate similar working code in the same codebase
2. **Compare** — what's different between working and broken?
3. **List every difference** — don't assume "that can't matter"
4. **Understand dependencies** — what config, env, state does this need?

### Phase 3: Hypothesis and Testing

1. **Form a single hypothesis** — "I think X is the root cause because Y"
2. **Test minimally** — smallest possible change, one variable at a time
3. **Verify** — did it work? If not, form a NEW hypothesis. Don't stack fixes.
4. **If 3+ fixes failed** — STOP. Question the approach. This is an architectural problem, not a bug. Discuss before attempting more.

### Phase 4: Implementation

1. **Create failing test** if possible (simplest reproduction)
2. **Implement single fix** — one change, no "while I'm here" improvements
3. **Verify fix** — test passes, no other tests broken, issue actually resolved
4. **If fix doesn't work** — return to Phase 1 with new information

## Red Flags — STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" after 2+ failures

**ALL of these mean: Return to Phase 1.**

## Project-Specific Debugging Hints

**Timezone bugs:** Check which query pattern is used (Pattern 1 vs Pattern 2 — see CLAUDE.md). This is the #1 source of off-by-one date bugs.

**Prisma TypeScript errors:** Usually a missing field in a `select` clause. Financial fields are the most common culprit.

**Dynamic import errors:** Check the cast patterns in CLAUDE.md gotchas.

**Theme/CSS bugs:** Check if a Tailwind class has a CSS override in `globals.css` that's redirecting it to a CSS variable.

**Push notification failures:** Check VAPID keys, service worker registration, subscription status.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, skip process" | Simple issues have root causes too. Process is fast. |
| "Emergency, no time" | Systematic is FASTER than guess-and-check. |
| "I see the problem" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" | 3+ failures = wrong approach. Step back. |
