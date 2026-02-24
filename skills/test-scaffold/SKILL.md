---
name: test-scaffold
description: Generate Vitest test boilerplate for routes, components, and utilities — includes auth mocking, Prisma mocking, and security test registration
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: "<file-path> [--unit] [--integration] [--security]"
---

# Test Scaffolder

Generate test boilerplate for a file following project conventions.

**Target:** $ARGUMENTS

## Arguments

Parse `$ARGUMENTS`:
- First arg = file path to test (e.g., `app/api/admin/reports/route.ts` or `lib/pricing-utils.ts`)
- `--unit` = unit test (default for `lib/` files)
- `--integration` = integration test (default for `app/api/` routes)
- `--security` = also add to security test suite

## Step 1: Analyze the Target

Read the target file and determine:
- What functions/handlers it exports
- What dependencies it imports (Prisma, auth, external APIs)
- What needs mocking
- Whether it's an API route, utility, component, or store

## Step 2: Determine Test Location

- `lib/[name].ts` → `lib/__tests__/[name].test.ts`
- `app/api/[...]/route.ts` → `lib/__tests__/[route-name].test.ts` or `__tests__/[feature]/[name].test.ts`
- `components/[name].tsx` → `components/__tests__/[name].test.tsx`
- `lib/store/[name].ts` → `lib/__tests__/[name].test.ts`

## Step 3: Generate Test File

### Framework Setup
Vitest v4 with `globals: true` — no need to import `describe`, `it`, `expect`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
```

### Mock Patterns

#### Auth Mocking (for API routes)
```typescript
const mockGetToken = vi.fn()
vi.mock('next-auth/jwt', () => ({
  getToken: (...args: unknown[]) => mockGetToken(...args),
}))
```

#### Prisma Mocking
```typescript
const mockFindMany = vi.fn()
const mockFindUnique = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()

vi.mock('@/lib/prisma', () => ({
  prisma: {
    modelName: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}))
```

#### Feature Flags Mocking
```typescript
vi.mock('@/lib/config', () => ({
  features: {
    // set flags as needed for tests
    bottleService: true,
    staffPortal: true,
  },
}))
```

#### Zustand Store Mocking
```typescript
const mockStorage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value },
  removeItem: (key: string) => { delete mockStorage[key] },
})
```

#### Request Helper (for API routes)
```typescript
import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:3000'

function createRequest(
  path: string,
  options?: { method?: string; headers?: Record<string, string>; body?: unknown }
) {
  const { method = 'GET', headers = {}, body } = options ?? {}
  return new NextRequest(new URL(path, BASE_URL), {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}
```

### Test Structure

```typescript
describe('[ModuleName]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[functionName]', () => {
    it('should [expected behavior] when [condition]', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue({ id: '1', name: 'Test' })

      // Act
      const result = await functionName(input)

      // Assert
      expect(result).toEqual(expected)
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should return 401 when unauthenticated', async () => {
      mockGetToken.mockResolvedValue(null)
      const req = createRequest('/api/admin/test')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })
  })
})
```

### What Tests to Generate

For **API routes**, generate tests for:
- Auth: 401 when unauthenticated
- Happy path: correct response with valid input
- Validation: 400 when required fields missing
- Not found: 404 when resource doesn't exist
- Edge cases specific to the handler

For **utility functions**, generate tests for:
- Normal inputs → expected output
- Edge cases (empty arrays, zero values, null inputs)
- Error conditions (invalid inputs)

For **Zustand stores**, generate tests for:
- Initial state
- Each action modifies state correctly
- Reset/clear returns to initial state
- Computed/derived values update correctly

## Step 4: Security Test Registration

If the target is a protected API route (admin, staff, cron) OR `--security` flag is passed:

1. Read `__tests__/security/auth-enforcement.test.ts`
2. Add the new route to the appropriate array:
   - Admin routes → `adminRoutes` array
   - Staff routes → `staffRoutes` array
   - Cron routes → verify CRON_SECRET check exists
3. If the route is intentionally public, add to `publicRoutes` array with a comment

## Step 5: Report

Tell the user:
- Test file location created
- What mocks were set up and why
- What test cases were generated
- Whether the route was added to security tests
- Suggested additional test cases they might want to add
- Run command: `npm test -- [test-file-path]`
