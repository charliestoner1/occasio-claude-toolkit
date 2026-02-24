---
name: animate
description: Add animations and motion — Framer Motion, CSS keyframes, page transitions, scroll animations, micro-interactions, spring physics
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm install *)
argument-hint: "<what-to-animate> [--css-only] [--framer]"
---

# Animation & Motion

Add animations, transitions, and motion to components and pages.

**Target:** $ARGUMENTS

## Arguments

- First arg = what to animate (component name, page, or description like "booking flow transitions")
- `--css-only` = use only CSS animations (no new dependencies)
- `--framer` = use Framer Motion (will install if needed)
- Default = choose the best approach based on complexity

## Decision: CSS vs Framer Motion

### Use CSS-only when:
- Simple hover/focus effects
- Loading spinners and skeleton states
- Basic entrance animations (fade in, slide up)
- Continuous animations (pulse, glow, shimmer, float)
- Performance-critical mobile animations

### Use Framer Motion when:
- Layout animations (elements smoothly repositioning)
- Page/route transitions
- Gesture-based interactions (drag, swipe, pinch)
- Spring physics (natural-feeling bounces)
- Complex orchestrated sequences (stagger children)
- AnimatePresence (exit animations)
- Scroll-triggered animations

## Setup: Framer Motion (if needed)

```bash
npm install framer-motion
```

### Basic Import Pattern
```typescript
'use client'
import { motion, AnimatePresence } from 'framer-motion'
```

### Performance: Use `LazyMotion` for bundle splitting
```typescript
import { LazyMotion, domAnimation, m } from 'framer-motion'

// Wrap app or page section:
<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

## Animation Recipes

### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.4,
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
```

### Staggered List Entrance
```typescript
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

<motion.div variants={containerVariants} initial="initial" animate="animate">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Scroll-Triggered Reveal
```typescript
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
```

### Modal / Dialog Animation
```typescript
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Drag Interaction
```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
  whileHover={{ cursor: 'grab' }}
/>
```

### Number Counter (animated value)
```typescript
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [value, count])

  return <motion.span>{rounded}</motion.span>
}
```

### Button Micro-interaction
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  className="..."
>
  {label}
</motion.button>
```

## CSS-Only Recipes

### Entrance Animation (no JS)
```css
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { animation: slide-up-fade 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
```

### Stagger with CSS (using animation-delay)
```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-slide-up opacity-0"
    style={{ animationDelay: `${i * 50}ms` }}
  />
))}
```

### Smooth Height Transition (CSS grid trick)
```css
.collapsible {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.collapsible.open {
  grid-template-rows: 1fr;
}
.collapsible > div {
  overflow: hidden;
}
```

## Project-Specific Rules

### Existing Custom Animations
The project already has these in `globals.css` — use them before creating new ones:
- `animate-gradient` — gradient text shift
- `animate-pulse-glow` — pulsing glow (nightclub feel)
- `animate-float` — vertical bob
- `animate-shimmer` — loading shimmer
- `animate-speakeasy-reveal` — entrance with blur
- `animate-shake` — error vibration
- `animate-keyhole-glow` — pulsing drop shadow
- `transition-smooth` — standard 0.3s cubic-bezier

### Theme Integration
- Glow effects use CSS variables: `--glow-primary`, `--glow-primary-strong`, `--glow-primary-intense`
- New glow animations should reference these variables, not hardcode colors
- New shimmer animations should use `--color-shimmer`

### Accessibility (REQUIRED)
Always respect reduced motion preference:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-custom {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The project already has a global reduced-motion rule in `globals.css` (lines 1092-1100) that covers `*` elements, but verify new keyframes and Framer Motion animations also respect it:
```typescript
// Framer Motion: respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Or use the hook:
import { useReducedMotion } from 'framer-motion'
```

### Mobile Performance
- Avoid `filter: blur()` animations on mobile (GPU-heavy)
- Reduce animation complexity on mobile using `useIsMobile(768)`
- Use `will-change` sparingly — only on actively animating elements
- Prefer `transform` and `opacity` over layout-triggering properties (`width`, `height`, `top`, `left`)

### Dark Theme
This is a nightclub app. Animations should enhance the premium dark aesthetic:
- Glow effects over drop shadows
- Subtle reveals over flashy entrances
- Spring physics over linear timing (more natural)
- Gold/emerald accents in animations match the theme system

## After Adding Animations

1. Add new keyframes to `globals.css` if CSS-only
2. Add new CSS animation utilities to the `@layer utilities` block
3. Add `prefers-reduced-motion` handling
4. Test on mobile — disable heavy animations for small screens
5. If Framer Motion was installed, add to dynamic imports list in MEMORY.md
