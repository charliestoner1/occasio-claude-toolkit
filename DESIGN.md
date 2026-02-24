# Design System — Cantina Booking

> This file is loaded by Claude Code for every UI task. It codifies the design language
> so every component feels intentional, consistent, and premium — regardless of venue theme.

## Philosophy

**Clean card-based clarity meets nightlife energy.**

- Every pixel earns its place. No decoration without purpose.
- Hierarchy through typography and spacing, not color saturation.
- Depth via soft shadows — not glow, not gradients, not glass blur.
- The venue theme sets the mood; the design system provides structure.
- Motion exists to communicate state, not to impress.
- Dark by default — light themes (like Marbella) are the exception, not the rule.

## Design Principles

### 1. Clarity Over Cleverness
If a user has to think about how to use something, it's broken. Labels, affordances, and hierarchy should make the next action obvious. Stripe's forms are the gold standard — minimal chrome, maximum clarity.

### 2. Restraint Creates Premium
Luxury isn't more — it's less, done better. One accent color, not three. One animation, not five. Generous whitespace (or "darkspace") signals confidence.

### 3. Venue-Adaptive, Not Venue-Dependent
The layout, spacing, typography weight, and component patterns stay consistent. Only colors and shadow intensities change per theme. A component should look great in Miami pink AND Tokyo monochrome.

### 4. Mobile-First, Touch-Native
44px minimum touch targets. No hover-only interactions. Thumb-zone aware layouts. 50%+ of users are on phones at a bar deciding where to go tonight.

## Typography Scale

Using Geist Sans (loaded via `next/font`). Tight tracking for headlines, relaxed for body.

| Token           | Size     | Weight | Tracking  | Line Height | Usage                    |
|-----------------|----------|--------|-----------|-------------|--------------------------|
| `display-xl`    | 3.5rem   | 800    | -0.03em   | 1.05        | Hero headline            |
| `display`       | 2.5rem   | 800    | -0.03em   | 1.05        | Section headlines         |
| `heading`       | 1.5rem   | 700    | -0.02em   | 1.2         | Card titles, page titles  |
| `subheading`    | 1.125rem | 500    | 0         | 1.7         | Descriptions, subtitles   |
| `body`          | 1rem     | 400    | 0         | 1.6         | Paragraphs, form labels   |
| `body-sm`       | 0.875rem | 400    | 0         | 1.5         | Secondary info, metadata  |
| `caption`       | 0.75rem  | 500    | 0.05em    | 1.4         | Badges, timestamps        |
| `label`         | 0.6875rem| 600    | 0.1em     | 1.3         | Uppercase labels          |

**Rules:**
- Headlines use `heading-display` class (defined in globals.css)
- Never go below 0.75rem (12px) — accessibility minimum
- Price typography uses `text-price` class — bold, primary color, tight tracking
- Labels use `text-label` class — uppercase, tracked, muted

## Spacing Scale (8px base)

| Token | Value  | Usage                              |
|-------|--------|------------------------------------|
| `xs`  | 4px    | Icon gaps, badge padding           |
| `sm`  | 8px    | Tight groups, input padding        |
| `md`  | 16px   | Card padding, between elements     |
| `lg`  | 24px   | Section gaps, card margins         |
| `xl`  | 32px   | Between card groups                |
| `2xl` | 48px   | Major section transitions          |
| `3xl` | 64px   | Page section spacing               |
| `4xl` | 96px   | Hero top/bottom padding            |

**Rules:**
- Always use multiples of 4px (Tailwind's default scale does this)
- Horizontal padding on cards: 24px (p-6)
- Vertical rhythm between stacked elements: 16-24px
- Page sections use `section-spacing` class (96px vertical, 16px horizontal)
- Maximum content width: 80rem via `container-premium`

## Color Usage Rules

### The Color Hierarchy
1. **Primary** (`--color-primary`) — CTAs, active states, key metrics. Use sparingly.
2. **Accent** (`--color-accent`) — VIP badges, price highlights, special callouts. Even more sparingly.
3. **Surface colors** — The workhorses. `surface-primary` for cards, `bg-tertiary` for inputs.
4. **Text colors** — Three tiers only: `text-primary`, `text-secondary`, `text-muted`. No more.

### What NOT to do
- Never use raw hex colors — always CSS variables or theme tokens
- Never mix primary and accent on the same component (pick one)
- Never use colored text on colored backgrounds without checking `on-primary`/`on-accent`
- Status colors (red/green/blue/violet) are semantic — never override them with theme colors

### Gradient & Glow Policy
- **No gradients on cards or buttons** — use solid fills with soft shadows
- **No colored glow shadows** — use the `--shadow-card` elevation system
- Gradients are reserved for **hero image overlays only** (and sparingly)
- Never gradient text — use `text-primary` or `text-on-primary` instead

## Component Patterns

### Cards
Three tiers defined in globals.css — use the right one:

| Class           | When to Use                                | Visual                                    |
|-----------------|---------------------------------------------|-------------------------------------------|
| `card-premium`  | Primary content (booking cards, stats)       | Solid surface bg, soft shadow, hover lift |
| `card-glass`    | Overlaid content (modals, popovers, chat)    | Elevated surface, no blur                 |
| `card-accent`   | Hierarchical callouts (selected item, alert) | Left accent border, subtle bg             |

**Rules:**
- Cards have `border-radius: 1rem` (rounded-2xl)
- Hover states change border-color + shadow elevation, NOT background color
- Inner content padding: 24px (p-6) on desktop, 16px (p-4) on mobile
- Don't nest cards inside cards
- Shadow depth comes from `--shadow-card` / `--shadow-card-hover` CSS variables (theme-adaptive)

### Buttons
Three tiers defined in globals.css:

| Class           | When to Use                           | Visual                                    |
|-----------------|----------------------------------------|-------------------------------------------|
| `btn-premium`   | Primary action (Book Now, Confirm)     | Solid fill, soft shadow, pill shape       |
| `btn-secondary` | Secondary action (View Details, Back)  | Outlined, transparent bg, pill shape      |
| `btn-ghost`     | Tertiary action (Cancel, filters)      | Text only, subtle hover bg                |

**Rules:**
- One `btn-premium` per visible viewport. Multiple dilute impact.
- Buttons are always pill-shaped (rounded-full) on customer-facing pages
- Admin buttons can use rounded-lg for a more professional feel
- Loading states: replace text with spinner, maintain button width
- Disabled: opacity 0.5, no pointer events

### Inputs
- Use `input-premium` class for styled inputs
- Focus ring: `0 0 0 3px color-mix(primary 15%)` — wide, subtle, not glow
- Background: `var(--color-bg-tertiary)` — theme variable, never hardcoded
- Border-radius: `0.75rem` (12px)
- Labels above inputs, not floating (clearer on dark backgrounds)
- Error states: red border + red text below, never red background
- Group related inputs with 16px gap

### Badges
- `badge-premium` class for themed badges
- Status badges use semantic colors directly (not themed)
- Pill shape, small text (caption size), 600 weight
- Always use contrasting text: white on colored backgrounds

## Layout Patterns

### Page Structure
```
[Nav — fixed, solid bg (95% opacity + light blur), z-50]
[Hero — full-bleed, image + single overlay, 85svh]
[Content sections — container-premium, section-spacing]
[Footer — bg-secondary, generous padding]
```

### Grid Rules
- Use CSS Grid or Tailwind grid, not flexbox for page layouts
- 1 column on mobile, 2-3 on tablet, 3-4 on desktop
- Gap: 24px (gap-6) for card grids
- Never more than 4 columns (reduces scanability)

### Section Separation
- Alternate between `bg-primary` and `bg-secondary` sections
- Use `h-px bg-[var(--color-border-secondary)]` dividers between sections — clean, not gradient
- Feature sections: text left + visual right (or stacked on mobile)

## Motion Guidelines

**Principle: Subtle & Polished.** Animation should be invisible — users feel the quality but can't point to it.

### Transition Defaults
```css
/* Standard transitions */
transition: all 0.2s ease;           /* Micro-interactions (hover, focus) */
transition: all 0.3s ease;           /* State changes (open/close, toggle) */
transition: all 0.4s ease-out;       /* Entrance animations */
transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);  /* Page transitions */
```

### What Gets Animated
- **Hover states**: border-color, box-shadow, transform (translateY -1px). Duration: 200ms.
- **State changes**: opacity, height, scale. Duration: 300ms. Use `ease`.
- **Page entrances**: fade-in + translateY(8px). Duration: 400ms. Use `ease-out`.
- **Modals/sheets**: backdrop fade + slide up. Duration: 300ms. Use spring.

### What Does NOT Get Animated
- Text color changes (looks flickery)
- Background color on cards (use border/shadow instead)
- Layout shifts (causes jank)
- Anything on scroll (unless specifically requested)

### Framer Motion Defaults (when used)
```tsx
// Standard entrance — subtle, 12px offset max
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}

// Step transitions — 20px directional offset
initial={{ opacity: 0, x: direction * 20 }}
animate={{ opacity: 1, x: 0 }}

// Staggered list
staggerChildren: 0.05  // Keep tight — 50ms between items
```

All presets are centralized in `lib/motion/config.ts` — never use magic numbers inline.

### Reduced Motion
Always respect `prefers-reduced-motion`. Already handled globally in `globals.css` — all animations are killed. Don't add JS-based animations that bypass this.

## Depth & Elevation

### Shadow System (Theme-Adaptive)

Three CSS variables provide consistent elevation across all themes. Dark themes use heavier shadows; light themes use softer ones.

| CSS Variable          | Use Case              | Dark Theme                          | Light Theme                         |
|-----------------------|-----------------------|-------------------------------------|-------------------------------------|
| `--shadow-card`       | Cards at rest         | `0 1px 3px rgba(0,0,0,0.3)`        | `0 1px 3px rgba(0,0,0,0.1)`        |
| `--shadow-card-hover` | Hovered cards, modals | `0 4px 12px rgba(0,0,0,0.4)`       | `0 4px 6px rgba(0,0,0,0.1)`        |
| `--shadow-elevated`   | Popovers, dropdowns   | `0 8px 24px rgba(0,0,0,0.5)`       | `0 10px 15px rgba(0,0,0,0.1)`      |

Utility classes map to these:

| Class               | Maps To               |
|---------------------|-----------------------|
| `shadow-elevation-1`| `var(--shadow-card)`       |
| `shadow-elevation-2`| `var(--shadow-card-hover)` |
| `shadow-elevation-3`| `var(--shadow-elevated)`   |

**Rules:**
- Never use colored glow shadows (`box-shadow` with theme colors) — only neutral elevation
- Border-color change is the primary hover signal; shadow deepening is secondary
- `backdrop-filter: blur()` is deprecated — use solid/opaque backgrounds instead (GPU performance)

## Responsive Breakpoints

| Name    | Width    | Tailwind | Layout Changes                           |
|---------|----------|----------|------------------------------------------|
| Mobile  | < 640px  | default  | Single column, stacked, 16px padding     |
| Tablet  | 640-768px| `sm:`    | 2 columns, sidebar collapses             |
| Desktop | 768px+   | `md:`    | Full layout, hover states active         |
| Wide    | 1280px+  | `xl:`    | Max-width container, extra breathing room|

**Mobile-Specific Rules:**
- No hover-dependent interactions (use tap)
- Bottom sheets instead of modals when possible
- Sticky CTAs at bottom of viewport for conversion
- No `backdrop-filter` — solid backgrounds only (GPU performance)
- Hero height: 85svh (lets next section peek)

## Dark vs Light Theme Handling

The theme system handles this via CSS variables. When building components:

1. Never use `text-white` for text on themed backgrounds — use `var(--color-on-primary)`
2. Never assume dark background — some themes (Marbella) are light
3. Overlay colors use `var(--color-overlay)` not `rgba(255,255,255,0.05)`
4. Border overlays use `var(--color-border-overlay)` not `border-white/10`
5. The `color-scheme` CSS property is set per theme — respects native UI elements

## Anti-Patterns (Never Do These)

1. **Rainbow UI** — More than 2 brand colors active at once
2. **Border soup** — Every element has a visible border (use spacing/shadow instead)
3. **Gradient cards/buttons** — Use solid fills. Gradients are only for hero overlays
4. **Colored glow shadows** — Use neutral `--shadow-card` system, never `box-shadow` with theme colors
5. **Backdrop blur** — Removed for GPU performance. Use solid/opaque backgrounds
6. **Animation carnival** — More than one moving element in the viewport at rest
7. **Tiny text** — Below 12px (0.75rem) for any reason
8. **Centered everything** — Left-align body text. Only center headlines and CTAs.
9. **Icon overload** — Not every label needs an icon. Use them for navigation and actions.
10. **Texture noise** — No film grain overlays. Clean surfaces only.

## Inspiration Reference

### Conceptzilla / Stripe Patterns
- **Clear hierarchy**: One thing demands attention per section
- **Generous spacing**: Let content breathe — darkspace is premium
- **Purposeful color**: Color draws the eye to what matters (CTAs, key metrics)
- **Data presentation**: Large numbers + small labels (stat cards)
- **Progressive disclosure**: Show summary, expand for details
- **Consistent rhythm**: Every section follows the same vertical rhythm
- **Soft shadows**: Depth through neutral box-shadows, not colored glow

### Nightlife-Specific Patterns
- **VIP energy**: Gold/amber accents for premium tiers (handled by accent color)
- **Dark depth**: Layered dark surfaces with shadow-based elevation
- **Photo integration**: Let venue photos set the mood, UI stays minimal over them
- **Urgency signals**: "Last 2 tables" styled as accent badges, not red alerts
- **Clean cards**: Solid surface backgrounds with subtle borders and shadow depth

## Quick Reference — Which Class to Use

| I want to...                    | Use this                              |
|---------------------------------|---------------------------------------|
| Make a primary button           | `btn-premium`                         |
| Make a card                     | `card-premium`                        |
| Make an elevated overlay        | `card-glass` (solid bg, no blur)      |
| Style a headline                | `heading-display`                     |
| Style a price                   | `text-price`                          |
| Style a label / eyebrow         | `text-label` / `text-eyebrow`         |
| Style supporting text           | `text-sub`                            |
| Add a badge                     | `badge-premium`                       |
| Style an input                  | `input-premium`                       |
| Add section spacing             | `section-spacing`                     |
| Constrain width                 | `container-premium`                   |
| Add resting shadow              | `shadow-elevation-1`                  |
| Add hover/modal shadow          | `shadow-elevation-2`                  |
| Add popover shadow              | `shadow-elevation-3`                  |
| Add a smooth transition         | `transition-smooth`                   |
| Add scrollbar styling           | `custom-scrollbar`                    |
