---
name: new-feature
description: Feature bootstrap pipeline — scaffold component + route + test + security entry + theme check in one command
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, Task
argument-hint: "<feature-name> [--admin] [--booking] [--public]"
---

# New Feature — Bootstrap Pipeline

Scaffold everything needed for a new feature in one command: component, API route, test file, security test entry, and theme compatibility check.

**Feature:** $ARGUMENTS

## Arguments

Parse `$ARGUMENTS`:
- First arg = feature name in kebab-case (e.g., `drink-tickets`, `vip-upgrades`)
- `--admin` = admin-facing feature (admin route + admin component)
- `--booking` = customer-facing feature (public route + booking component)
- `--public` = public API (no auth required)
- Default = admin feature

## Step 1: Plan the Feature

Before scaffolding, determine what's needed:

1. **Component**: Where should the UI live?
   - `--admin` → `components/admin/{FeatureName}.tsx`
   - `--booking` → `components/booking/{FeatureName}.tsx`

2. **API Route**: What endpoints are needed?
   - CRUD pattern: `app/api/admin/{feature}/route.ts` (GET + POST)
   - With ID: `app/api/admin/{feature}/[id]/route.ts` (GET + PUT + DELETE)
   - Public: `app/api/{feature}/route.ts`

3. **Database**: Does this need a new model?
   - If yes, note it but don't auto-migrate — suggest `/db-migrate`

4. **Tests**: What test files are needed?
   - Unit test for any utility functions
   - API route test (auth + happy path)
   - Security test entry for protected routes

## Step 2: Scaffold API Route

Use the `/new-route` pattern:

### Auth Pattern
- `--admin` → `verifyAdmin()` from `@/lib/auth-helpers`
- `--booking` → `verifyStaffOrAdmin()` or no auth (customer endpoint)
- `--public` → no auth

### Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const authError = await verifyAdmin(request)
  if (authError) return authError

  try {
    // TODO: Implement GET handler
    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('[{FEATURE}] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch {feature}' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    // TODO: Validate body
    // TODO: Create record
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[{FEATURE}] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create {feature}' },
      { status: 500 }
    )
  }
}
```

## Step 3: Scaffold Component

Use the `/component` pattern with project conventions:
- Dark theme first (`bg-zinc-900`, `text-white`)
- Primary color via `bg-emerald-500` (theme-overridden)
- Text on primary: `text-[var(--color-on-primary)]`
- Mobile responsive (44px touch targets, `useIsMobile` if needed)
- Glass card style: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`

## Step 4: Scaffold Test File

Use the `/test-scaffold` pattern:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetToken = vi.fn()
vi.mock('next-auth/jwt', () => ({
  getToken: (...args: unknown[]) => mockGetToken(...args),
}))

// Prisma mocks for the model
const mockFindMany = vi.fn()
vi.mock('@/lib/prisma', () => ({
  prisma: {
    {modelName}: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}))

describe('{FeatureName} API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    // TODO: implement
  })

  it('returns data when authenticated', async () => {
    // TODO: implement
  })
})
```

## Step 5: Register in Security Tests

If the route is protected (not `--public`):

1. Read `__tests__/security/auth-enforcement.test.ts`
2. Add the new route(s) to the appropriate array:
   - Admin routes → `adminRoutes`
   - Staff routes → `staffRoutes`
3. Verify the test passes

## Step 6: Theme Check

After scaffolding the component, do a quick theme compatibility check:
- Any `text-white` on primary/accent backgrounds? → Use CSS variables
- Any new Tailwind color classes? → Need CSS overrides in `globals.css`
- Monochrome theme safe? (primary=white)

## Step 7: Report

```
## Feature Bootstrap Complete: {feature-name}

### Files Created
- Component: components/{area}/{FeatureName}.tsx
- API Route: app/api/{area}/{feature}/route.ts
- Test: lib/__tests__/{feature}.test.ts
- Security: Updated __tests__/security/auth-enforcement.test.ts

### Next Steps
1. [ ] Implement the GET handler (fetch from database)
2. [ ] Implement the POST handler (validate + create)
3. [ ] Wire up the component to the API route
4. [ ] Add to navigation/sidebar (if admin feature)
5. [ ] Add to booking flow (if customer feature)
6. [ ] Run /preflight before deploying

### If Database Changes Needed
Run: /db-migrate "add {feature} model"

### If Feature Flag Needed
Add to lib/config/features.ts:
  FEATURE_{FEATURE_UPPER}: process.env.FEATURE_{FEATURE_UPPER} !== 'false'
```
