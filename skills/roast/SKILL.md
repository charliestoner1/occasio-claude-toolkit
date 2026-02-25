---
name: roast
description: Use when the user expresses dissatisfaction with something — says it's bad, ugly, stupid, looks like shit, sucks, is dumb, etc. Ask targeted questions to understand what specifically they hate and what they want instead.
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Glob, Grep, AskUserQuestion
---

# Roast Intake — Understanding What Sucks and Why

**Trigger:** The user says something is bad, ugly, stupid, looks like shit, sucks, is dumb, trash, awful, terrible, hideous, gross, janky, or any similar expression of dissatisfaction.

**Your job:** Don't defend the code. Don't explain why it is the way it is. Don't immediately start fixing. Instead, ask questions to fully understand the complaint so you can make targeted, high-quality improvements.

## Process

### Step 1: Identify the Target

If it's not already clear, ask:
- **What specifically** are they looking at? (a page, component, interaction, flow, color, layout, etc.)
- If they referenced something vague ("this looks like shit"), ask them to clarify what "this" is.

### Step 2: Diagnose the Problem (ask 3-5 of these, adapted to context)

Pick the most relevant questions. Don't ask all of them — read the room:

1. **What's the worst part?** — "What's the single most offensive thing about it?"
2. **Vibe check** — "What vibe were you going for? What does this give instead?"
3. **Reference point** — "Is there something you've seen that does this well? A site, app, screenshot?"
4. **Specific vs general** — "Is it the whole thing or specific parts? Colors? Spacing? Typography? Layout? Animation?"
5. **Functional or aesthetic?** — "Does it work wrong, or does it just look/feel wrong?"
6. **Mobile or desktop?** — "Are you seeing this on mobile, desktop, or both?"
7. **Who sees it?** — "Is this customer-facing, admin, or staff? How important is it?"

### Step 3: Confirm Scope Before Acting

Summarize back what you understood:
- What's broken/ugly
- What direction they want to go
- How much effort they want (quick fix vs redesign)

Then ask: **"Does that capture it? Anything else that bugs you about it?"**

### Step 4: Only Then Fix It

Once you have clear understanding, proceed to fix. Use the appropriate skill if needed:
- UI issues → `frontend-design` or `ui-ux-pro-max`
- Animation issues → `animate`
- Theme issues → `check-theme`
- Layout/mobile → check `mobile.md` patterns

## Rules

- **Never be defensive** about existing code
- **Never minimize** their complaint ("it's not that bad")
- **Validate first** — "Yeah, I can see that" or "Fair point"
- **Be direct** in your questions — no corporate speak
- **3-5 questions max** before acting — don't interrogate them
- **If they're clearly in a rush**, skip to "what do you want it to look like?" and go
- **If they give a very specific complaint** ("the font is too small"), you don't need the full questionnaire — just confirm and fix
