#!/usr/bin/env node
// PostToolUse hook: contextual reminders + skill recommendations after file edits
// Matches: Write|Edit tools
// Reads JSON from stdin: { tool_name, tool_input: { file_path, ... } }
// Outputs reminder text to stdout (fed back to Claude as context)

const fs = require('fs');
const path = require('path');

// Track edits across the session for multi-file awareness
const STATE_FILE = path.join(__dirname, '.edit-state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { editedFiles: [], editCount: 0, categories: {} };
  }
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch {}
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = (data.tool_input?.file_path || '').replace(/\\/g, '/');

    if (!filePath) return;

    const state = loadState();
    state.editCount++;
    if (!state.editedFiles.includes(filePath)) {
      state.editedFiles.push(filePath);
    }

    const reminders = [];

    // --- THEME CHECK ---
    const isThemeRelevant =
      filePath.endsWith('.css') ||
      filePath.includes('globals.css') ||
      filePath.includes('lib/config/theme.ts') ||
      (filePath.endsWith('.tsx') && (
        filePath.includes('components/') ||
        filePath.includes('app/')
      ));

    if (isThemeRelevant) {
      state.categories.theme = (state.categories.theme || 0) + 1;
      reminders.push(
        '[HOOK] Theme-sensitive file edited. Remember:',
        '  - Use --color-on-primary for text on primary backgrounds (not text-white)',
        '  - Use --color-on-accent for text on accent backgrounds',
        '  - New hardcoded Tailwind color classes need CSS overrides in globals.css',
        '  - Run /check-theme before finishing if you added colors'
      );
    }

    // --- PRICING / PAYMENT CHECK ---
    const isPricingRelevant =
      filePath.includes('pricing-utils') ||
      filePath.includes('dynamic-pricing') ||
      filePath.includes('api/linq/') ||
      filePath.includes('api/bookings/route') ||
      filePath.includes('booking/checkout') ||
      filePath.includes('store/booking-store') ||
      filePath.includes('api/promo-codes');

    if (isPricingRelevant) {
      state.categories.pricing = (state.categories.pricing || 0) + 1;
      reminders.push(
        '[HOOK] Payment/pricing file edited. Remember:',
        '  - Revenue = bottleSubtotal + signsSubtotal + extraGuestsSubtotal - promoDiscount',
        '  - Processing fee = subtotal * 0.033 + 0.30',
        '  - Handle all 3 payment modes: deposit (15%), full, split',
        '  - depositAmountPaid = deposit amount, NOT total LINQ charge',
        '  - Verify promo discounts server-side',
        '  - Consider running /pricing-verify when done'
      );
    }

    // --- API ROUTE / SECURITY CHECK ---
    const isApiRoute = filePath.includes('app/api/');
    const isNewFile = data.tool_name === 'Write';

    if (isApiRoute) {
      state.categories.api = (state.categories.api || 0) + 1;
      reminders.push(
        '[HOOK] API route edited. Remember:',
        '  - Verify auth checks (JWT/session/cron secret) are in place',
        '  - If NEW route: add to __tests__/security/auth-enforcement.test.ts',
        '  - Run npm run test:security to verify auth enforcement'
      );

      if (isNewFile) {
        reminders.push(
          '  - NEW API route detected — run /test-scaffold ' + filePath + ' to generate tests'
        );
      }
    }

    // --- TIMEZONE CHECK ---
    const isTimezoneRelevant =
      filePath.includes('api/cron/') ||
      filePath.includes('api/bookings/') ||
      filePath.includes('api/availability/') ||
      filePath.includes('table-availability') ||
      filePath.includes('notifications/') ||
      filePath.includes('date-utils');

    if (isTimezoneRelevant) {
      state.categories.timezone = (state.categories.timezone || 0) + 1;
      reminders.push(
        '[HOOK] Date/time file edited. Remember:',
        '  - reservation.date / event.date -> Pattern 1 (NO fromZonedTime)',
        '  - createdAt / checkedInAt -> Pattern 2 (WITH fromZonedTime)',
        '  - Duration checks (subHours etc.) -> use real new Date(), NOT venueNow',
        '  - Run /audit-timezone before finishing'
      );
    }

    // --- MIDDLEWARE / AUTH CHECK ---
    if (filePath.includes('middleware.ts') || filePath.includes('lib/auth')) {
      state.categories.auth = (state.categories.auth || 0) + 1;
      reminders.push(
        '[HOOK] Auth/middleware edited — security-critical:',
        '  - Run npm run test:security (61+ auth enforcement tests)',
        '  - Verify route protection coverage is complete'
      );
    }

    // --- PRISMA SCHEMA CHECK ---
    if (filePath.includes('prisma/schema.prisma')) {
      state.categories.prisma = (state.categories.prisma || 0) + 1;
      reminders.push(
        '[HOOK] Prisma schema edited. Remember:',
        '  - Add new fields to all relevant select clauses or build will fail',
        '  - Financial fields (bottleSubtotal, etc.) MUST be in select clauses',
        '  - Run /db-migrate to create and apply migration'
      );
    }

    // --- NOTIFICATION FILES ---
    if (filePath.includes('notifications/') || filePath.includes('api/push/') ||
        filePath.includes('lib/emails/') || filePath.includes('sms.ts')) {
      state.categories.notifications = (state.categories.notifications || 0) + 1;
      reminders.push(
        '[HOOK] Notification file edited. Remember:',
        '  - Check all 3 channels: push, SMS, email',
        '  - Verify VAPID/Twilio/Resend credentials are from env vars',
        '  - Test with /notification-debug if delivery issues arise'
      );
    }

    // --- ACCESSIBILITY (booking flow) ---
    if (filePath.includes('booking/') && filePath.endsWith('.tsx')) {
      state.categories.a11y = (state.categories.a11y || 0) + 1;
      // Only remind occasionally, not every edit
      if (state.categories.a11y === 1 || state.categories.a11y % 5 === 0) {
        reminders.push(
          '[HOOK] Customer-facing booking component edited.',
          '  - Touch targets: 44px minimum for buttons/links',
          '  - Forms: labels + aria-required + error states with aria-describedby',
          '  - Consider /a11y-audit on the booking flow when feature is complete'
        );
      }
    }

    // --- ANIMATION / MOTION ---
    if (filePath.includes('animate') || filePath.includes('motion') ||
        filePath.includes('framer') || filePath.includes('three') ||
        filePath.includes('lottie') || filePath.includes('canvas')) {
      reminders.push(
        '[HOOK] Animation/motion file edited. Remember:',
        '  - Respect prefers-reduced-motion (globals.css has global rule)',
        '  - Reduce complexity on mobile (useIsMobile)',
        '  - Use transform/opacity only (avoid layout-triggering properties)',
        '  - Dynamic import heavy libs (Three.js, Lottie) with ssr: false'
      );
    }

    // --- MULTI-FILE AWARENESS ---
    // After 5+ files edited, suggest a review
    if (state.editedFiles.length === 5) {
      reminders.push(
        '[HOOK] 5+ files edited this session. Consider running /review-changes before wrapping up.'
      );
    }

    // After 10+ files, stronger suggestion
    if (state.editedFiles.length === 10) {
      reminders.push(
        '[HOOK] 10+ files edited. Strongly recommend /review-changes or /ship-it before deploying.'
      );
    }

    saveState(state);

    if (reminders.length > 0) {
      process.stdout.write(reminders.join('\n') + '\n');
    }
  } catch (e) {
    // Silent fail — never break Claude's workflow
  }
});
