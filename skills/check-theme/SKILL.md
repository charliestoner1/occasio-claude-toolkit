---
name: check-theme
description: Audit UI changes for theme system compatibility — catches hardcoded colors that break themed venues
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(git diff *)
context: fork
agent: Explore
---

# Theme Compatibility Audit

Audit recent changes (or a specific file/component) for theme system compatibility.

If `$ARGUMENTS` is provided, audit that specific file or component. Otherwise, audit all uncommitted changes.

## Context

This project uses a CSS override system in `globals.css` that redirects hardcoded Tailwind classes to CSS variables. For example, `.bg-emerald-500` maps to `var(--color-primary)`. This allows venue owners to customize their theme colors.

### The Rules

1. **Primary backgrounds** (`bg-emerald-*`, `bg-primary`) must use text color `var(--color-on-primary)` — NOT `text-white`
2. **Accent backgrounds** (`bg-amber-*`, `bg-accent`) must use text color `var(--color-on-accent)` — NOT `text-white`
3. **Status badges** (red/green/blue for confirmed/cancelled/pending) are EXEMPT — they always use literal `text-white`
4. **New hardcoded Tailwind color classes** need corresponding CSS overrides in `globals.css`
5. **Monochrome theme** has primary=white, accent=gray, so `text-white` on primary backgrounds = invisible text

## Audit Steps

### 1. Identify Changed Files
```bash
git diff --name-only HEAD
git diff --cached --name-only
```
Filter to `.tsx`, `.jsx`, `.css` files only.

### 2. Scan for Hardcoded Colors
In each changed file, look for:
- `text-white` on elements with primary/accent backgrounds → should be `text-[var(--color-on-primary)]` or `text-[var(--color-on-accent)]`
- `text-black` that should be theme-aware
- New `bg-emerald-*`, `bg-amber-*`, `bg-teal-*`, `bg-green-*` classes → check if CSS override exists in `globals.css`
- `text-emerald-*`, `text-amber-*` etc. → check for override in `globals.css`
- Hardcoded hex colors (`#xxxx`) that should use CSS variables

### 3. Cross-Reference globals.css
Read `app/globals.css` and verify that any Tailwind color classes used in the changed files have corresponding CSS overrides.

### 4. Report

For each issue found:
- File and line number
- What's wrong (e.g., "text-white on primary background")
- Suggested fix (e.g., "use text-[var(--color-on-primary)]")
- Severity: CRITICAL (invisible text on some themes) vs WARNING (missing override, might look off)

If no issues found: "Theme audit clean — changes are compatible with all venue themes."
