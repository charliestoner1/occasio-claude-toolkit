---
name: white-label-audit
description: Scan for hardcoded venue-specific values that break when onboarding a new venue — names, logos, branding, timezone strings, company references
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(git diff *)
context: fork
agent: Explore
argument-hint: "[file-or-directory]"
---

# White-Label Audit

Scan for hardcoded venue-specific values that would break when deploying for a new venue. This is a white-label SaaS — everything venue-specific should come from environment variables or database settings.

If `$ARGUMENTS` is provided, audit that specific file or directory. Otherwise, audit the full `app/` and `lib/` directories.

## What Should Be Configurable

All venue identity comes from `lib/config/venue.ts` which reads environment variables:
- `NEXT_PUBLIC_VENUE_NAME`, `NEXT_PUBLIC_VENUE_SLUG`, `NEXT_PUBLIC_VENUE_TAGLINE`
- `NEXT_PUBLIC_VENUE_LOGO`, `NEXT_PUBLIC_VENUE_FAVICON`
- `NEXT_PUBLIC_VENUE_TIMEZONE`, `NEXT_PUBLIC_VENUE_CURRENCY`
- `NEXT_PUBLIC_VENUE_ADDRESS`, `NEXT_PUBLIC_VENUE_CITY`, etc.
- Social links, email config, AI assistant name, CTA text

Feature flags in `lib/config/features.ts`. Theme colors in `lib/config/theme.ts`.

## Audit Checks

### Check 1: Hardcoded Venue Names (CRITICAL)
Search for literal venue names that should use `venue.name` or `venue.slug`:
```
Patterns: "Cantina", "cantina", "Occasio", "occasio"
Exclude: node_modules, .git, prisma/migrations, *.md, *.json (config), seed scripts, .env*
```

**False positives to ignore:**
- Seed scripts (`prisma/seed.ts`, `scripts/seed-*.ts`) — test data is fine
- Documentation files (`.md`)
- Migration files (`prisma/migrations/`)
- Config defaults in `lib/config/venue.ts` (that's where defaults live)

**Real issues:**
- Component files, API routes, layout files referencing venue names directly
- Email templates with hardcoded sender names
- Meta tags with hardcoded titles

### Check 2: Hardcoded Company/Legal Names (HIGH)
Search for legal entity names that should be configurable:
```
Patterns: "Occasio LLC", "Occasio VIP", company names in footers/legal text
```

These need environment variables like `NEXT_PUBLIC_COMPANY_NAME`.

### Check 3: Hardcoded Logo/Image Paths (HIGH)
Search for hardcoded paths to venue-specific assets:
```
Patterns: "/branding/cantina", "/logo.png" (literal, not from config)
Exclude: References to venue.logo or NEXT_PUBLIC_VENUE_LOGO
```

Should use `venue.logo` from config.

### Check 4: Hardcoded Contact Info (MEDIUM)
Search for hardcoded phone numbers, email addresses, physical addresses:
```
Patterns: literal phone numbers, literal @domain.com emails, street addresses
Exclude: .env files, config files, seed data
```

Should come from `venue.phone`, `venue.email`, `venue.address`.

### Check 5: Hardcoded Social Links (MEDIUM)
Search for hardcoded Instagram/Facebook/Twitter URLs:
```
Patterns: "instagram.com/", "facebook.com/", "twitter.com/", "tiktok.com/"
Exclude: config files
```

Should use `venue.social.instagram`, etc.

### Check 6: Hardcoded Theme Colors (MEDIUM)
Colors that assume a specific venue's brand:
```
Patterns: specific hex values in components (not in theme.ts or globals.css)
```

Should use CSS variables from the theme system.

### Check 7: Hardcoded Default Theme (LOW)
Check if the default theme fallback is venue-specific:
```
Pattern: return 'miami' or similar hardcoded theme name as default
```

Should use a neutral default or read from venue config.

### Check 8: Email Templates (HIGH)
Check email templates in `lib/emails/` for:
- Hardcoded venue names in subject lines or body
- Hardcoded logos or brand colors
- Hardcoded reply-to addresses
- Hardcoded footer text

All should use venue config or notification settings.

## Severity Levels

- **CRITICAL** — Customer-visible venue name/branding leak (wrong name shows for new venue)
- **HIGH** — Functional issue (wrong contact info, broken logos, wrong legal entity)
- **MEDIUM** — Visual/branding inconsistency
- **LOW** — Internal/dev-only reference

## Report Format

```
## White-Label Audit Results

### Critical Issues (visible to customers)
- [file:line] "Hardcoded text" → Should use venue.X or env var

### High Issues (functional)
- [file:line] Description → Fix

### Medium Issues (branding)
- [file:line] Description → Fix

### Already Configurable
- [list of things done well]

### Venue Onboarding Checklist
Based on findings, list what a new venue would need to configure:
1. Required env vars
2. Required assets (logo, favicon, OG image)
3. Required database settings
4. Optional customizations
```
