---
name: security-audit
description: Audit codebase for security vulnerabilities — hardcoded secrets, auth gaps, payment risks, XSS, injection, insecure defaults
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(npm audit *), Bash(git diff *), Bash(git ls-files *)
argument-hint: "[scope: auth|payments|env|full]"
---

# Security Audit

Scan Cantina Booking for security vulnerabilities. Focuses on real, exploitable issues — not theoretical concerns or test fixtures.

**Scope:** $ARGUMENTS (default: full)

## Core Principle

Find **fail-open** vulnerabilities: code that runs insecurely when config is missing, vs **fail-secure** code that crashes safely. Only flag real issues.

## Audit Phases

### Phase 1: Secrets & Environment Variables

Search for hardcoded secrets and insecure fallbacks:

**Patterns to grep:**
- `process.env.* \|\| ['"]` — fallback secrets (fail-open)
- `password.*=.*['"]` or `secret.*=.*['"]` — hardcoded credentials
- `api[_-]?key.*=.*['"]` — hardcoded API keys
- `.env` files committed to git — `git ls-files | grep -i env`

**Project-specific checks:**
- `CRON_SECRET` usage — verify all cron routes check it
- `VAPID_PRIVATE_KEY` — should never appear in client code
- LINQ API keys — only in server-side code
- JWT secret — no fallback defaults
- Resend/Twilio keys — server-side only

**Skip:** Test fixtures, `.env.example`, documentation examples.

### Phase 2: Authentication & Authorization

**API route protection:**
- Every route in `app/api/admin/` must call auth verification
- Every route in `app/api/staff/` must verify JWT or `x-staff-id`
- Check `middleware.ts` for route protection coverage
- Look for routes that bypass auth checks

**Specific checks:**
- Verify `lib/auth.ts` and `lib/auth-helpers.ts` enforce auth consistently
- Check if any admin route accepts requests without JWT validation
- Check if webhook endpoints (`app/api/linq/webhooks/`) properly verify signatures
- Verify LINQ webhook signature validation is not bypassed

**Cross-reference with security test suite:**
- Read `__tests__/security/auth-enforcement.test.ts`
- Flag any API routes NOT covered by the test suite

### Phase 3: Payment Security

**Critical — money is involved:**

- **Server-side price verification:** Never trust client-sent prices
  - Check `app/api/bookings/route.ts` — does it recalculate totals?
  - Check `app/api/linq/create-payment-intent/route.ts` — does it verify amounts?
  - Check promo code validation — server-side discount verification?

- **Payment amount tampering:**
  - Can a client send a modified `depositAmountPaid`?
  - Can add-on prices (LED signs, extra guests) be tampered with?
  - Is `processingFee` calculated server-side?

- **Three payment modes:** deposit (15%), full, split
  - Verify all three are handled in payment creation
  - Verify deposit percentage is enforced server-side (not client-configured)

### Phase 4: Input Validation & Injection

**SQL/Prisma injection:**
- Prisma parameterizes queries by default, but check for raw queries (`$queryRaw`, `$executeRaw`)
- If any raw queries exist, verify parameters are properly escaped

**XSS:**
- Search for `dangerouslySetInnerHTML` — verify content is sanitized
- Check if user-generated content (booking names, promo codes, event descriptions) is escaped before rendering
- Check AI-generated content rendering (BookingAssistant, BarManagerAssistant)

**SSRF / External calls:**
- Check any user-controllable URLs passed to fetch/axios
- Verify webhook URLs are not user-configurable

### Phase 5: Insecure Defaults

**Check for fail-open patterns:**
- `DEBUG.*=.*true` in production-reachable code
- `AUTH.*=.*false` or auth bypass flags
- `CORS.*\*` — permissive CORS
- Missing rate limiting on sensitive endpoints (login, payment, booking creation)
- Verbose error messages that leak stack traces or DB structure

**Skip if:**
- Default is fail-secure (app crashes without config)
- Only applies in explicitly dev/test environments
- Test files, example configs, documentation

## Report Format

```
# Security Audit Report

## Summary
- **Scope:** [auth|payments|env|full]
- **Critical:** X issues
- **High:** X issues
- **Medium:** X issues
- **Low:** X issues

## Critical Issues (must fix before deploy)
### [Issue Title]
- **Location:** file:line
- **Pattern:** What was found
- **Exploit:** How an attacker could use this
- **Fix:** Specific code change

## High Issues (fix soon)
...

## Medium Issues (should fix)
...

## Low Issues (nice to fix)
...

## Passed Checks
- [List of things that look correct]
```

### Phase 6: Data Exposure

**API response leaks:**
- Routes without `select` clauses return ALL fields — sensitive data may leak
- Admin-only fields in customer-facing responses
- Stack traces or DB structure in error responses
- Internal IDs or debug info in production responses

**Prisma select audit:**
- `findMany()` without `select` on models with sensitive fields
- Customer-facing routes returning staff/admin data

### Phase 7: Rate Limiting & Abuse

**Missing rate limiting on:**
- Login/auth endpoints (brute force risk)
- Payment endpoints (card testing risk)
- SMS endpoints (toll fraud — Twilio charges per message)
- Booking creation (spam bookings)
- Push subscription (subscription bombing)

### Phase 8: CSRF & Cookie Security

- State-changing operations (POST/PUT/DELETE) protected against CSRF?
- Cookies set with `SameSite`, `HttpOnly`, `Secure` flags?
- Session tokens properly scoped?

## Rationalizations to Reject

- "It's behind auth" → Defense in depth; compromised sessions still exploit weak defaults
- "Production config overrides it" → Verify prod config exists; code-level vulnerability remains
- "We'll fix before release" → Document now; "later" rarely comes
- "It's just a dev default" → If it reaches production code paths, it's a finding
