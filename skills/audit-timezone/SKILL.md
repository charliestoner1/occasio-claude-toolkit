---
name: audit-timezone
description: Scan for timezone anti-patterns — wrong query patterns, fromZonedTime misuse, duration bugs, hardcoded UTC offsets
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(git diff *)
context: fork
agent: Explore
argument-hint: "[file-or-directory]"
---

# Timezone Anti-Pattern Audit

Scan for timezone bugs that cause off-by-one-day errors, wrong query results, and incorrect duration checks.

If `$ARGUMENTS` is provided, audit that specific file or directory. Otherwise, audit all files in `app/` and `lib/`.

## Background

This project has two date storage conventions and two corresponding query patterns. Using the wrong pattern is the #1 source of bugs.

### Pattern 1: Calendar date fields (midnight UTC)
Fields: `reservation.date`, `event.date`, `tableInventory.date`
Query with plain midnight-UTC boundaries — **NO `fromZonedTime`**.

```typescript
// CORRECT
const venueNow = toZonedTime(new Date(), venue.timezone)
const today = startOfDay(venueNow)     // midnight UTC of venue date
const todayEnd = endOfDay(venueNow)
prisma.reservation.findMany({ where: { date: { gte: today, lte: todayEnd } } })
```

### Pattern 2: Real timestamp fields (actual UTC instants)
Fields: `notification.createdAt`, `reservation.checkedInAt`, `reservation.createdAt`, etc.
Query with `fromZonedTime`-converted boundaries.

```typescript
// CORRECT
const venueNow = toZonedTime(new Date(), venue.timezone)
const todayStart = fromZonedTime(startOfDay(venueNow), venue.timezone)
const todayEnd = fromZonedTime(endOfDay(venueNow), venue.timezone)
prisma.notification.findMany({ where: { createdAt: { gte: todayStart, lte: todayEnd } } })
```

## Audit Checks

### Check 1: `fromZonedTime` + Calendar Date Field (CRITICAL)
Search for files that use `fromZonedTime` AND query `reservation.date`, `event.date`, or `tableInventory.date`.
This double-shifts the value and queries the wrong day.

```
Pattern: fromZonedTime in same file as .date: { or where.*date
```

**False positive filter:** If `fromZonedTime` is used ONLY for `createdAt`/`updatedAt`/`checkedInAt` queries in the same file, it's fine.

### Check 2: Missing `toZonedTime` Before Date Comparison
Search for `new Date()` used directly in date comparisons or date range calculations without first converting to venue timezone.

```
Pattern: startOfDay(new Date()) or endOfDay(new Date()) without toZonedTime
```

Near UTC midnight, `new Date()` returns a different calendar date than the venue's current date.

### Check 3: Duration Check Using `venueNow` (CRITICAL)
Search for `subHours`, `subMinutes`, `addHours`, `addMinutes` called on a `toZonedTime` result instead of raw `new Date()`.

```
Pattern: subHours(venueNow or subHours(toZonedTime or addHours(venueNow
```

Duration checks must use real UTC time, not timezone-shifted time.

### Check 4: Hardcoded Timezone Strings
Search for hardcoded timezone strings like `"America/Chicago"`, `"America/New_York"`, `"UTC"` outside of config files.

```
Exclude: lib/config/venue.ts, .env*, CLAUDE.md, MEMORY.md, *.md, node_modules
```

Should use `venue.timezone` from config.

### Check 5: Hardcoded UTC Offsets in Cron Schedules
Search `vercel.json` and cron route files for cron expressions with specific hour values (not `*`).

```
Pattern: "schedule": "0 \d+ \* \*
```

Crons should run hourly and check venue time in code.

### Check 6: `Date.now()` or `new Date()` for Display
Search for date values passed to UI without timezone conversion. Look for patterns where a raw Date is formatted for display without going through `toZonedTime` or `format` with timezone option.

### Check 7: Wrong Import
Search for files that import timezone functions but use them in ways that suggest confusion:
- Importing `fromZonedTime` but never using it (dead import, might indicate a pattern change was incomplete)
- Importing both `toZonedTime` and `fromZonedTime` — verify each is used for the correct purpose

## Severity Levels

- **CRITICAL** — Will produce wrong results (wrong day queried, wrong duration). Checks 1, 3.
- **HIGH** — May produce wrong results near midnight UTC. Checks 2, 5.
- **MEDIUM** — Maintenance/correctness concern. Checks 4, 6, 7.

## Report Format

For each issue:
```
[SEVERITY] file:line
  Problem: <what's wrong>
  Fix: <specific fix>
  Pattern: <which pattern should be used — 1 or 2>
```

If no issues found: "Timezone audit clean — all date queries use correct patterns."
