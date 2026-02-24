---
name: dep-audit
description: Audit dependencies — outdated packages, security vulnerabilities, unused deps, bundle impact, missing peer deps
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(npm *), Bash(npx *), Bash(du *)
argument-hint: "[--security-only] [--outdated-only]"
---

# Dependency Audit

Comprehensive audit of project dependencies for security, freshness, bundle impact, and cleanup opportunities.

## Arguments

- No args: full audit (all checks)
- `--security-only`: only run security vulnerability check
- `--outdated-only`: only check for outdated packages

## Checks

### 1. Security Vulnerabilities (CRITICAL)

```bash
npm audit
```

For each vulnerability found:
- **Severity**: critical / high / moderate / low
- **Package**: which dependency
- **Path**: direct or transitive dependency
- **Fix available?**: `npm audit fix` or manual upgrade needed
- **Breaking change?**: Would the fix require code changes?

If `npm audit fix` can resolve issues without breaking changes, suggest running it.

### 2. Outdated Packages (HIGH)

```bash
npm outdated
```

Categorize results:
- **Major updates** (breaking changes likely) — list what changed, check changelog
- **Minor updates** (new features, should be safe) — can usually upgrade
- **Patch updates** (bug fixes) — should upgrade

Priority packages to keep current:
- `next` — framework, performance + security fixes
- `prisma` / `@prisma/client` — database layer
- `react` / `react-dom` — core UI
- `tailwindcss` — styling
- Authentication packages (`next-auth`, etc.)
- Payment packages (LINQ SDK if applicable)

### 3. Unused Dependencies (MEDIUM)

Search for packages in `package.json` that may not be imported anywhere:

For each dependency in `dependencies` and `devDependencies`:
1. Search for imports: `from '[package-name]'` or `require('[package-name]')`
2. Check if used in config files (`next.config.*`, `tailwind.config.*`, `vitest.config.*`, `postcss.config.*`)
3. Check if it's a CLI tool used in scripts (check `package.json` scripts)
4. Check if it's a peer dependency required by another package
5. Check if it's a type package (`@types/*`) for a used package

**Common false positives:**
- `autoprefixer` — used by PostCSS config
- `@types/*` — used by TypeScript, not imported directly
- `sharp` — used by Next.js image optimization (not imported, but required)
- `encoding` — peer dep for some packages
- Tailwind plugins — referenced in config, not imported

### 4. Bundle Impact (MEDIUM)

Check for heavy dependencies that might have lighter alternatives:

| Package | Size | Alternative |
|---------|------|-------------|
| `moment` | 300KB+ | `date-fns` (tree-shakeable) |
| `lodash` | 70KB+ | Native JS or `lodash-es` |
| `axios` | 30KB+ | `fetch` (built-in) |

For this project specifically, check:
- Is `date-fns` imported from root or specific paths? (tree-shaking)
- Is `lucide-react` tree-shaking correctly? (should import individual icons)
- Are large components dynamically imported? (`react-big-calendar`, `react-easy-crop`)

### 5. Duplicate Dependencies (LOW)

```bash
npm ls --all 2>/dev/null | grep -i "deduped" | wc -l
```

Check for multiple versions of the same package in the tree that could be deduped.

### 6. Missing Peer Dependencies (LOW)

```bash
npm ls 2>&1 | grep "peer dep"
```

Missing peer deps can cause subtle runtime errors.

### 7. License Check (LOW)

Scan for dependencies with restrictive licenses:
- **GPL** — copyleft, may require your code to be GPL too
- **AGPL** — even stricter copyleft for server-side use
- **Unknown/No license** — legal risk

```bash
npx license-checker --summary 2>/dev/null || echo "license-checker not installed"
```

## Report Format

```
## Dependency Audit Results

### Security
- Critical: N | High: N | Moderate: N | Low: N
- Auto-fixable: N
- Details: [list]

### Outdated
- Major updates available: N
- Minor updates available: N
- Patch updates available: N
- Priority updates: [list with changelogs]

### Unused (candidates for removal)
- [package] — not imported anywhere, saves Xkb
- [package] — only used in removed feature

### Bundle Impact
- Largest dependencies: [top 5]
- Optimization opportunities: [list]

### Issues
- Duplicates: N packages with multiple versions
- Missing peer deps: [list]
- License concerns: [list]

### Recommended Actions (priority order)
1. [action] — [reason] — [command]
```
