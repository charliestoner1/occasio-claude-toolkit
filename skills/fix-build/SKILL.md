---
name: fix-build
description: Diagnose and fix Next.js build errors — TypeScript issues, missing Prisma fields, bad imports, dynamic import casts
disable-model-invocation: false
user-invocable: true
allowed-tools: Bash(npm run build), Read, Edit, Grep, Glob
---

# Fix Build Errors

Run the build, parse the errors, and fix them systematically.

## Step 1: Run Build

```bash
npm run build
```

Capture the full output.

## Step 2: Parse & Categorize Errors

Group errors by type:

### Category A: Missing Prisma Select Fields
**Pattern:** `Property 'fieldName' does not exist on type`
**Fix:** Add the missing field to the `select` clause in the Prisma query. Financial fields are the most common culprits: `bottleSubtotal`, `signsSubtotal`, `extraGuestsSubtotal`, `promoDiscount`, `depositAmountPaid`, `processingFee`.

### Category B: Module Not Found
**Pattern:** `Module not found: Can't resolve '@/...'`
**Fix:** Check if the file exists at the path. Common causes:
- File was moved/renamed
- Missing `index.ts` barrel export
- Typo in import path

### Category C: Type Mismatches
**Pattern:** `Type 'X' is not assignable to type 'Y'`
**Fix:** Check Prisma schema for recent changes. Regenerate client if needed:
```bash
npx prisma generate
```

### Category D: Dynamic Import Cast Errors
**Pattern:** Issues with dynamically imported components
**Fix:** Use the project's established cast patterns:
- `react-big-calendar`: cast as `ComponentType<CalendarProps<any, any>>`
- `react-easy-crop`: cast as `unknown as ComponentType<Partial<CropperProps>>`

### Category E: ESLint / React Errors
**Pattern:** Hook rules, missing deps, unused vars
**Fix:** Address directly — don't suppress with `// eslint-disable` unless truly necessary.

## Step 3: Fix Errors

Fix each error, starting with the ones that cause the most cascading failures (usually bad imports or missing Prisma fields).

## Step 4: Verify

Run `npm run build` again. Repeat until clean.

## Step 5: Report

Show what was fixed, organized by file. If there are warnings (not errors), mention them but don't fix unless asked.
