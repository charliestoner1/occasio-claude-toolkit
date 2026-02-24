# Occasio Claude Code Toolkit

Custom skills, automation hooks, AI agents, MCP server configs, and GSD project management for Claude Code.

## Setup

1. **Copy into your project root** — everything in this repo goes at the top level of your project:
   ```
   your-project/
   ├── .claude/          ← skills, hooks, agents, commands, GSD
   ├── .agents/          ← Figma MCP skill
   ├── TOOLKIT.md        ← command cheat sheet
   ├── .mcp.json.template
   ├── src/
   └── ...
   ```

   Easiest way: clone this repo into a temp folder, then copy everything over:
   ```bash
   git clone https://github.com/YOUR_ORG/occasio-claude-toolkit.git /tmp/toolkit
   cp -r /tmp/toolkit/.claude your-project/
   cp -r /tmp/toolkit/.agents your-project/
   cp /tmp/toolkit/TOOLKIT.md your-project/
   cp /tmp/toolkit/.mcp.json.template your-project/
   ```

2. **Set up MCP servers:**
   ```bash
   cp .mcp.json.template .mcp.json
   ```
   Edit `.mcp.json` and fill in your credentials. Add `.mcp.json` to `.gitignore`.

3. **Write a `CLAUDE.md`** in your project root with your project's conventions and tech stack. Claude reads this every session.

4. **Open VS Code** with the Claude Code extension and start building.

## What's Included

### Skills (29 total) — type `/command` in Claude Code

**Most useful for landing pages:**
| Command | What it does |
|---------|-------------|
| `/frontend-design` | Auto-activates — bold, production-grade UI |
| `/ui-ux-pro-max` | 67 styles, 96 palettes, 57 font pairings |
| `/animate <target>` | Framer Motion, CSS keyframes, scroll animations |
| `/3d-scene <target>` | Three.js / React Three Fiber |
| `/motion-graphics <target>` | Lottie, animated SVGs, Canvas, particles |
| `/openai-figma` | Design-to-code from Figma files |

**Quality & deployment:**
| Command | What it does |
|---------|-------------|
| `/perf-audit` | Bundle size, images, Core Web Vitals |
| `/a11y-audit` | ARIA, keyboard, contrast, screen reader |
| `/review-changes` | Code review before committing |
| `/ship-it` | Full deploy readiness pipeline |

See `TOOLKIT.md` for the complete list.

### MCP Servers

| Server | What it does | Credential needed |
|--------|-------------|-------------------|
| **context7** | Library docs lookup | None |
| **puppeteer** | Headless browser screenshots | None |
| **figma** | Pull Figma designs into code | Figma token |
| **fal** | AI image/video generation | fal.ai key |
| **github** | PRs, issues, repo management | GitHub PAT |

### Automation Hooks (run automatically)
- **Session advisor** — flags uncommitted changes, suggests commands
- **Post-edit checker** — contextual reminders after file edits
- **Pre-commit check** — linting + type checking before commits
- **Status line** — active task + context usage in the panel

### GSD Project Management
For complex multi-phase work:
```
/gsd:new-project       → Set up project with requirements
/gsd:plan-phase 1      → Plan first phase
/gsd:execute-phase 1   → Claude builds with atomic commits
/gsd:verify-work 1     → Verify it works
/gsd:progress          → See status, route to next action
```
