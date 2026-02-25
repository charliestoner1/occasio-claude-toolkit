---
name: quick-plan
description: Lightweight feature planning — research + plan + file list + gotchas without GSD scaffolding. For small-to-medium implementations.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task
argument-hint: "<feature-description> [--research] [--no-research]"
---

# Quick Plan — Lightweight Feature Planning

Plan a feature implementation without the full GSD ceremony. Produces a clear plan with tasks, files to touch, gotchas, and optionally does quick research first.

**Feature:** $ARGUMENTS

## Arguments

- First arg = what to build (free-form description)
- `--research` = do web research before planning (spawns research agents)
- `--no-research` = skip research, plan from existing knowledge only
- Default = auto-decide based on complexity (research if unfamiliar territory, skip if straightforward)

## Examples

```
/quick-plan add a drag-to-reorder feature for bottle menu items
/quick-plan real-time occupancy display on customer booking page --research
/quick-plan add email confirmation for bottle pre-orders --no-research
/quick-plan split payment UI with Venmo-style amount splitting --research
```

## Process

### Step 1: Understand the Feature

Before planning, gather context:

1. **Read CLAUDE.md** — project conventions, auth patterns, timezone rules, gotchas
2. **Read PRODUCT.md** — understand how this feature fits the product
3. **Read .claude/DESIGN.md** — UI/UX guidelines if this is a frontend feature
4. **Scan existing code** — use Glob/Grep to find related files, understand current patterns

Ask yourself:
- Where does this feature live in the existing architecture?
- What existing code can I extend vs. what needs to be new?
- Which project gotchas apply? (timezone, theme, payments, auth, mobile)
- What's the blast radius? (1 file? 3 files? 10+ files?)

### Step 2: Research (if applicable)

**When to research:**
- Using a library/API we haven't used before
- Building a UI pattern we haven't implemented
- Integrating with an external service
- User explicitly passed `--research`
- You're not confident about the best approach

**When to skip:**
- Straightforward CRUD
- Extending an existing pattern (another admin page, another API route)
- User explicitly passed `--no-research`
- You've seen this exact pattern in the codebase already

If researching, spawn 1-2 quick Task agents (subagent_type: "general-purpose"):

```
Quick research for implementing [feature]:

Use Context7 for any specific library questions.
Use WebSearch for patterns and best practices (include current year).
Use WebFetch for official docs.

Focus on:
1. Best approach for our stack (Next.js 16, React, Prisma, Tailwind, Vercel)
2. Libraries we might need (or confirmation we don't need any)
3. Known gotchas or edge cases
4. Quick code examples of the pattern

Keep it short — this feeds a plan, not a research paper.
Spend no more than 5-8 searches total.
```

### Step 3: Produce the Plan

Present the plan directly in conversation. Format:

```markdown
## Plan: [Feature Name]

### Summary
[1-2 sentences: what we're building and the approach]

### Tasks
1. **[Task name]** — [what to do]
   - File: `path/to/file.ts`
   - Details: [specific changes]

2. **[Task name]** — [what to do]
   - File: `path/to/file.ts`
   - Details: [specific changes]

3. ...

### Files to Touch
| File | Action | What Changes |
|------|--------|-------------|
| `path/to/file.ts` | Edit | [what changes] |
| `path/to/new-file.ts` | Create | [what it does] |
| `path/to/test.ts` | Edit | [add test for X] |

### Gotchas
- [ ] [Project-specific gotcha that applies — timezone, theme, auth, mobile, etc.]
- [ ] [Edge case to handle]
- [ ] [Thing that could go wrong]

### Dependencies
- [Any new npm packages needed]
- [Any Prisma schema changes needed]
- [Any environment variables needed]

### Verification
- [ ] [How to verify this works]
- [ ] [What to test]
- [ ] [Pre-flight checks that apply]

### Estimated Scope
[Small (1-3 files) | Medium (4-8 files) | Large (9+ files)]
```

### Step 4: Offer to Execute

After presenting the plan:
- "Want me to build this?"
- "Want me to adjust anything before I start?"
- "Want me to research [specific part] more before building?"

If the user says go, execute the plan directly — no need to invoke GSD. Just work through the tasks, using the plan as your guide.

## Planning Quality Rules

1. **Be specific** — Name exact files, exact functions to modify. "Update the booking API" is useless. "`app/api/bookings/route.ts:POST` — add `splitPayment` field to request body validation" is useful.

2. **Check the codebase first** — Don't plan to create a file that already exists. Don't plan to add a function that's already there. Grep before planning.

3. **Apply project gotchas** — Every plan should check: Does this need timezone handling? Theme compatibility? Auth protection? Mobile responsiveness? Payment verification? If yes, include specific tasks for each.

4. **Minimal scope** — Plan the smallest change that delivers the feature. Don't sneak in refactors, don't add "nice to haves," don't over-engineer. The user asked for X, plan X.

5. **Order tasks by dependency** — If task 3 depends on task 1, say so. If tasks are independent, note they can be done in parallel.

6. **Include verification** — Every plan ends with how to verify it works. At minimum: does it build? Does it not break existing tests? For payment/auth changes: run security tests.

## Project-Specific Gotcha Checklist

Apply these when relevant to the feature:

### Timezone (if touching dates/times)
- [ ] Using correct query pattern? (Pattern 1 for calendar dates, Pattern 2 for timestamps)
- [ ] Using `toZonedTime` for display, `fromZonedTime` for real-timestamp queries?
- [ ] Duration checks using real `new Date()`, not `venueNow`?

### Theme (if touching UI)
- [ ] Using CSS variables not hardcoded colors?
- [ ] `--color-on-primary` for text on primary backgrounds?
- [ ] New Tailwind classes have CSS overrides in globals.css?

### Auth (if adding API routes)
- [ ] `requireAdmin()` / `requireStaff()` at top of handler?
- [ ] Route added to `__tests__/security/auth-enforcement.test.ts`?

### Payments (if touching money)
- [ ] Server-side total verification?
- [ ] All three payment modes handled?
- [ ] Processing fee = 3.3% + $0.30?

### Mobile (if touching UI)
- [ ] 44px min touch targets?
- [ ] Responsive layout (test at 375px width)?
- [ ] Bottom nav not overlapping content?

### Prisma (if touching database)
- [ ] Financial fields in `select` clauses?
- [ ] `take` limit on unbounded queries?
- [ ] Migration needed? → mention `npx prisma migrate dev --name X`

## When This Skill Is Suggested

Suggest `/quick-plan` when:
- User describes a feature that touches 3+ files
- User says "I want to add..." or "let's build..."
- The feature involves unfamiliar territory
- Money, auth, or database changes are involved

Don't suggest when:
- User says "just" or "quick" and gives specific instructions
- It's a single-file change
- User is clearly in a hurry and knows what they want
