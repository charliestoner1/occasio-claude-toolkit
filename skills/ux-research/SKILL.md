---
name: ux-research
description: Deep web research for UI/UX implementation — crawls competitors, design galleries, UX articles, and SaaS products to find what works best for users. Use before implementing new UI features.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Glob, Grep, Bash, Task
argument-hint: "<topic> [--competitors] [--patterns] [--deep] [--hospitality]"
---

# UX Research — Deep Web Crawl for UI Implementation

Research how the best products solve a specific UI/UX problem before building it yourself. Crawls competitor sites, design galleries, UX articles, case studies, and SaaS products to synthesize actionable patterns.

**Topic:** $ARGUMENTS

## Arguments

- First arg = what to research (e.g., "table selection flow", "bottle service checkout", "mobile booking calendar")
- `--competitors` = focus on direct competitor analysis (SevenRooms, Resy, Tock, Discotech, Tablelist, OpenTable, etc.)
- `--patterns` = focus on general UX patterns across industries (not just hospitality)
- `--deep` = extended research — more sources, more detail, longer output
- `--hospitality` = restrict to nightclub/lounge/restaurant/hotel industry
- Default = balanced research across competitors + patterns + articles

## Research Strategy

### Step 1: Parse the Topic

Break down the research topic into:
1. **Core interaction** — what is the user doing? (selecting, browsing, filtering, purchasing, etc.)
2. **Domain context** — nightclub/lounge VIP booking (our domain) + adjacent domains that solve similar problems
3. **Device context** — mobile-first (our primary), desktop secondary
4. **Scope flags** — which research lanes to prioritize based on arguments

### Step 2: Launch Parallel Research Agents

Spawn 3-4 Task agents in parallel (subagent_type: "general-purpose"). Each agent uses WebSearch and WebFetch to investigate a different angle.

#### Agent 1: Direct Competitor Analysis
```
Research how direct competitors handle [topic]:

**Competitors to investigate:**
- SevenRooms (restaurant/nightclub reservation platform)
- Resy (restaurant reservations, owned by American Express)
- Tock (restaurant reservations, ticketed experiences)
- Discotech (nightclub/lounge reservations, bottle service)
- Tablelist (nightclub table booking)
- OpenTable (restaurant reservations)
- Yelp Guest Manager / Yelp Reservations
- Toast Tables (restaurant POS + reservations)
- Tripleseat (event/venue management)

**For each competitor, find:**
1. How they present [topic] to users
2. Key UI patterns and interaction flows
3. What information they show vs hide
4. Mobile vs desktop differences
5. Unique features or innovations
6. Screenshots or detailed descriptions of their UI

**Search queries to use:**
- "[competitor] [topic] UI"
- "[competitor] booking flow"
- "[competitor] user experience review"
- "[competitor] app screenshots"
- "site:[competitor-domain] [topic-keywords]"

**Output:** Competitor comparison matrix with strengths/weaknesses for each approach.
```

#### Agent 2: Design Pattern Research
```
Research best UX patterns for [topic] across ALL industries (not just hospitality):

**Sources to search:**
- Mobbin.com — real app screenshots organized by pattern
- Dribbble — design concepts and case studies
- Behance — detailed UX case studies
- Nielsen Norman Group (nngroup.com) — UX research articles
- Baymard Institute — e-commerce UX research
- UX Planet, Smashing Magazine, UX Collective — articles
- Laws of UX (lawsofux.com) — applicable principles

**Search queries:**
- "[topic] UX best practices 2025 2026"
- "[topic] mobile UI patterns"
- "[topic] user research findings"
- "[topic] conversion optimization"
- "[topic] A/B test results"
- "best [topic] design examples"
- "[interaction-type] UX patterns mobile"

**For each pattern found:**
1. What problem it solves
2. How it works (step by step)
3. Why it works (psychology/UX principle)
4. Where you've seen it used successfully
5. Potential downsides or edge cases

**Output:** Ranked list of patterns with evidence for each.
```

#### Agent 3: Luxury & Premium UX Research
```
Research how luxury/premium digital products handle [topic]:

**Premium brands and apps to investigate:**
- Luxury hotel booking (Four Seasons, Aman, Nobu)
- Premium event platforms (Fever, Dice, Resident Advisor)
- High-end e-commerce (Net-a-Porter, SSENSE, Farfetch)
- Premium subscription services (Soho House, NeueHouse)
- Luxury travel (Blacklane, Blade, NetJets booking)
- Premium food delivery (Caviar when it existed, Uber Reserve)

**Why luxury matters for us:**
Nightclub VIP table booking is a premium/luxury purchase ($500-$5000+). The UX should feel exclusive, not transactional. Research how premium brands:
1. Create urgency without feeling desperate
2. Present pricing (transparent vs hidden vs progressive disclosure)
3. Handle scarcity signals (subtle vs aggressive)
4. Use motion and animation to convey quality
5. Handle the checkout/payment experience
6. Mobile-first premium experiences

**Search queries:**
- "luxury [topic] UX"
- "premium booking experience design"
- "high-end mobile app [topic]"
- "luxury e-commerce [topic] patterns"
- "exclusive membership booking UX"

**Output:** Premium UX principles applicable to our nightclub context.
```

#### Agent 4: Technical Implementation Research (if --deep)
```
Research technical implementation approaches for [topic]:

**Focus areas:**
- React/Next.js component libraries that solve this well
- Animation patterns that enhance this interaction
- Performance considerations for mobile
- Accessibility requirements for this type of UI
- State management patterns

**Sources:**
- GitHub trending repos
- npm packages for this type of component
- React/Next.js community patterns
- Vercel/Next.js examples and templates
- shadcn/ui components that apply

**Search queries:**
- "react [topic] component library 2025 2026"
- "nextjs [topic] implementation"
- "framer motion [topic] animation"
- "[topic] react accessible component"
- "best react [topic] npm package"

**Output:** Technical recommendations with links to specific libraries and examples.
```

### Step 3: Synthesize Findings

After all agents return, synthesize into a single research document with these sections:

```markdown
# UX Research: [Topic]

> Researched [date]. [N] sources consulted across [N] competitors, [N] design galleries, [N] UX articles.

## TL;DR — What Works Best
[3-5 bullet points with the strongest findings. Opinionated. "Do X, not Y."]

## Competitor Landscape
[Matrix comparing how each competitor handles this]
| Feature | SevenRooms | Resy | Tock | Discotech | ... |
|---------|------------|------|------|-----------|-----|
| [aspect] | ... | ... | ... | ... | ... |

### Standout Approaches
[Which competitor does this best and why? Describe their specific UI in detail.]

### Anti-Patterns to Avoid
[What are competitors doing badly? What frustrates users?]

## Best Patterns (Ranked)
### 1. [Pattern Name]
- **What:** [Description]
- **Why it works:** [UX principle / evidence]
- **Used by:** [Examples]
- **Applies to us because:** [Context]

### 2. [Pattern Name]
...

## Premium/Luxury Principles
[How luxury brands approach this — applicable to our nightclub context]

## Recommendations for Cantina Booking
[Specific, opinionated recommendations for OUR implementation]
1. **Do:** [specific recommendation with reasoning]
2. **Do:** ...
3. **Don't:** [anti-pattern with reasoning]
4. **Don't:** ...

## Implementation Notes
[If --deep: specific libraries, components, animation ideas]

## Sources
[Links to the most valuable sources found]
```

### Step 4: Write Output

Write the research document to: `.planning/research/ux-[topic-slug].md`

Present a summary to the user and offer next steps:
- "Want me to implement the top recommendation?"
- "Want me to create a mockup based on finding #X?"
- "Want me to dig deeper into [specific competitor]?"

## Research Quality Rules

1. **Be opinionated** — "Use X" not "Consider X or Y." The user wants a recommendation, not a menu.
2. **Evidence over opinion** — Link to real products doing it well. Describe actual UIs, not theoretical patterns.
3. **Mobile first** — Our users are on their phones at 11 PM deciding which club to go to. Every pattern must work on mobile.
4. **Premium context** — This is a luxury purchase. The UX should feel like booking a suite at a luxury hotel, not ordering from a fast food menu.
5. **Actionable output** — Every finding should map to something we can actually build. No academic theory without practical application.
6. **Freshness matters** — Prefer 2024-2026 sources. UX patterns from 2020 may be outdated.
7. **Screenshots > descriptions** — When agents find real UI screenshots or detailed walkthroughs, prioritize those over vague descriptions.

## When to Use This Skill

- Before building any new customer-facing UI feature
- Before redesigning an existing flow
- When the user says "how should we handle [UI problem]?"
- When comparing approaches to a UX challenge
- Before any `/frontend-design` or `/animate` work that involves new interaction patterns

## Integration with Other Skills

After research, the user will typically:
- `/frontend-design` — to implement the recommended pattern
- `/animate` — to add motion that matches premium UX findings
- `/ui-ux-pro-max` — for style/palette/typography decisions
- `/a11y-audit` — to verify accessibility of the chosen pattern
