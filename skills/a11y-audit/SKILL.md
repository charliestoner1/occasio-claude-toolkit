---
name: a11y-audit
description: Accessibility audit — ARIA labels, keyboard navigation, color contrast, focus management, screen reader compatibility
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob
context: fork
agent: Explore
argument-hint: "[page-or-component]"
---

# Accessibility Audit

Audit for WCAG 2.1 AA compliance. Most customers book on phones — accessibility directly impacts conversion.

If `$ARGUMENTS` specifies a page or component, focus there. Otherwise, audit the customer-facing booking flow (highest impact).

## Priority Pages

1. **Booking flow** (highest priority — revenue path):
   - `app/booking/checkout/page.tsx`
   - `app/booking/bottles/page.tsx`
   - `app/booking/confirmation/page.tsx`
   - `components/booking/InteractiveBookingSection.tsx`
2. **Event pages** — `app/events/[slug]/page.tsx`, ticket purchase
3. **Home page** — `app/page.tsx`
4. **Admin dashboard** — lower priority but should still be usable

## Audit Checks

### 1. Semantic HTML (HIGH)

- **Heading hierarchy**: `h1` → `h2` → `h3` in order, no skipped levels
- **Landmarks**: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` with labels
- **Lists**: Related items use `<ul>`/`<ol>`, not bare `<div>` sequences
- **Buttons vs links**: `<button>` for actions, `<a>` for navigation
- **Forms**: `<label>` associated with each `<input>` (via `htmlFor` or wrapping)

Search for anti-patterns:
```
- <div onClick= (should be <button>)
- <a onClick= without href (should be <button>)
- <input> without associated <label> or aria-label
```

### 2. ARIA Labels (HIGH)

- **Interactive elements**: All buttons, links, and form controls need accessible names
- **Icon-only buttons**: Must have `aria-label` (e.g., close buttons, hamburger menus)
- **Loading states**: `aria-busy="true"` on loading containers
- **Dynamic content**: `aria-live` regions for content that updates (e.g., price totals, availability)
- **Modals**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

Search for missing labels:
```
Patterns:
- <button> containing only an icon/SVG without aria-label
- <IconName /> inside <button> without text or aria-label
- <input without aria-label or associated label
- role="dialog" without aria-labelledby
```

### 3. Keyboard Navigation (HIGH)

- **Tab order**: Logical flow through interactive elements
- **Focus visible**: `:focus-visible` styles on all interactive elements (check for `outline-none` without replacement)
- **Escape key**: Closes modals, dropdowns, popovers
- **Enter/Space**: Activates buttons and links
- **Arrow keys**: Navigate within radio groups, tabs, menus

Search for keyboard traps:
```
Patterns:
- outline-none or outline-0 without focus-visible replacement
- tabIndex="-1" on interactive elements (removes from tab order)
- onKeyDown handlers missing for custom interactive components
```

### 4. Color Contrast (MEDIUM)

WCAG AA requires:
- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18px+ or 14px+ bold): 3:1 ratio
- **UI components**: 3:1 against adjacent colors

Common issues in dark themes:
- `text-zinc-500` on `bg-zinc-900` — may fail contrast (check ratio)
- `text-zinc-600` on `bg-black` — likely fails
- `text-zinc-400` on `bg-zinc-800` — borderline
- Primary color text on dark backgrounds — depends on theme

Check the theme system:
- Do all theme presets maintain contrast ratios?
- Does the monochrome theme (primary=white, accent=gray) maintain contrast?

### 5. Focus Management (MEDIUM)

- **Modal open**: Focus moves to modal, trapped inside
- **Modal close**: Focus returns to trigger element
- **Route changes**: Focus moves to new page content (or `<h1>`)
- **Dynamic content**: New content announced to screen readers
- **Error messages**: Focus moves to first error, errors associated with fields via `aria-describedby`

### 6. Images and Media (MEDIUM)

- **`alt` text**: All `<img>` and `<Image>` have descriptive `alt` (or `alt=""` if decorative)
- **Decorative images**: `alt=""` and `aria-hidden="true"`
- **SVG icons**: `aria-hidden="true"` when decorative, `role="img"` + `aria-label` when meaningful

Search:
```
Patterns:
- <Image without alt=
- <img without alt=
- <svg> without aria-hidden
```

### 7. Form Accessibility (HIGH — Booking Flow)

The booking form is the revenue path. Check:
- **Labels**: Every input has a visible label (not just placeholder)
- **Required fields**: `aria-required="true"` or `required` attribute
- **Error messages**: `aria-invalid="true"` + `aria-describedby` pointing to error text
- **Field groups**: Related fields (e.g., date + time) wrapped in `<fieldset>` with `<legend>`
- **Select/dropdown**: Custom selects announce selected value
- **Date picker**: Keyboard-accessible date selection

### 8. Touch Target Size (HIGH — Mobile)

Per WCAG 2.5.8 (Target Size):
- Minimum 44x44px for touch targets
- Already a project convention — verify it's followed

Search:
```
Patterns:
- h-6, h-8, w-6, w-8 on buttons/links (too small)
- p-1, p-0.5 on interactive elements (padding too small)
- text-xs on clickable elements without padding compensation
```

### 9. Motion and Animation (LOW)

- **`prefers-reduced-motion`**: Respect user's motion preference
- **Auto-playing animations**: Should pause with reduced-motion
- **Transitions**: Essential animations only (not purely decorative)

Search:
```
Pattern: @keyframes or animate- classes without prefers-reduced-motion check
```

## Report Format

```
## Accessibility Audit Results

### Scope
Pages/components audited: [list]

### Critical (blocks usage for some users)
1. [file:line] Finding → Impact → Fix

### High (significant barrier)
1. [file:line] Finding → Impact → Fix

### Medium (usability improvement)
1. [file:line] Finding → Recommendation

### Low (best practice)
1. [file:line] Finding → Recommendation

### Score Estimate
- Semantic HTML: X/10
- ARIA: X/10
- Keyboard: X/10
- Contrast: X/10
- Forms: X/10
- Overall: X/10

### Priority Fixes (ordered by impact)
1. Fix → Files affected → Effort
```
