---
name: review-themes
description: Review all UI themes for visual quality — contrast ratios, color harmony, readability, hierarchy, and aesthetic coherence
disable-model-invocation: false
user-invokable: true
argument-hint: "[theme-name|all]"
---

# Theme Visual Quality Review

Run the automated theme review script and interpret the results.

## Step 1: Run the Script

```bash
# If a specific theme was requested:
npx tsx scripts/review-themes.ts --theme $ARGUMENTS

# Otherwise, review all themes:
npx tsx scripts/review-themes.ts
```

## Step 2: Interpret Results

Read the output and provide:
1. A plain-English summary of the findings
2. Highlight any CRITICAL or FAIL results — these need fixing
3. For themes that NEED WORK or FAIL, suggest specific hex color replacements that would fix the issues while maintaining the theme's aesthetic identity
4. If all themes PASS, confirm the theme system is in good shape

## What the Script Checks

- **WCAG contrast ratios** — 17 critical color pairs (text on backgrounds, button text, border visibility, card elevation)
- **Color harmony** — hue differentiation, warm/cool balance, saturation consistency
- **Readability** — text hierarchy (primary > secondary > muted), surface elevation, hover states
- **Background depth** — monotonic luminance progression through bg and surface layers

## Related Skills

- `/check-theme` — audits code for hardcoded colors that break theming (different purpose)
- `/a11y-audit` — broader accessibility audit including keyboard nav, ARIA, focus management
