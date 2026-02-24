# Example Prompts & Skill Usage Guide

> Proven prompts that work well with the toolkit skills.
> Copy-paste these into Claude Code and adapt for your project.

---

## How Skills Work

Skills are invoked by typing `/skill-name` in the Claude Code chat. Some activate automatically (like `/frontend-design`), others you invoke manually.

**Two ways to use skills:**

1. **Direct invoke**: Type `/skill-name` and it runs
   ```
   /animate hero section
   ```

2. **Natural language + skill**: Describe what you want, Claude auto-activates the right skill
   ```
   Build me a hero section with a 3D rotating globe
   → Claude activates /frontend-design (auto) + uses /3d-scene knowledge
   ```

**Tip:** You can chain skills. Build something with one skill, then refine with another:
```
Step 1: /landing-page full          → builds entire page
Step 2: /animate features section   → adds scroll animations to features
Step 3: /perf-audit                 → checks performance before deploy
```

---

## Landing Page — Full Build

### Start from scratch
```
/landing-page full
```
Claude will check for your CLAUDE.md and BRAND-BRIEF.md, then build section by section.

### Build a specific section
```
/landing-page hero
/landing-page pricing
/landing-page testimonials
```

---

## Design & Style

### Get design direction
```
/ui-ux-pro-max

I'm building a landing page for [company]. We're a [industry] company targeting
[audience]. The mood should be [adjectives]. Show me style options.
```

### Get a color palette
```
/ui-ux-pro-max

Suggest 3 color palettes for a [mood] landing page. We want to feel [trustworthy /
bold / playful / premium]. Our brand color is [hex].
```

### Get font pairings
```
/ui-ux-pro-max

Suggest font pairings for a [style] landing page. Headings should feel [bold /
elegant / modern / playful]. Body should be highly readable.
```

---

## Hero Sections

### Classic SaaS hero
```
Build a hero section with:
- Bold headline: "[Your headline]"
- Subheadline: "[Your subheadline]"
- Primary CTA button: "[CTA text]"
- Secondary link: "Learn more →"
- Product screenshot or mockup on the right
- Full viewport height, centered on mobile
```

### Hero with video background
```
Build a full-bleed hero with a looping background video.
The video file is at /public/hero-video.mp4.
Overlay with dark gradient so white text is readable.
Headline: "[text]", CTA: "[text]"
```

### Hero with 3D element
```
/3d-scene

Build a hero section with an interactive 3D element — [describe: rotating product,
particle field, floating geometric shapes, globe with connection lines].
It should respond to mouse movement subtly. Use React Three Fiber.
```

### Hero with animated text
```
/animate hero headline

Animate the hero headline with a typewriter effect / word-by-word reveal /
gradient text shimmer. Use Motion (Framer Motion).
```

---

## Feature Sections

### Bento grid
```
Build a features section as a bento grid layout — mixed card sizes (1x1, 2x1, 1x2).
Each card has an icon, title, and short description.

Features:
1. [Feature] — [description]
2. [Feature] — [description]
3. [Feature] — [description]
4. [Feature] — [description]
```

### Alternating left/right
```
Build a features section with alternating layout — image left / text right,
then text left / image right. Each feature has a heading, paragraph, and
a small visual or screenshot.
```

### Interactive feature tabs
```
Build a features section with tabs at the top. Clicking a tab reveals
the feature details below with a smooth crossfade animation.
Include a visual/screenshot for each feature.
```

---

## Animations

### Page entrance animations
```
/animate page entrances

Add subtle fade-up entrance animations to all sections on the landing page.
Each section should animate in as it enters the viewport. Stagger children
within sections (cards, list items). Keep it subtle — 300ms, 12px offset.
```

### Scroll-triggered animations
```
/animate scroll reveal

Add scroll-triggered animations to the features section. Cards should fade in
and slide up as they enter the viewport, staggered left to right.
Use Framer Motion's useInView hook.
```

### Micro-interactions
```
/animate micro-interactions

Add hover micro-interactions to:
- CTA buttons: subtle scale + shadow lift
- Feature cards: border color transition + shadow
- Navigation links: underline slide-in from left
- Social icons: color transition + slight bounce
```

### Number counter animation
```
/animate metrics section

Build a metrics/stats bar with animated counters that count up when
the section enters the viewport:
- "2,000+" teams
- "99.9%" uptime
- "4.9/5" rating
- "$2M+" saved
```

---

## 3D & Motion Graphics

### 3D product showcase
```
/3d-scene product showcase

Create a 3D product showcase where the product [rotates slowly / responds to
mouse movement / can be dragged to rotate]. Use React Three Fiber.
The product model is at [path] (or create a stylized 3D representation of [describe]).
```

### Particle background
```
/motion-graphics particle background

Create a subtle particle animation for the hero background. Dots floating
slowly, connecting with lines when close to each other. Colors: [brand colors].
Should not distract from the content. Use Canvas for performance.
```

### Animated logo
```
/motion-graphics logo animation

Animate our logo SVG for the page load. It should draw in stroke-by-stroke,
then fill with color. Duration: 1.5s. Only plays once on initial load.
```

---

## From Figma Designs

### Convert a full page
```
/openai-figma

Here's the Figma URL for our landing page design: [paste Figma URL]
Convert this to Next.js components with Tailwind CSS. Match the spacing,
typography, and colors exactly.
```

### Convert a specific section
```
/openai-figma

Convert this Figma frame to a React component: [paste Figma URL with node ID]
Use responsive Tailwind classes. The design is desktop — make it mobile-responsive.
```

---

## AI Image Generation

### Hero background image
```
Use the fal MCP to generate a hero background image.
Prompt: "[describe the image you want]"
Style: [photographic / illustrated / abstract / 3D rendered]
Aspect ratio: 16:9, high resolution.
Save to public/images/hero-bg.webp
```

### Section illustrations
```
Use fal to generate illustrations for each feature section:
1. [Feature 1] — [visual description]
2. [Feature 2] — [visual description]
3. [Feature 3] — [visual description]
Style: [flat illustration / isometric / line art / 3D]. Consistent style across all.
```

---

## Pre-Launch Checks

### Performance audit
```
/perf-audit

Audit the landing page for performance. Check:
- Lighthouse score targets (95+ performance)
- Image optimization (WebP, proper sizing, lazy loading)
- Bundle size (flag any heavy client components)
- Font loading (no layout shift)
- Core Web Vitals
```

### Accessibility audit
```
/a11y-audit

Audit the landing page for accessibility:
- Heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- Color contrast ratios (WCAG AA)
- Keyboard navigation (tab order, focus indicators)
- Screen reader compatibility
- Touch targets (44px minimum)
```

### Full review
```
/review-changes

Review all changes on this branch. Check for:
- Responsive issues
- Hardcoded values that should be variables
- Missing alt text or aria labels
- Performance anti-patterns
- Any code that doesn't match the CLAUDE.md conventions
```

### Ship it
```
/ship-it

Run the full deployment pipeline — build, tests, code review, and audits.
Flag anything that needs fixing before we deploy.
```
