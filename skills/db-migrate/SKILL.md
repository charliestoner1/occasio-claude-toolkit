---
name: db-migrate
description: Prisma migration workflow — schema changes, client regeneration, select clause updates, and financial field safety
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash(npx prisma *), Bash(npm run build), Read, Edit, Grep, Glob
argument-hint: "<description-of-change>"
---

# Prisma Migration Workflow

Safely apply a schema change: $ARGUMENTS

## Step 1: Review Current Schema

Read `prisma/schema.prisma` and understand the current state of the models being changed.

## Step 2: Make Schema Changes

Edit `prisma/schema.prisma` with the requested changes. Before saving, verify:
- Field types are correct (String, Int, Float, DateTime, Boolean, Json, etc.)
- Relations have proper `@relation` annotations with `fields` and `references`
- Indexes exist for frequently queried fields
- Optional fields use `?` suffix
- Default values are set where appropriate (`@default`)

## Step 3: Generate Migration

```bash
npx prisma migrate dev --name "<kebab-case-description>"
```

If this fails:
- **"Shadow database" error** → Check database connection string in `.env`
- **"Migration already applied"** → The change may already exist; check migration history
- **Relation conflict** → Ensure both sides of the relation are defined

## Step 4: Regenerate Client

```bash
npx prisma generate
```

This updates the TypeScript types. Without this, the build will fail with type errors.

## Step 5: Update Select Clauses (CRITICAL)

This is where most post-migration bugs come from. Search for all queries that touch the changed model:

```
Search for: prisma.<modelName>.findMany, prisma.<modelName>.findUnique, prisma.<modelName>.findFirst, prisma.<modelName>.create, prisma.<modelName>.update
```

For each query that uses a `select` clause:
- **New field added** → Add it to the `select` if it's needed by the consuming code
- **Field renamed** → Update the `select` key and all references to the old name
- **Field removed** → Remove from `select` and all references
- **Financial field added** (`*Subtotal`, `*Fee`, `*Discount`, `*Paid`, `*Amount`) → MUST be added to select clauses or TypeScript build fails

### Financial Fields Checklist
If the migration touches money-related fields, verify these are in all relevant select clauses:
- `bottleSubtotal`
- `signsSubtotal`
- `extraGuestsSubtotal`
- `promoDiscount`
- `depositAmountPaid`
- `processingFee`
- `minimumSpend`
- Any new financial field being added

## Step 6: Update TypeScript Types

If there are any manual type definitions that mirror the Prisma model (in `types/` or inline), update them to match.

## Step 7: Verify Build

```bash
npm run build
```

The build MUST pass. Common post-migration errors:
- `Property 'X' does not exist` → Missing from a select clause
- `Type 'X' is not assignable` → Field type changed, consumer expects old type
- `Argument of type 'X' is not assignable` → Create/update input doesn't match new schema

Fix any errors and rebuild until clean.

## Step 8: Report

Summarize:
- What changed in the schema
- Migration name
- Files updated (select clauses, type definitions)
- Build status
