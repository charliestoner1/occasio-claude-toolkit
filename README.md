# Occasio Claude Code Toolkit

Custom skills, automation hooks, AI agents, and MCP server configs that supercharge Claude Code for frontend development. Built for building landing pages, marketing sites, and web apps.

---

## Table of Contents

1. [Setup](#setup)
2. [Quick Start — Build a Landing Page](#quick-start--build-a-landing-page)
3. [Skills — What They Are & How to Use Them](#skills--what-they-are--how-to-use-them)
4. [Skill Reference — When to Use What](#skill-reference--when-to-use-what)
5. [MCP Servers — External Superpowers](#mcp-servers--external-superpowers)
6. [GSD — Project Management for Complex Builds](#gsd--project-management-for-complex-builds)
7. [Automation Hooks](#automation-hooks)
8. [Templates](#templates)
9. [Tips for Best Results](#tips-for-best-results)

---

## Setup

### Prerequisites
- **VS Code** with the **Claude Code extension** installed
- **Node.js 18+** and **npm**

### Step 1: Copy toolkit into your project

Clone this repo, then copy the files into your project root:

```bash
git clone https://github.com/charliestoner1/occasio-claude-toolkit.git /tmp/toolkit

# Copy into your project
cp -r /tmp/toolkit/.claude your-project/
cp -r /tmp/toolkit/.agents your-project/
cp /tmp/toolkit/TOOLKIT.md your-project/
cp /tmp/toolkit/PROMPTS.md your-project/
cp /tmp/toolkit/.mcp.json.template your-project/
cp /tmp/toolkit/templates your-project/templates/
```

Your project should look like this:
```
your-project/
├── .claude/              ← skills, hooks, agents, GSD (the toolkit)
├── .agents/              ← Figma MCP integration
├── templates/            ← CLAUDE.md + brand brief templates
├── TOOLKIT.md            ← command cheat sheet
├── PROMPTS.md            ← example prompts with copy-paste examples
├── .mcp.json.template    ← MCP server config template
├── CLAUDE.md             ← you create this (see Step 3)
├── src/
├── package.json
└── ...
```

### Step 2: Set up MCP servers

```bash
cp .mcp.json.template .mcp.json
```

Edit `.mcp.json` and replace the placeholder values with your credentials. Then **add `.mcp.json` to your `.gitignore`** — it contains secrets.

| Server | What it does | Credential | Priority |
|--------|-------------|-----------|----------|
| **context7** | Looks up latest library docs (React, Tailwind, Motion, etc.) | None needed | Must have |
| **puppeteer** | Screenshots pages, headless browser testing | None needed | Nice to have |
| **figma** | Pulls Figma designs directly into Claude for code conversion | Figma access token | Must have if using Figma |
| **fal** | AI image/video generation (hero images, backgrounds, illustrations) | fal.ai API key | Nice to have |
| **github** | Create PRs, manage issues from Claude Code | GitHub PAT | Nice to have |
| **postgres** | Query databases directly | Connection string | Not needed for landing pages |
| **prisma** | Database schema management | None | Not needed for landing pages |
| **sentry** | Error tracking | Sentry token | Not needed for landing pages |

**For a landing page, you only need: context7 + figma (if you have designs). The rest are optional.**

### Step 3: Create your CLAUDE.md

This is the most important file. Claude reads it every session and follows whatever you put here.

Copy the template and fill it in:
```bash
cp templates/CLAUDE.md.template CLAUDE.md
```

Open `CLAUDE.md` and fill in the brackets — your company name, tech stack, brand colors, design direction, page structure. **The more specific you are, the better Claude's output.**

### Step 4: Fill out the brand brief (optional but recommended)

```bash
cp templates/BRAND-BRIEF.md.template BRAND-BRIEF.md
```

This gives Claude deep context about your brand — personality, colors, typography, competitors, content. If you fill this out well, Claude produces noticeably better designs.

### Step 5: Verify it works

Open your project in VS Code, open the Claude Code panel (Cmd+Shift+P → "Claude Code: Open"). You should see the GSD status line at the bottom of the panel. Type `/help` to see available commands.

---

## Quick Start — Build a Landing Page

Once setup is complete, here's the fastest path to a landing page:

### Option A: One-shot build (simplest)
```
/landing-page full
```
Claude reads your CLAUDE.md and BRAND-BRIEF.md, then builds the entire page section by section — nav, hero, features, testimonials, CTA, footer — with responsive design and animations.

### Option B: Section by section (more control)
```
Build me a hero section with a bold headline, subheadline, and CTA button.
Headline: "Ship products your customers love"
Use a gradient mesh background.
```
Then:
```
Now build a features section with 4 cards in a bento grid layout.
```
Then:
```
/animate page entrances
```

### Option C: From Figma (design-to-code)
Paste your Figma URL directly into Claude Code:
```
Here's our landing page design: https://www.figma.com/file/abc123...
Convert this to Next.js with Tailwind. Match the design exactly.
Make it responsive.
```

### Option D: GSD workflow (complex multi-page site)
```
/gsd:new-project
```
Claude asks you questions about the project, creates a phased roadmap, then you execute phase by phase with atomic commits.

---

## Skills — What They Are & How to Use Them

Skills are specialized "modes" that give Claude deep expertise in a specific area. Think of them as hiring a specialist for a particular job.

### How to invoke a skill

Type `/skill-name` in the Claude Code chat panel:
```
/animate hero section
```

Some skills **auto-activate** — you don't need to invoke them. When you ask Claude to build UI, the `/frontend-design` skill kicks in automatically to ensure high design quality.

### Skill chaining

You can use multiple skills in sequence. Build with one, refine with another:
```
Step 1: "Build a pricing section with 3 tiers"       → /frontend-design auto-activates
Step 2: /animate pricing cards                         → adds entrance animations
Step 3: /a11y-audit                                    → checks accessibility
Step 4: /perf-audit                                    → checks performance
```

---

## Skill Reference — When to Use What

> **About `<target>` in skill commands:** When you see `/skill-name <target>`, the `<target>` is just a **plain English description** of what you want. Not a file path, not code — just describe it in your own words. For example: `/animate the hero headline with a typewriter effect`.

### `/landing-page [full | section-name]`
**When:** You want to build a complete landing page or a specific section.
**Example:**
```
/landing-page full
/landing-page hero
/landing-page pricing
```
**What it does:** Reads your CLAUDE.md and BRAND-BRIEF.md, builds sections in order (nav → hero → social proof → features → testimonials → CTA → footer) with responsive design, animations, and conversion best practices.

---

### `/frontend-design` (AUTO-ACTIVATES)
**When:** Any time you ask Claude to build UI. You don't need to invoke this — it runs automatically.
**What it does:** Ensures Claude produces distinctive, production-grade UI instead of generic AI output. Avoids default gradients, generic layouts, and template-looking code.

---

### `/ui-ux-pro-max`
**When:** You need design direction — choosing a style, color palette, font pairing, or layout approach.
**Examples:**
```
/ui-ux-pro-max
Suggest 3 color palettes for a fintech landing page. We want to feel trustworthy
but modern. Our primary color is #2563EB.
```
```
/ui-ux-pro-max
Show me font pairings for a bold, editorial-style landing page.
Headings should be dramatic, body text should be clean.
```
```
/ui-ux-pro-max
What design style would work for a developer tools landing page?
Show me options with examples.
```
**What it does:** Draws from 67 design styles, 96 color palettes, 57 font pairings, and 13 tech stacks to give you curated recommendations.

---

### `/animate <what you want to animate>`
`<target>` = a plain English description of what to animate. Not a file path or code — just describe it.

**When:** You want to add animations — hover effects, page transitions, scroll reveals, micro-interactions.
**Examples:**
```
/animate hero headline with typewriter effect
/animate feature cards with staggered scroll reveal
/animate page transitions between routes
/animate CTA button with magnetic hover effect
/animate navigation with shrink-on-scroll
```
**What it does:** Uses Motion (Framer Motion) and CSS keyframes. Knows spring physics, gesture animations, layout animations, and performance best practices.

---

### `/3d-scene <what you want to build>`
`<target>` = a plain English description of the 3D element. Just describe what you're imagining.

**When:** You want 3D elements — product showcases, interactive globes, floating shapes, particle fields.
**Examples:**
```
/3d-scene hero with floating geometric shapes that respond to mouse
/3d-scene interactive product model that users can rotate
/3d-scene globe with animated connection lines between cities
/3d-scene abstract mesh gradient background
```
**What it does:** Uses Three.js / React Three Fiber. Handles lighting, camera, materials, and performance optimization.

---

### `/motion-graphics <what you want to create>`
`<target>` = a plain English description of the motion graphic. Describe the visual you're imagining.

**When:** You want animated SVGs, Lottie animations, Canvas graphics, particle effects, or data visualizations.
**Examples:**
```
/motion-graphics animated logo reveal on page load
/motion-graphics confetti effect when user signs up
/motion-graphics animated counter for stats section
/motion-graphics subtle particle background for hero
/motion-graphics animated gradient blob
```
**What it does:** Creates performant motion graphics using Canvas, SVG animations, and Lottie.

---

### `/openai-figma`
**When:** You have Figma designs and want to convert them to code.
**Examples:**
```
Convert this Figma design to Next.js: https://figma.com/file/abc123...
```
```
/openai-figma
Pull the hero section from our Figma file and implement it with Tailwind.
Match the spacing and typography exactly.
```
**What it does:** Uses the Figma MCP server to read design files, extract styles, spacing, and assets, then generates pixel-accurate code.

---

### `/perf-audit`
**When:** Before deploying. Checks your page for performance issues.
**Example:**
```
/perf-audit
```
**What it checks:** Bundle size, client vs server components, image optimization, font loading, Suspense boundaries, caching, Core Web Vitals.

---

### `/a11y-audit`
**When:** Before deploying. Checks your page for accessibility issues.
**Example:**
```
/a11y-audit
```
**What it checks:** Heading hierarchy, alt text, color contrast (WCAG AA), keyboard navigation, focus indicators, ARIA labels, touch target sizes.

---

### `/review-changes`
**When:** Before committing. Reviews all your changes against quality standards.
**Example:**
```
/review-changes
```
**What it checks:** Responsive issues, hardcoded values, missing accessibility attributes, performance anti-patterns, code style.

---

### `/ship-it`
**When:** Before deploying to production. Runs everything in parallel.
**Example:**
```
/ship-it
```
**What it runs:** Build check + test suite + code review + dependency audit + security scan — all in parallel. Reports any blockers.

---

### `/check-theme`
**When:** After building UI. Ensures your colors work across themes.
**Example:**
```
/check-theme
```
**What it checks:** Hardcoded color values that should be CSS variables, contrast issues, colors that break in light/dark mode.

---

## MCP Servers — External Superpowers

MCP servers give Claude access to external tools and services. They run locally on your machine.

### context7 — Library Docs
Claude automatically looks up the latest documentation for any library. When you say "use Framer Motion's layout animation", Claude fetches the current API docs instead of relying on training data. **This means you always get current, working code.**

No action needed — it works automatically.

### figma — Design to Code
With the Figma MCP configured, you can paste Figma URLs directly into Claude Code. Claude reads the actual design file — spacing, colors, typography, components — and generates matching code.

```
Here's the Figma link for the hero section: [paste URL]
Convert to Next.js with Tailwind, make it responsive.
```

### puppeteer — Visual Testing
Claude can take screenshots of your running dev server to verify layouts:
```
Take a screenshot of localhost:3000 at mobile and desktop widths.
Check if anything looks broken.
```

### fal — AI Image Generation
Generate images directly from Claude Code:
```
Use fal to generate a hero background image.
Prompt: "Abstract dark gradient with subtle blue and purple light rays"
Style: photographic, 16:9 aspect ratio.
```

---

## GSD — Project Management for Complex Builds

For landing pages with many sections, animations, and responsive requirements, GSD (Get Shit Done) helps you work systematically.

### When to use GSD
- Landing page with 8+ sections
- Multiple interactive elements (3D, animations, forms)
- Multi-page marketing site
- Team project with handoffs

### When NOT to use GSD
- Simple 3-5 section landing page — just build it directly
- Single section or component — just ask Claude to build it

### GSD Workflow
```
/gsd:new-project          → Claude asks about your project, creates a roadmap
/gsd:plan-phase 1         → Plans "Phase 1: Foundation + Hero" in detail
/gsd:execute-phase 1      → Builds it with atomic commits
/gsd:verify-work 1        → Tests that it works correctly
/gsd:progress             → Shows status, suggests next step
```

### Quick one-off tasks with GSD
```
/gsd:quick Add a cookie consent banner with a dismiss button
```

---

## Automation Hooks

These run automatically — you don't need to do anything.

| Hook | When it runs | What it does |
|------|-------------|--------------|
| **Session advisor** | When you open Claude Code | Checks for uncommitted changes, suggests relevant skills |
| **Post-edit checker** | After Claude edits any file | Reminds about theme compatibility, responsive design, etc. |
| **Pre-commit check** | Before `git commit` | Runs linting and TypeScript checks (informational, doesn't block) |
| **GSD status line** | Always visible | Shows current task and how much context window is remaining |

---

## Templates

### `templates/CLAUDE.md.template`
Copy to your project root as `CLAUDE.md`. Fill in your tech stack, brand colors, conventions, and page structure. This is the single most impactful thing you can do for output quality.

### `templates/BRAND-BRIEF.md.template`
Copy to your project root as `BRAND-BRIEF.md`. Fill in your brand personality, visual identity, competitors, and content. Claude uses this to make design decisions that match your brand.

---

## Tips for Best Results

### 1. Be specific about what you want
Bad: "Build me a landing page"
Good: "Build a landing page for a developer tools SaaS. Style like Linear.app — minimal, dark, with precise typography. Hero should have a code editor animation."

### 2. Provide reference URLs
Claude can fetch and analyze any public URL:
```
I like the hero section on https://linear.app and the pricing page on https://vercel.com/pricing.
Build something that combines those approaches for our product.
```

### 3. Fill out the CLAUDE.md and brand brief thoroughly
The more context Claude has, the less generic the output. Spending 15 minutes on these templates saves hours of iteration.

### 4. Use skills for what they're good at
- Building UI → just describe it (auto-activates `/frontend-design`)
- Need design direction → `/ui-ux-pro-max`
- Need animations → `/animate`
- Need 3D → `/3d-scene`
- Before deploying → `/perf-audit` + `/a11y-audit` + `/ship-it`

### 5. Iterate in conversation
Don't try to get everything perfect in one prompt. Build the section, then refine:
```
Build a hero section → "Make the headline bigger" → "Add a gradient overlay" → "Animate the CTA"
```

### 6. Let Claude see reference designs
If you have Figma designs (with the MCP set up), paste the URL. If you have screenshots, share the file path. If you have reference sites, paste the URLs. Visual context > text descriptions.

### 7. Review before deploying
Always run before going live:
```
/perf-audit
/a11y-audit
/review-changes
```
Or the all-in-one:
```
/ship-it
```

### 8. Give effective feedback when you don't like something
Claude is trained to **ask diagnostic questions** before making changes when you give vague feedback. This is intentional — it prevents wasting time changing the wrong thing.

**To get the fastest iteration:**
- Say *what* feels off and *why*: "The hero feels too busy — too many elements competing for attention"
- Compare to something: "I want this to feel more like Stripe's homepage — clean, focused, lots of whitespace"
- Be directional: "Less corporate, more creative" or "Needs more energy" or "Tone down the animations"

**If you just want something changed fast**, be specific: "Make the headline 2xl, left-align it, remove the gradient." Claude will skip the questions and act immediately.

See the [Giving Feedback section in PROMPTS.md](PROMPTS.md#giving-feedback--how-to-iterate-effectively) for more examples.

---

## File Reference

| File | Purpose |
|------|---------|
| `TOOLKIT.md` | Quick reference table of all commands |
| `PROMPTS.md` | Copy-paste example prompts for common tasks |
| `DESIGN.md` | Design system rules Claude follows for UI work |
| `.claude/skills/` | 30 skill definitions |
| `.claude/hooks/` | 5 automation hooks |
| `.claude/agents/` | 11 GSD subagents |
| `.claude/commands/` | 21 GSD slash commands |
| `.claude/get-shit-done/` | GSD package (v1.20.5) |
| `.agents/` | Figma MCP skill |
| `.mcp.json.template` | MCP server config (fill in credentials) |
| `templates/` | CLAUDE.md + brand brief templates |
