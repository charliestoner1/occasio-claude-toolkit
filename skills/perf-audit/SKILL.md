---
name: perf-audit
description: Next.js performance audit — client vs server components, bundle size, images, re-renders, Suspense, caching
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(npx *), Bash(npm run build), Bash(du *)
argument-hint: "[page-or-component]"
---

# Next.js Performance Audit

Audit the application (or a specific page/component) for performance issues.

If `$ARGUMENTS` specifies a page or component, focus there. Otherwise, audit the full application.

## Step 1: Build Analysis

Run the production build and capture output:
```bash
npm run build
```

From the build output, extract:
- **Route sizes** — flag any route over 200KB first-load JS
- **Static vs dynamic** — identify routes that could be static but aren't
- **Build warnings** — any Next.js performance warnings

## Step 2: Client Component Audit

### Unnecessary `'use client'`
Search for files with `'use client'` that don't actually need it. A component needs `'use client'` ONLY if it:
- Uses React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Has event handlers (`onClick`, `onChange`, etc.)
- Uses browser-only APIs (`window`, `document`, `localStorage`)
- Uses React context (`useContext`)

Files with `'use client'` that only render JSX with props should be server components.

### Large Client Components
Find client components that are unusually large (>300 lines). These often benefit from:
- Extracting static/presentational parts as server components
- Splitting into smaller client components
- Moving data fetching to server components

### Client Component Tree
Check if server components are unnecessarily wrapped by client component boundaries. Look for patterns where a small interactive element forces an entire page to be client-rendered.

## Step 3: Image Optimization

### Missing `next/image`
Search for `<img` tags that should use `next/image` for automatic optimization.
```
Pattern: <img in .tsx files (excluding node_modules, public/)
```

### Image Props
For existing `next/image` usage, check:
- `priority` on above-the-fold images (LCP candidates)
- `sizes` prop set appropriately (not just default)
- `quality` prop — should be set per-component, not in next.config
- `placeholder="blur"` for large images to reduce CLS

### Unoptimized Assets
Check `public/` for:
- Large images (>500KB) that should be compressed
- Images that could be WebP/AVIF instead of PNG/JPG
- SVGs that could be inlined as React components

```bash
du -sh public/**/*.{png,jpg,jpeg,gif,webp} 2>/dev/null | sort -rh | head -20
```

## Step 4: Data Fetching Patterns

### Missing Suspense Boundaries
Pages that fetch data should use `<Suspense>` with fallback for progressive loading. Search for:
- `async` page components without Suspense
- `await` calls in page components that block the entire page

### Redundant Client-Side Fetching
Look for React Query or `useEffect` + `fetch` patterns that could be replaced with server-side data fetching:
- Data that doesn't change during the session
- Data needed for initial render (causes waterfall if fetched client-side)

### Missing Caching
Check API routes for:
- Database queries that could benefit from Next.js cache (`unstable_cache` or `revalidate`)
- Expensive computations without memoization
- Repeated identical Prisma queries across routes

## Step 5: Bundle Optimization

### Heavy Dependencies
Check for large libraries that might have lighter alternatives or should be dynamically imported:
```bash
# Check bundle composition if @next/bundle-analyzer is available
npx next build --experimental-build-mode compile 2>/dev/null
```

Look for:
- Libraries imported but only partially used (tree-shaking opportunities)
- Heavy components that should use `dynamic()` import
- `date-fns` — are we importing from the root or specific subpaths?

### Dynamic Imports
Check that heavy components are dynamically imported:
- Calendar components (`react-big-calendar`)
- Image cropping (`react-easy-crop`)
- Charts/graphs
- Map editors
- AI chat widgets (only load when opened)

Search for large component imports that aren't wrapped in `dynamic()`:
```
Pattern: import.*from.*(big-calendar|easy-crop|chart|editor|map)
```

## Step 6: Rendering Performance

### Unnecessary Re-renders
Look for:
- Objects/arrays created inline in JSX props (cause child re-renders)
- Missing `useMemo`/`useCallback` for expensive computations passed as props
- State updates in parent components that re-render large child trees

### List Virtualization
Check for long lists rendered without virtualization:
- Booking lists in admin dashboard
- Table lists
- Notification lists
- Any `.map()` that could render 50+ items

## Step 7: CSS Performance

### Unused Tailwind Classes
Not critical but worth noting:
- Are there Tailwind classes in the safelist that are no longer used?
- Is `globals.css` growing too large with theme overrides?

### Animation Performance
Check for:
- CSS animations not using `transform`/`opacity` (cause layout thrashing)
- `will-change` used excessively
- Animations running on off-screen elements

## Report Format

```
## Performance Audit Results

### Build Analysis
- Total first-load JS: Xkb
- Largest routes: [list]
- Static routes: N | Dynamic routes: N

### Critical Issues (fix these)
1. [file:line] Description → Impact → Fix

### Optimization Opportunities (nice to have)
1. [file:line] Description → Estimated impact → Approach

### Already Good
- [list of things done well]

### Metrics Summary
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Largest route JS | Xkb | <200kb | OK/OVER |
| Client components | N | minimize | OK/HIGH |
| Unoptimized images | N | 0 | OK/FIX |
| Missing Suspense | N | 0 | OK/FIX |
```
