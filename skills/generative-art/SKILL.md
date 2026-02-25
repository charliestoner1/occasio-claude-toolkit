---
name: generative-art
description: Create generative art elements embedded in the app — particle fields, flow fields, noise textures, organic backgrounds, procedural effects using Canvas API, WebGL, or Framer Motion
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm install *)
argument-hint: "<target-element-or-page> [--canvas|--css|--webgl]"
---

# Generative Art Elements

Create algorithmic, generative art elements embedded in React/Next.js pages — particle systems, flow fields, noise-driven backgrounds, procedural textures, organic animations.

**Target:** $ARGUMENTS

## Two-Phase Creative Process

This skill follows a deliberate creative process:

### Phase 1: Algorithmic Philosophy (think before coding)

Before writing any code, articulate what the generative system will express. This is NOT optional — skipping it produces generic noise.

Write a brief philosophy (3-5 sentences) answering:
- What computational process drives the visuals?
- What emergent behavior should appear?
- How does it connect to the context where it's embedded?
- What makes it feel intentional rather than random?

Example for a nightclub booking hero:
> "Luminous Drift — Hundreds of dim particles drift through a dark field, their brightness and speed governed by layered Perlin noise. Occasional clusters form and dissolve like groups on a dance floor. The field responds subtly to scroll position, creating parallax depth. Color temperature shifts from cool violet at the edges to warm amber near the center, evoking stage lighting that draws the eye inward toward the CTA."

### Phase 2: Express Through Code

With the philosophy clear, build the React component that brings it to life.

## Arguments

- First arg = where the art goes (component name, page section, or description like "landing page hero background")
- `--canvas` = use HTML5 Canvas API (best for particles, flow fields)
- `--css` = use CSS-only techniques (gradients, blend modes, pseudo-elements)
- `--webgl` = use raw WebGL or Three.js (best for GPU-heavy effects, shaders)
- Default = choose the best approach based on the effect's complexity

## Approach Decision

### Use CSS-only when:
- Animated gradient backgrounds
- Noise-like textures via SVG filters
- Blend mode overlays
- Subtle atmospheric effects
- Performance is paramount (lowest overhead)

### Use Canvas API when:
- Particle systems (< 5000 particles)
- Flow fields and vector art
- Line-drawing algorithms
- Trail effects and accumulation
- Need per-pixel control without GPU shaders

### Use WebGL / Three.js when:
- Massive particle counts (> 5000)
- GPU shader effects (noise displacement, feedback loops)
- 3D generative geometry
- Post-processing effects (bloom, chromatic aberration)

### Use Framer Motion when:
- Animated SVG generative patterns
- Morphing organic shapes
- Spring-driven particle scatter (< 100 elements)
- DOM-based generative layouts

## Core Patterns

### Seeded Randomness (REQUIRED)

Every generative component MUST use seeded randomness for reproducibility:

```typescript
// Simple seeded PRNG (mulberry32)
function createRNG(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Usage
const rng = createRNG(42)
const x = rng() // 0-1, deterministic
```

### Noise Functions

```typescript
// Simple 2D value noise (no dependencies)
function noise2D(x: number, y: number, seed: number): number {
  const hash = (n: number) => {
    n = Math.sin(n + seed) * 43758.5453123
    return n - Math.floor(n)
  }
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix + iy * 57)
  const b = hash(ix + 1 + iy * 57)
  const c = hash(ix + (iy + 1) * 57)
  const d = hash(ix + 1 + (iy + 1) * 57)
  return a + ux * (b - a) + uy * (c - a) + ux * uy * (a - b - c + d)
}

// Fractal Brownian Motion (layered noise)
function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency, seed + i * 100)
    amplitude *= 0.5
    frequency *= 2
  }
  return value
}
```

### Canvas Particle System Template

```typescript
'use client'
import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

interface GenerativeConfig {
  seed: number
  particleCount: number
  speed: number
  // Add philosophy-specific params
}

const DEFAULT_CONFIG: GenerativeConfig = {
  seed: 42,
  particleCount: 800,
  speed: 0.5,
}

export function GenerativeCanvas({
  config = DEFAULT_CONFIG,
  className,
}: {
  config?: Partial<GenerativeConfig>
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Your algorithm here — driven by the philosophy
    // Use mergedConfig.seed for seeded randomness
    // Use noise2D/fbm for organic movement

    animRef.current = requestAnimationFrame(animate)
  }, [mergedConfig])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)
    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
```

### CSS Generative Background

```css
/* Layered noise texture via SVG filter */
.generative-noise {
  position: relative;
}
.generative-noise::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.08;
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E#n");
  pointer-events: none;
}

/* Animated gradient mesh */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.generative-gradient {
  background: linear-gradient(
    -45deg,
    var(--color-surface),
    color-mix(in srgb, var(--color-primary) 15%, transparent),
    var(--color-surface),
    color-mix(in srgb, var(--color-accent) 10%, transparent)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

## Generative Art Archetypes

Reference these when choosing an algorithmic approach. Don't copy — interpret through the philosophy.

| Archetype | Core Algorithm | Best For |
|-----------|---------------|----------|
| **Flow Field** | Noise-driven vector field, particles follow flow lines | Hero backgrounds, ambient atmosphere |
| **Particle Drift** | Brownian motion with attraction/repulsion forces | Floating ambiance, subtle movement |
| **Organic Growth** | Recursive branching, L-systems, diffusion-limited aggregation | Decorative borders, section dividers |
| **Wave Interference** | Overlapping sine/cosine waves creating moiré patterns | Rhythmic backgrounds, loading states |
| **Voronoi / Cell** | Point relaxation, cell-based tessellation | Texture overlays, abstract patterns |
| **Trail Accumulation** | Particles leaving trails that build up density | Rich texture backgrounds |
| **Attractor** | Strange attractors (Lorenz, Clifford, De Jong) | Statement pieces, confirmation effects |
| **Reaction-Diffusion** | Gray-Scott model, Turing patterns | Organic textures, biological feel |

## Philosophy-to-Code Mapping

When the philosophy says... → Build this:

| Philosophy Language | Implementation |
|---|---|
| "emergence" / "self-organization" | Particles with local interaction rules, no global coordination |
| "turbulence" / "chaos" | High-octave FBM noise, curl noise for divergence-free flow |
| "crystallization" / "order from disorder" | Random initialization → relaxation/packing algorithm |
| "rhythm" / "pulse" | Time-varying parameters with sine modulation |
| "density" / "accumulation" | Additive blending, never clearing the canvas (or low-alpha clear) |
| "breath" / "organic" | Low-frequency noise controlling macro behavior |
| "tension" / "energy" | Competing forces, repulsion near attractors |
| "stillness" / "calm" | Slow drift, large noise scales, minimal velocity |

## Project-Specific Rules

### Theme Integration (REQUIRED)
Read colors from CSS variables — generative art must work across all venue themes:

```typescript
function getThemeColors() {
  const style = getComputedStyle(document.documentElement)
  return {
    primary: style.getPropertyValue('--color-primary').trim(),
    accent: style.getPropertyValue('--color-accent').trim(),
    surface: style.getPropertyValue('--color-surface').trim(),
    text: style.getPropertyValue('--color-text').trim(),
  }
}
```

Never hardcode colors like `#10b981`. Use theme variables or derive palettes from them.

### Performance (CRITICAL)

```typescript
import { useIsMobile } from '@/lib/hooks/use-is-mobile'

// Inside component:
const isMobile = useIsMobile(768)
const particleCount = isMobile ? 200 : 1000
const enableTrails = !isMobile
```

- **Canvas DPR**: Cap at 2 (`Math.min(devicePixelRatio, 2)`)
- **Mobile**: Reduce particle count by 60-80%, disable blur/trails
- **Offscreen**: Pause animation when not visible (IntersectionObserver)
- **Frame budget**: Target 16ms per frame — profile with `performance.now()`
- **Memory**: Reuse particle arrays, don't allocate in the render loop

### Accessibility (REQUIRED)
- `aria-hidden="true"` on all generative canvases (they're decorative)
- Respect `prefers-reduced-motion`:
  ```typescript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    // Render a single static frame, then stop
    renderFrame()
    return // Don't start animation loop
  }
  ```
- Never convey information solely through generative art
- Ensure text over generative backgrounds has sufficient contrast

### Dynamic Import
Always lazy-load generative components:

```typescript
import dynamic from 'next/dynamic'

const GenerativeHero = dynamic(
  () => import('@/components/generative/HeroField'),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-zinc-950" />,
  }
)
```

### File Organization
- Components: `components/generative/{Name}.tsx`
- Shared utilities: `lib/generative/noise.ts`, `lib/generative/rng.ts`
- CSS techniques: Add to `globals.css` under a `/* Generative Art */` section

## Creative Process Checklist

1. **Philosophy first** — Write 3-5 sentences about the algorithmic intent
2. **Choose approach** — Canvas / CSS / WebGL based on complexity
3. **Seed everything** — Deterministic output from any seed value
4. **Theme-aware colors** — Read from CSS variables
5. **Performance budget** — Mobile particle count, DPR cap, visibility pause
6. **Accessibility** — `aria-hidden`, reduced motion, contrast over art
7. **Dynamic import** — `ssr: false`, loading fallback
8. **Test across themes** — Verify it looks good on monochrome, warm, and cool themes

## After Building

1. Add component to dynamic imports if Canvas/WebGL-based
2. Verify mobile performance (test at 3x CPU slowdown in DevTools)
3. Check `prefers-reduced-motion` renders a static frame
4. Ensure text readability over the generative background
5. Test with 3+ different venue themes
