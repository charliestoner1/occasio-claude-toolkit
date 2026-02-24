---
name: new-route
description: Scaffold a new API route with auth, timezone, error handling, and security test entry
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash, Read, Edit, Write, Grep
argument-hint: "<path> [--public] [--staff] [--cron]"
---

# Scaffold New API Route

Create a new API route at the specified path with all project conventions baked in.

**Usage:** `/new-route admin/reports --staff` or `/new-route availability/special --public`

## Arguments

Parse `$ARGUMENTS`:
- First arg = route path (e.g., `admin/reports` → `app/api/admin/reports/route.ts`)
- `--public` = no auth required (for customer-facing endpoints)
- `--staff` = staff auth (requires `x-staff-id` header or JWT)
- `--cron` = cron job (requires `CRON_SECRET` verification)
- Default (no flag) = admin auth (requires JWT)

## Route Template

Generate the route file at `app/api/<path>/route.ts` with:

### Auth Pattern
- **Admin (default):** Import `verifyAdmin` from `@/lib/auth-helpers`, call at top of handler, return 401 if invalid
- **Staff (`--staff`):** Import `verifyStaffOrAdmin` from `@/lib/auth-helpers`
- **Cron (`--cron`):** Check `request.headers.get('authorization') === \`Bearer \${process.env.CRON_SECRET}\``
- **Public (`--public`):** No auth check

### Timezone Pattern
Include the correct timezone imports and patterns from CLAUDE.md:
```typescript
import { toZonedTime } from 'date-fns-tz'
import { venue } from '@/lib/config/venue'

const venueNow = toZonedTime(new Date(), venue.timezone)
```

### Error Handling
Wrap handler body in try/catch, return appropriate status codes with JSON error messages.

### Prisma Safety
If the route queries the database, include `take: 1000` safety limit on unbounded queries.

## Post-Scaffold

After creating the route:

1. **Add to security tests** — If the route is NOT public, add it to `__tests__/security/auth-enforcement.test.ts` in the appropriate section (admin routes, staff routes, or cron routes).

2. **Show the user** what was created and what they need to implement in the handler body.

3. **Remind** about:
   - Pattern 1 vs Pattern 2 for date queries (calendar date vs real timestamp)
   - Adding financial fields to select clauses if the route touches money
   - Mobile considerations if the route serves a page
