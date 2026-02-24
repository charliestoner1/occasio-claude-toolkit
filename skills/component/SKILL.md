---
name: component
description: Scaffold a React component with project conventions — dark theme, CSS variables, mobile responsiveness, proper imports
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: "<ComponentName> [--admin] [--booking] [--page]"
---

# Scaffold React Component

Create a new component: $ARGUMENTS

## Arguments

Parse `$ARGUMENTS`:
- First arg = ComponentName in PascalCase (e.g., `PromoCodeInput`)
- `--admin` → place in `components/admin/`, use admin layout patterns
- `--booking` → place in `components/booking/`, use customer-facing patterns
- `--page` → create as a page component in `app/`, includes metadata export
- No flag → place in `components/` root or infer from name

## Before Scaffolding

1. Check if a similar component already exists:
   - Search `components/` for related names
   - If something close exists, suggest extending it instead of creating a new one

2. Look at neighboring components in the target directory to match the local style and imports.

## Component Template

Generate with these project conventions:

### Imports
```typescript
'use client' // only if component uses hooks, event handlers, or browser APIs

import { useState, useEffect } from 'react' // only what's needed
// Radix UI primitives over custom implementations
// Lucide icons: import { IconName } from 'lucide-react'
```

### Styling Rules
- Use Tailwind classes exclusively — no inline styles, no CSS modules
- **Dark theme first** — this is a nightclub app. Use `bg-zinc-900`, `bg-black`, `text-white`, `text-zinc-400` as defaults
- **Primary color** → use `bg-emerald-500` (gets overridden by theme system via CSS variables)
- **Text on primary backgrounds** → use `text-[var(--color-on-primary)]`, NOT `text-white`
- **Text on accent backgrounds** → use `text-[var(--color-on-accent)]`
- **Status colors** (red/green/blue badges) → literal `text-white` is fine, these are exempt from theming
- **Borders** → `border-zinc-800` or `border-white/10`
- **Glass effect** → `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`

### Mobile Responsiveness
- Import `useIsMobile` only if behavior differs meaningfully between mobile/desktop:
  ```typescript
  import { useIsMobile } from '@/lib/hooks/use-is-mobile'
  const isMobile = useIsMobile(768)
  ```
- Touch targets: minimum 44px (`min-h-[44px] min-w-[44px]`)
- Use responsive Tailwind: `text-sm md:text-base`, `p-3 md:p-4`, `gap-2 md:gap-3`
- Stack on mobile, row on desktop: `flex flex-col md:flex-row`

### TypeScript
- Define props interface above the component
- Export as named export (not default) unless it's a page
- Use `React.FC` sparingly — prefer explicit return types or let inference work

### Structure
```typescript
interface ComponentNameProps {
  // props
}

export function ComponentName({ ...props }: ComponentNameProps) {
  // hooks first
  // derived state
  // handlers
  // render
}
```

## Admin Components (`--admin`)
- Wrap data in cards: `bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6`
- Use `text-zinc-400` for labels, `text-white` for values
- Tables: `divide-y divide-zinc-800`
- Consider the sidebar layout — content should not overflow

## Booking Components (`--booking`)
- Customer-facing = extra polish. Smooth transitions, loading states
- Glass cards for feature sections
- Emerald accent for CTAs
- Must work flawlessly on mobile (most customers book on phones)

## Page Components (`--page`)
- Export `metadata` for SEO:
  ```typescript
  export const metadata = { title: '...', description: '...' }
  ```
- Use Suspense boundaries for async data
- Include loading state

## After Scaffolding

Tell the user:
- Where the file was created
- What props it accepts
- If any new Tailwind color classes were used, whether they need CSS overrides in `globals.css`
- Suggested next steps (wire up data, add to a page, etc.)
