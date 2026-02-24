---
name: add-feature-flag
description: Scaffold a new feature flag — adds to features.ts, .env files, optionally wraps a component
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: "<flagName> [--category=<cat>] [--default=false] [--wrap=<Component>] [--client]"
---

# Add Feature Flag

Scaffold a new feature flag across all necessary files.

**Target:** $ARGUMENTS

## Arguments

- `<flagName>` — camelCase flag name (e.g., `vipLounge`, `loyaltyProgram`)
- `--category=<cat>` — Category group: "Core Booking", "Payment", "AI", "Communication", "Admin", "UI", "Ticketing", or "Advanced". Default: "Advanced"
- `--default=false` — Default value. Most flags default to `true` (feature on). Use `false` for opt-in features.
- `--wrap=<ComponentName>` — Optionally wrap a component with `<FeatureGate feature="flagName">`
- `--client` — Use `NEXT_PUBLIC_FEATURE_` prefix instead of `FEATURE_` (needed for direct client-side env access)

## Steps

### 1. Derive the env var name

Convert camelCase to SCREAMING_SNAKE_CASE:
- `vipLounge` → `VIP_LOUNGE`
- `loyaltyProgram` → `LOYALTY_PROGRAM`

Prefix:
- Default: `FEATURE_VIP_LOUNGE`
- With `--client`: `NEXT_PUBLIC_FEATURE_VIP_LOUNGE`

### 2. Add to `lib/config/features.ts`

Read the file and make four additions:

**a) Add to `features` object** — insert in the correct category section:
```typescript
vipLounge: envBool('FEATURE_VIP_LOUNGE', false),
```

**b) Add to `featureCategories`** — add the flag name to the appropriate category array:
```typescript
'UI': ['floorMap', 'photoGallery', 'signSelection', 'vipLounge'],
```

**c) Add to `featureLabels`**:
```typescript
vipLounge: 'VIP Lounge',
```

**d) Add to `featureDescriptions`**:
```typescript
vipLounge: 'Show VIP lounge section on the booking page',
```

**e) Add to `featureEnvVars`**:
```typescript
vipLounge: 'FEATURE_VIP_LOUNGE',
```

### 3. Add env var to `.env.example`

Find the feature flags section and insert the new var:
```
FEATURE_VIP_LOUNGE=false
```

### 4. Add env var to `.env`

Same as `.env.example`:
```
FEATURE_VIP_LOUNGE=false
```

### 5. Optionally wrap a component (if `--wrap` specified)

1. Find the component file using Glob (search for `**/ComponentName.tsx`)
2. Add import if not present:
   ```typescript
   import { FeatureGate } from '@/components/FeatureGate'
   ```
3. Wrap the component's JSX return with:
   ```tsx
   <FeatureGate feature="vipLounge">
     {/* existing JSX */}
   </FeatureGate>
   ```

### 6. Update TypeScript type

The `Features` type is `typeof features`, so it auto-updates when you add to the `features` object. No separate type change needed.

## Post-Scaffold Output

Show a summary:
```
Added feature flag: vipLounge
  Env var: FEATURE_VIP_LOUNGE (default: false)
  Category: UI
  Label: VIP Lounge

Files modified:
  - lib/config/features.ts (features, categories, labels, descriptions, envVars)
  - .env.example
  - .env
  [- components/booking/VipLoungeSection.tsx (wrapped with FeatureGate)]
```

Reminders:
- The admin UI (Settings > Features) will automatically pick up the new flag
- If this flag gates an API route, add middleware check in `middleware.ts`
- If adding a route, update `__tests__/security/auth-enforcement.test.ts`
- Consider adding to tier presets in `features.ts` if it should differ by tier (basic/pro/enterprise)
- Run `npm run build` to verify TypeScript compiles

## Example

```
/add-feature-flag vipLounge --category=UI --default=false --wrap=VipLoungeSection
```

This creates:
1. `vipLounge: envBool('FEATURE_VIP_LOUNGE', false)` in features.ts
2. Metadata in featureCategories, featureLabels, featureDescriptions, featureEnvVars
3. `FEATURE_VIP_LOUNGE=false` in .env and .env.example
4. `VipLoungeSection` wrapped with `<FeatureGate feature="vipLounge">`
