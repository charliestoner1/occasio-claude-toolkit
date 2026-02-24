# Toolkit Quick Reference

## Skills — `/command` to invoke

### Audits & Quality
| Command | What It Does |
|---------|-------------|
| `/full-audit` | All audits in parallel (timezone, theme, security, pricing, a11y, perf) |
| `/ship-it [--fix]` | Deployment pipeline: build + tests + review + deps + security + Vercel env var check |
| `/preflight` | Pre-deploy checks (lighter than ship-it) |
| `/review-changes [branch]` | Code review of uncommitted changes against all project gotchas |
| `/security-audit [scope]` | Secrets, auth gaps, payments, XSS, injection |
| `/audit-timezone [file]` | Wrong date query patterns, fromZonedTime misuse |
| `/pricing-verify [flow]` | Fee math, payment modes, deposit vs charge |
| `/perf-audit [page]` | Bundle size, re-renders, Suspense, caching |
| `/a11y-audit [page]` | ARIA, keyboard, contrast, focus, screen reader |
| `/check-theme [file]` | Hardcoded colors that break themed venues |
| `/review-themes [name\|all]` | Theme contrast, harmony, readability |
| `/white-label-audit [file]` | Hardcoded venue names, logos, branding |
| `/dep-audit` | Outdated/vulnerable packages, unused deps |

### Debugging
| Command | What It Does |
|---------|-------------|
| `/booking-debug <issue>` | Booking + payment flow tracer |
| `/notification-debug <issue>` | Push/SMS/email delivery tracer |
| `/fix-build` | Diagnose + fix Next.js build errors |
| `/gsd:debug [issue]` | Scientific-method debugging with persistent state |

### Scaffolding
| Command | What It Does |
|---------|-------------|
| `/new-feature <name> [--admin\|--booking]` | Component + route + test + security entry |
| `/new-route <path> [--public\|--staff\|--cron]` | API route with auth + security test |
| `/component <Name> [--admin\|--booking\|--page]` | React component with project conventions |
| `/test-scaffold <file>` | Vitest boilerplate with project mocking patterns |
| `/db-migrate <description>` | Prisma schema change workflow |

### UI/UX & Creative
| Command | What It Does |
|---------|-------------|
| `/frontend-design` | Auto-activates — bold, distinctive production UI |
| `/ui-ux-pro-max` | 67 styles, 96 palettes, 57 font pairings, 13 stacks |
| `/animate <target> [--css-only\|--framer]` | Framer Motion, CSS keyframes, micro-interactions |
| `/3d-scene <target>` | Three.js / React Three Fiber / WebGL |
| `/motion-graphics <target>` | Lottie, animated SVGs, Canvas, particles |
| `/openai-figma` | Auto on Figma URLs — design-to-code via Figma MCP |

### Feature Flags
| Command | What It Does |
|---------|-------------|
| `/toggle-feature <flag> [value]` | Toggle flags in .env (`--list` to show all) |
| `/add-feature-flag <name> [--category\|--default\|--wrap]` | Scaffold a new feature flag |

### Venue Onboarding
| Command | What It Does |
|---------|-------------|
| `/onboard-venue <name>` | White-label audit + env template + theme + assets |

---

## GSD Commands — `/gsd:command`

### Core Workflow
| Command | What It Does |
|---------|-------------|
| `/gsd:progress` | Check status, route to next action |
| `/gsd:plan-phase [N]` | Research + plan + verify loop |
| `/gsd:execute-phase <N>` | Run plans with wave-based parallel subagents |
| `/gsd:verify-work [N]` | Conversational UAT, auto-fix plans on failure |
| `/gsd:quick [task]` | One-off task with GSD guarantees |

### Project Setup
| Command | What It Does |
|---------|-------------|
| `/gsd:new-project` | Full project init: questioning + research + roadmap |
| `/gsd:new-milestone [name]` | Start a new milestone for existing project |
| `/gsd:complete-milestone <ver>` | Archive milestone, create git tag |
| `/gsd:map-codebase [area]` | 4 parallel agents analyze codebase |

### Phase Management
| Command | What It Does |
|---------|-------------|
| `/gsd:discuss-phase <N>` | Gather decisions before planning |
| `/gsd:list-phase-assumptions` | Surface Claude's approach assumptions |
| `/gsd:research-phase [N]` | Standalone research (plan-phase includes this) |
| `/gsd:add-phase <desc>` | Add phase to end of milestone |
| `/gsd:insert-phase <after> <desc>` | Insert urgent decimal phase (e.g., 72.1) |
| `/gsd:remove-phase <N>` | Remove unstarted phase, renumber |

### Session Management
| Command | What It Does |
|---------|-------------|
| `/gsd:resume-work` | Restore context from previous session |
| `/gsd:pause-work` | Create handoff file + WIP commit |
| `/gsd:add-todo [desc]` | Capture idea for later |
| `/gsd:check-todos [area]` | List and pick a pending todo |

### Milestone QA
| Command | What It Does |
|---------|-------------|
| `/gsd:audit-milestone [ver]` | Verify milestone definition of done |
| `/gsd:plan-milestone-gaps` | Batch-create phases for audit gaps |

### Config
| Command | What It Does |
|---------|-------------|
| `/gsd:settings` | Toggle research/checker/verifier, set model profile |
| `/gsd:set-profile <tier>` | Quick switch: quality / balanced / budget |
| `/gsd:health [--repair]` | Validate .planning/ directory |
| `/gsd:update` | Update GSD package |
| `/gsd:debug [issue]` | Scientific-method debugging |

---

## MCP Servers

| Server | What It Does |
|--------|-------------|
| **context7** | Library docs lookup (auto-allowed) |
| **postgres** | Direct Neon DB queries (auto-allowed) |
| **prisma** | Schema introspection + migrations |
| **puppeteer** | Headless browser: screenshots, scraping |
| **github** | Issues, PRs, commits, repo content |
| **sentry** | Error tracking: issues, events |
| **fal** | fal.ai image/video generation |
| **figma** | Design files: nodes, screenshots, variables |

---

## Automation Hooks (run automatically)

| Hook | When | What It Does |
|------|------|-------------|
| **session-advisor** | Session start | Flags uncommitted changes, critical files, npm vulnerabilities |
| **post-edit-check** | After Write/Edit | Contextual reminders (theme, pricing, timezone, security). Suggests /review-changes at 5+ files |
| **pre-commit-check** | Before git commit | Runs ESLint + TypeScript check (informational) |
| **gsd-statusline** | Always | Shows model, active task, context usage bar |
| **gsd-check-update** | Session start | Background check for GSD package updates |

---

## GSD Subagents (spawned internally)

| Agent | Spawned By | Role |
|-------|-----------|------|
| codebase-mapper | map-codebase | Analyze codebase (4 parallel) |
| debugger | debug | Scientific-method investigation |
| executor | execute-phase | Run plan tasks with atomic commits |
| integration-checker | audit-milestone | Verify cross-phase wiring |
| phase-researcher | plan-phase | Research before planning |
| plan-checker | plan-phase | Verify plan quality |
| planner | plan-phase | Create PLAN.md files |
| project-researcher | new-project | Domain ecosystem research (4 parallel) |
| research-synthesizer | new-project | Merge 4 research outputs |
| roadmapper | new-project | Requirements to phased roadmap |
| verifier | verify-work | Goal-backward feature validation |
