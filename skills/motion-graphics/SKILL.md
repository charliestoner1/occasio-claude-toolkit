---
name: motion-graphics
description: Create motion graphics — Lottie animations, animated SVGs, Canvas graphics, particle effects, confetti, data visualizations
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm install *)
argument-hint: "<what-to-create>"
---

# Motion Graphics

Create rich visual effects using Lottie, animated SVGs, HTML5 Canvas, and programmatic graphics.

**Target:** $ARGUMENTS

## Library Options

| Library | Best For | Bundle Size |
|---------|---------|-------------|
| **Lottie** (`lottie-react`) | After Effects animations as JSON, complex character animations, premium loading states | ~50KB |
| **SVG + CSS** | Animated icons, progress indicators, morphing shapes, line draws | 0KB (native) |
| **Canvas** (`react-konva`) | Floor plan rendering, image manipulation, custom paint tools | ~150KB |
| **Confetti** (`canvas-confetti`) | Celebration effects on booking confirmation | ~6KB |
| **Rive** (`@rive-app/react-canvas`) | Interactive state-based animations, animated buttons | ~150KB |

## Lottie Animations

### Setup
```bash
npm install lottie-react
```

### Basic Usage
```typescript
'use client'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

import successAnimation from '@/public/animations/success.json'

export function SuccessAnimation() {
  return (
    <Lottie
      animationData={successAnimation}
      loop={false}
      autoplay
      style={{ width: 200, height: 200 }}
    />
  )
}
```

### Controlled Lottie
```typescript
'use client'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import type { LottieRefCurrentProps } from 'lottie-react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export function InteractiveLottie({ animationData }: { animationData: object }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
      />
    </div>
  )
}
```

### Where to Get Lottie Animations
- **LottieFiles** (lottiefiles.com) — largest library of free/paid Lottie animations
- **IconScout** — animated icons as Lottie
- Store JSON files in `public/animations/`
- Keep files under 100KB for mobile performance

### Good Use Cases for This Project
- Booking confirmation: checkmark success animation
- Payment processing: loading animation
- Empty states: animated illustrations
- Onboarding: step-by-step walkthrough animations
- Error states: animated warning/error icon
- Pull-to-refresh: custom loading animation (PWA)

## Animated SVGs

### Line Draw Animation
```tsx
export function AnimatedCheckmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="26" cy="26" r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-[circle-draw_0.6s_ease-in-out_forwards]"
        style={{
          strokeDasharray: 157,
          strokeDashoffset: 157,
        }}
      />
      <path
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[check-draw_0.3s_0.6s_ease-in-out_forwards]"
        style={{
          strokeDasharray: 36,
          strokeDashoffset: 36,
        }}
      />
    </svg>
  )
}

// Add to globals.css:
// @keyframes circle-draw { to { stroke-dashoffset: 0; } }
// @keyframes check-draw { to { stroke-dashoffset: 0; } }
```

### Morphing SVG Shapes
```tsx
'use client'
import { useState } from 'react'

export function MorphIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path
        d={isActive
          ? 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'  // X
          : 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'  // Hamburger
        }
        fill="currentColor"
        className="transition-all duration-300"
      />
    </svg>
  )
}
```

### Animated Logo
```tsx
export function AnimatedLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16">
      {/* Outer ring - rotates */}
      <circle
        cx="50" cy="50" r="45"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeDasharray="10 5"
        className="animate-[spin_8s_linear_infinite] origin-center"
      />
      {/* Inner glow - pulses */}
      <circle
        cx="50" cy="50" r="30"
        fill="var(--color-primary)"
        opacity="0.1"
        className="animate-pulse"
      />
      {/* Center icon */}
      <text
        x="50" y="55"
        textAnchor="middle"
        fill="var(--color-primary)"
        fontSize="24"
        fontWeight="bold"
      >
        C
      </text>
    </svg>
  )
}
```

### Animated Progress Ring
```tsx
export function ProgressRing({ progress, size = 120 }: { progress: number; size?: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Background ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>
  )
}
```

## Canvas Graphics

### Setup (if needed)
```bash
npm install react-konva konva
```

### Confetti Effect (lightweight)
```bash
npm install canvas-confetti
```

```typescript
'use client'
import confetti from 'canvas-confetti'

export function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#f59e0b', '#ffffff'],
  })
}

// Premium confetti burst (booking confirmation)
export function triggerBookingConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#10b981', '#f59e0b'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#10b981', '#f59e0b'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
```

### Animated Data Visualization
```typescript
'use client'
import { useEffect, useRef } from 'react'

export function AnimatedBarChart({ data }: { data: { label: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const maxValue = Math.max(...data.map(d => d.value))
    let progress = 0

    const animate = () => {
      progress = Math.min(progress + 0.02, 1)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / data.length - 10
      data.forEach((item, i) => {
        const height = (item.value / maxValue) * canvas.height * 0.8 * progress
        const x = i * (barWidth + 10) + 5
        const y = canvas.height - height

        // Bar
        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, height, [4, 4, 0, 0])
        ctx.fill()

        // Label
        ctx.fillStyle = '#a1a1aa'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(item.label, x + barWidth / 2, canvas.height - 5)
      })

      if (progress < 1) requestAnimationFrame(animate)
    }

    animate()
  }, [data])

  return <canvas ref={canvasRef} width={400} height={200} className="w-full" />
}
```

## Project-Specific Rules

### Theme Integration
- Use CSS variable colors in Canvas/SVG: read from `getComputedStyle`
- Lottie files can be tinted with CSS `filter` or by modifying the JSON colors
- Don't hardcode emerald/amber — use the theme system

### Performance
- **Dynamic import** all heavy libraries (`lottie-react`, `react-konva`, `canvas-confetti`)
- **Lazy render** — only render Canvas/Lottie when visible (IntersectionObserver)
- **Mobile**: reduce particle counts, disable Canvas animations on low-end devices
- **Preload** Lottie JSON files for critical animations (confirmation page)

### Accessibility
- `canvas` elements need `aria-label` or `role="img"` with description
- Animated SVGs should respect `prefers-reduced-motion`
- Confetti should be brief and non-blocking
- Don't convey critical information solely through animation

### File Organization
- Lottie JSON: `public/animations/{name}.json`
- Animated SVG components: `components/graphics/{Name}.tsx`
- Canvas utilities: `lib/canvas/{name}.ts`

## Practical Recipes for This Project

| Feature | Approach | Effort |
|---------|---------|--------|
| Booking confirmation confetti | `canvas-confetti` (6KB) | 10 min |
| Animated success checkmark | SVG line-draw (0KB) | 15 min |
| Revenue chart animation | Canvas with easing | 30 min |
| Loading skeleton shimmer | Already exists (`animate-shimmer`) | 0 min |
| Pulsing notification badge | Already exists (`animate-ping`) | 0 min |
| Bottle selection hover | Lottie or CSS scale+glow | 20 min |
| Floor map pin bounce | CSS `@keyframes` bounce | 5 min |
| AI typing indicator | Already exists (`animate-bounce`) | 0 min |
