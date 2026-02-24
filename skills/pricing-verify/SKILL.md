---
name: pricing-verify
description: Verify pricing calculations — fee math, payment modes, server-side validation, deposit vs charge distinction
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob
argument-hint: "[file-or-flow]"
---

# Pricing & Financial Verification

Trace and verify all pricing calculations, fee structures, and payment flows for correctness.

If `$ARGUMENTS` specifies a file or flow (e.g., "checkout", "deposits", "promo codes"), focus the audit there. Otherwise, audit the full pricing pipeline.

## The Financial Pipeline

```
Bottle selection (pricing-utils.ts)
  → Dynamic pricing multiplier (dynamic-pricing.ts)
  → Add-ons: LED signs, extra guests
  → Promo code discount (server-verified)
  → Subtotal calculation
  → Processing fee: 3.3% of subtotal + $0.30
  → Payment mode split: deposit (15%) / full / split
  → LINQ payment intent creation
  → Webhook confirmation
  → Database storage
```

## Verification Checks

### Check 1: Revenue Formula Consistency
The canonical revenue formula is:
```
revenue = bottleSubtotal + signsSubtotal + extraGuestsSubtotal - promoDiscount
```

Search for all places revenue is calculated and verify they use this formula — NOT `minimumSpend`.

Key files to check:
- `lib/pricing-utils.ts`
- `app/api/bookings/route.ts`
- `app/admin/dashboard/page.tsx` (revenue displays)
- `app/api/cron/daily-sales-report/route.ts`
- Any admin analytics/reporting routes

### Check 2: Processing Fee Calculation
Formula: `subtotal * 0.033 + 0.30`

Search for processing fee calculations and verify:
- The percentage is 3.3% (0.033), not 3% or 3.5%
- The flat fee is $0.30
- The fee is calculated on the subtotal (after discount), not the pre-discount total
- Fee is stored in `processingFee` field

### Check 3: Three Payment Modes
Every payment-related code path must handle all three modes:
1. **Deposit (15%)** — `depositAmountPaid` = 15% of subtotal, LINQ charges deposit + fee
2. **Full payment** — `depositAmountPaid` = full subtotal, LINQ charges full + fee
3. **Split payment** — `depositAmountPaid` = per-person split amount

Search for payment mode handling and verify:
- All three modes exist in `create-payment-intent/route.ts`
- Checkout UI shows correct amounts for each mode
- Webhook handles all three correctly
- Confirmation page displays correct amounts

### Check 4: `depositAmountPaid` vs LINQ Charge
`depositAmountPaid` stores the **deposit/payment amount**, NOT the total LINQ charge (which includes processing fee).

```
Total LINQ charge = depositAmountPaid + processingFee
```

Search for anywhere `depositAmountPaid` is used and verify:
- It's not confused with the total charge amount
- When showing "amount paid" to users, it shows `depositAmountPaid` (what they paid toward the bill)
- When reconciling with LINQ, it uses `depositAmountPaid + processingFee` (what was actually charged)

### Check 5: Server-Side Promo Code Verification
Promo code discounts MUST be verified server-side. The client can send any discount amount.

Check:
- `app/api/bookings/route.ts` — does it re-validate the promo code?
- `app/api/linq/create-payment-intent/route.ts` — does it recalculate with server-verified discount?
- Is there any path where the client-provided discount amount is trusted without verification?

### Check 6: Add-On Recalculation
When add-ons change (LED signs, extra guests), totals must be recalculated.

Check:
- `lib/store/booking-store.ts` — do total-dependent values update when add-ons change?
- `lib/pricing-utils.ts` — are add-on prices correctly included in subtotal?
- Checkout page — does the displayed total update in real-time when add-ons toggle?

### Check 7: Prisma Select Clauses
All financial fields must be included in `select` clauses or TypeScript build fails.

Required financial fields (check all reservation queries):
- `bottleSubtotal`
- `signsSubtotal`
- `extraGuestsSubtotal`
- `promoDiscount`
- `depositAmountPaid`
- `processingFee`
- `minimumSpend`

Search for `prisma.reservation.findMany` and `prisma.reservation.findUnique` with `select` clauses and verify all financial fields are present.

### Check 8: Dynamic Pricing Integration
Verify that dynamic pricing multipliers are applied correctly:
- Multiplier is fetched from `lib/dynamic-pricing.ts`
- Applied to base bottle prices, NOT to add-ons or fees
- Stored or traceable for admin review
- Admin can see/set multipliers

## Report Format

For each check:
```
Check N: [title]
Status: PASS | FAIL | WARNING
Details: <findings>
Files: <affected files with line numbers>
Fix: <specific fix if needed>
```

Summary at the end:
- Total checks: N
- Passed: N
- Failed: N (with brief description of each failure)
- Warnings: N
