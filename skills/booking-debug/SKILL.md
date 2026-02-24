---
name: booking-debug
description: Debug booking and payment flow issues — traces the full reservation lifecycle with project-specific knowledge
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(curl *)
argument-hint: "<issue-description>"
---

# Booking & Payment Flow Debugger

Debug a booking or payment issue using deep knowledge of the Cantina Booking flow.

**Issue:** $ARGUMENTS

## The Booking Flow (reference)

```
Customer selects date/time/guests
  → app/booking/checkout/page.tsx
  → lib/store/booking-store.ts (Zustand state)

Customer selects bottles
  → app/booking/bottles/page.tsx
  → lib/pricing-utils.ts (calculates totals)
  → lib/dynamic-pricing.ts (price multipliers)

Customer pays
  → app/api/linq/create-payment-intent/route.ts
  → LINQ processes payment
  → app/api/linq/webhooks/route.ts (confirms payment)

Booking created
  → app/api/bookings/route.ts (POST handler)
  → lib/table-availability.ts (assigns table)
  → lib/notifications/index.ts (sends confirmations)

Post-booking
  → app/api/cron/booking-reminders/ (day-before reminder)
  → app/api/cron/auto-complete-bookings/ (24h auto-complete)
```

## Debugging Steps

### 1. Identify the Stage
Based on the issue description, determine which stage of the flow is failing:
- **Selection issues** → check availability logic, store state
- **Pricing issues** → check pricing-utils.ts, dynamic-pricing.ts
- **Payment issues** → check LINQ integration, webhook handling
- **Creation issues** → check bookings route, table availability
- **Notification issues** → check notification dispatcher, push/SMS/email

### 2. Load Relevant Files
Read the files for the identified stage. Key things to check:

**Pricing bugs:**
- Revenue formula: `bottleSubtotal + signsSubtotal + extraGuestsSubtotal - promoDiscount`
- Processing fee: `3.3% of subtotal + $0.30`
- `depositAmountPaid` = deposit amount, NOT total LINQ charge
- Three payment modes: deposit (15%), full, split

**Timezone bugs:**
- `reservation.date` is midnight UTC calendar date → use Pattern 1 (no fromZonedTime)
- Near midnight UTC, venue date differs from UTC date
- Check if the query uses the wrong pattern (Pattern 1 vs Pattern 2)

**Availability bugs:**
- Check `lib/table-availability.ts` for the logic
- Verify the date being queried matches storage format
- Check if table inventory exists for the date

**Payment webhook bugs:**
- Verify webhook signature check
- Check if payment status update is atomic
- Verify `depositAmountPaid` vs total charge distinction

### 3. Trace the Data
Follow the data through the flow:
- What does the client send?
- What does the API receive?
- What gets stored in the database?
- What gets returned to the client?

### 4. Propose Fix
Once the root cause is identified:
- Propose a specific fix with code
- Flag if it touches money (needs extra verification)
- Flag if it touches dates (needs timezone pattern check)
- Suggest which tests to run to verify
