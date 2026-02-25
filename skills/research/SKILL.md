---
name: research
description: Deep web research on any topic — libraries, patterns, services, competitors, APIs, or implementation approaches. Like gsd:research-phase but without the GSD scaffolding.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Glob, Grep, Bash, Task
argument-hint: "<topic> [--libs] [--compare A vs B] [--deep]"
---

# Research — Ad-Hoc Deep Web Research

Research any topic using WebSearch, WebFetch, and Context7 — without needing a GSD roadmap, phase, or planning structure. Get opinionated findings you can act on immediately.

**Topic:** $ARGUMENTS

## Arguments

- First arg = what to research (free-form topic or question)
- `--libs` = focus on library/package ecosystem (which to use, versions, tradeoffs)
- `--compare A vs B` = head-to-head comparison of specific options
- `--deep` = extended research, more sources, longer output
- `--save` = write findings to `.planning/research/[topic].md` (default: just present in conversation)
- Default = balanced research, presented inline

## Examples

```
/research how to implement real-time collaborative editing
/research stripe vs square for in-person payments --compare
/research best React animation libraries 2026 --libs
/research how nightclub POS systems handle split payments --deep --save
/research next.js 16 app router caching changes --libs
```

## Process

### Step 1: Classify the Research Type

| Type | Detected When | Agent Strategy |
|------|--------------|----------------|
| **Library/Stack** | `--libs`, mentions packages/frameworks | Context7 first, then WebSearch for ecosystem |
| **Comparison** | `--compare`, "X vs Y", "which is better" | Parallel agents per option, then synthesis |
| **How-To** | "how to", "best way to", "implementation" | WebSearch + WebFetch official docs + Context7 |
| **Ecosystem** | broad topic, industry question | WebSearch heavy, multiple query angles |
| **Specific Question** | narrow, factual question | Targeted search, quick answer |

### Step 2: Launch Research Agents

Spawn 1-3 Task agents (subagent_type: "general-purpose") depending on complexity.

#### For Library/Stack Research (1-2 agents)

**Agent 1: Ecosystem Discovery**
```
Research the current ecosystem for [topic]:

Use these tools in priority order:
1. Context7 (mcp__context7__resolve-library-id + mcp__context7__query-docs) — for any specific library
2. WebFetch — for official docs, READMEs, changelogs
3. WebSearch — for ecosystem discovery, community patterns

Search queries (always include current year):
- "[topic] best libraries 2025 2026"
- "[topic] recommended stack"
- "[topic] npm packages comparison"
- "[topic] production ready"
- "site:github.com [topic] stars:>1000"

For each library/tool found:
1. Name, version, weekly downloads, last publish date
2. What it does (one line)
3. Why people use it (strengths)
4. Why people avoid it (weaknesses)
5. Bundle size impact
6. Active maintenance? (last commit, open issues)

Output: Ranked recommendation with clear winner and reasoning.
```

**Agent 2: Implementation Patterns (if --deep)**
```
Research implementation patterns and gotchas for [topic]:

Search for:
- "[topic] common mistakes"
- "[topic] best practices"
- "[topic] production gotchas"
- "[topic] performance tips"

For each pattern:
1. What the pattern is
2. Code example (if available)
3. Why it matters
4. What goes wrong without it

Output: Prioritized list of patterns with code examples.
```

#### For Comparison Research (2-3 agents)

One agent per option being compared, plus a synthesis pass:

**Agent per option:**
```
Deep dive on [Option X] for [use case]:

Research:
1. Core features and capabilities
2. Pricing model (if applicable)
3. Developer experience / API quality
4. Performance characteristics
5. Community size and ecosystem
6. Known limitations and dealbreakers
7. Real-world usage examples (who uses it, at what scale)

Use Context7 for library docs. WebSearch for reviews, comparisons, case studies.
Include current year in searches.

Output: Honest assessment — strengths, weaknesses, ideal use case, dealbreakers.
```

#### For How-To / Ecosystem Research (2-3 agents)

**Agent 1: Current State of the Art**
```
Research the current best practices for [topic]:

Search queries:
- "[topic] best practices 2025 2026"
- "[topic] modern approach"
- "[topic] recommended architecture"
- "how [company/product] handles [topic]"

Sources to check:
- Official documentation for relevant frameworks
- Engineering blogs from companies that solved this
- Conference talks and technical articles
- Stack Overflow trending answers (recent)

Output: What the current consensus is, with sources.
```

**Agent 2: Real-World Examples**
```
Research how real products handle [topic]:

Search for:
- "[topic] case study"
- "[topic] engineering blog"
- "how [specific company] built [topic]"
- "[topic] architecture diagram"
- "[topic] lessons learned"

Find 3-5 concrete examples of real products/companies that solved this problem.
For each: what they did, why, what they learned, would they do it again?

Output: Real-world examples with key takeaways.
```

### Step 3: Synthesize & Present

Combine agent findings into a clear, opinionated answer.

**For inline presentation (default):**

```markdown
## Research: [Topic]

### TL;DR
[2-3 sentences. Opinionated. "Use X because Y. Avoid Z because W."]

### Recommendation
[The clear winner / best approach, with reasoning]

### Key Findings
1. [Finding with source]
2. [Finding with source]
3. [Finding with source]

### Comparison (if applicable)
| Aspect | Option A | Option B |
|--------|----------|----------|
| ... | ... | ... |
| **Verdict** | ... | ... |

### Gotchas
- [Thing that will bite you if you don't know about it]

### Sources
- [Most valuable links]
```

**For saved output (--save):**

Write to `.planning/research/[topic-slug].md` with full detail including code examples, all sources, confidence levels, and open questions.

### Step 4: Offer Next Steps

After presenting findings:
- "Want me to implement this?"
- "Want me to dig deeper into [specific area]?"
- "Want me to compare [option A] vs [option B] more closely?"

## Research Quality Rules

1. **Opinionated over exhaustive** — "Use X" not "Here are 12 options." The user wants a recommendation.
2. **Current over comprehensive** — 2025-2026 sources beat thorough 2022 coverage. Include year in all searches.
3. **Context7 first** — For any specific library question, resolve the library ID and query docs before web searching.
4. **Verify claims** — WebSearch findings need cross-referencing. Don't present a single blog post as fact.
5. **Honest uncertainty** — "I couldn't verify this" is more useful than confident bullshit.
6. **Cantina context** — Remember we're Next.js 16, React, Prisma, Tailwind, Vercel. Weight recommendations toward our stack.
7. **Actionable** — Every finding should connect to something we can actually do. Skip academic theory.

## When This Skill is Invoked Automatically

This skill should be suggested (not auto-invoked) when:
- User asks "what's the best way to..."
- User asks "which library should I use for..."
- User is about to implement something complex and hasn't researched it
- User mentions a technology I'm not confident is current

## Relationship to GSD

This is the **lightweight alternative** to `/gsd:research-phase`:
- No roadmap required
- No phase structure needed
- No CONTEXT.md or STATE.md
- Output is conversational (or optionally saved to `.planning/research/`)
- Same research quality — Context7 + WebSearch + WebFetch + verification
- Same opinionated output style
