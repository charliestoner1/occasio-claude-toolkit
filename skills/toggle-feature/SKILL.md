---
name: toggle-feature
description: List, toggle, or set feature flags and booking mode in .env for local dev
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: "[flagName] [true|false] | --list | booking-mode [nightclub|festival]"
---

# Toggle Feature Flag

Toggle feature flags and booking mode in `.env` files for local development.

**Target:** $ARGUMENTS

## Arguments

- `/toggle-feature --list` — Show all flags with current .env values, grouped by category
- `/toggle-feature <flagName>` — Toggle a flag (true/false) in .env
- `/toggle-feature <flagName> true|false` — Set a flag to a specific value
- `/toggle-feature booking-mode nightclub|festival` — Set booking mode

## How It Works

1. Read `lib/config/features.ts` to get the flag-to-env-var mapping from `featureEnvVars`
2. Read the `.env` file to get current values
3. Apply the requested change

## Flag-to-Env-Var Reference

These are defined in `lib/config/features.ts` in the `featureEnvVars` export:

| Flag | Env Var |
|------|---------|
| bottleService | FEATURE_BOTTLE_SERVICE |
| eventPricing | FEATURE_EVENT_PRICING |
| dynamicPricing | FEATURE_DYNAMIC_PRICING |
| recurringEvents | FEATURE_RECURRING_EVENTS |
| timeSlots | FEATURE_TIME_SLOTS |
| splitPayments | NEXT_PUBLIC_FEATURE_SPLIT_PAYMENTS |
| deposits | FEATURE_DEPOSITS |
| remainingBalance | FEATURE_REMAINING_BALANCE |
| payInFull | NEXT_PUBLIC_FEATURE_PAY_IN_FULL |
| aiAssistant | FEATURE_AI_ASSISTANT |
| adminAiAssistant | FEATURE_ADMIN_AI_ASSISTANT |
| assistantAnalytics | FEATURE_ASSISTANT_ANALYTICS |
| smsNotifications | FEATURE_SMS_NOTIFICATIONS |
| emailNotifications | FEATURE_EMAIL_NOTIFICATIONS |
| staffPortal | FEATURE_STAFF_PORTAL |
| customerCrm | FEATURE_CUSTOMER_CRM |
| inventoryManagement | FEATURE_INVENTORY_MANAGEMENT |
| analytics | FEATURE_ANALYTICS |
| floorMap | FEATURE_FLOOR_MAP |
| photoGallery | FEATURE_PHOTO_GALLERY |
| signSelection | FEATURE_SIGN_SELECTION |
| eventTickets | FEATURE_EVENT_TICKETS |
| drinkTickets | FEATURE_DRINK_TICKETS |
| pageBuilder | FEATURE_PAGE_BUILDER |
| multiVenue | FEATURE_MULTI_VENUE |
| customBranding | FEATURE_CUSTOM_BRANDING |
| webhooks | FEATURE_WEBHOOKS |
| apiAccess | FEATURE_API_ACCESS |

Booking mode env var: `NEXT_PUBLIC_BOOKING_MODE`

## Recipes

### `/toggle-feature --list`

1. Read `lib/config/features.ts` — import `featureCategories`, `featureEnvVars`, `featureLabels`
2. Read `.env` file
3. For each category in `featureCategories`, display a table:
   - Flag name (camelCase)
   - Label (human-readable)
   - Env var name
   - Current value in .env (or "not set — default: true/false")
4. Also show current `NEXT_PUBLIC_BOOKING_MODE` value
5. Format as a clean markdown table grouped by category

### `/toggle-feature <flagName>`

1. Look up the env var name from the reference table above
2. Read `.env` file
3. Find the line with that env var:
   - If found and value is `true` → change to `false`
   - If found and value is `false` → change to `true`
   - If NOT found → append `ENV_VAR_NAME=true` at end of file
4. Use the Edit tool to make the change
5. Report: "Toggled `flagName` (`ENV_VAR_NAME`): was X, now Y"
6. Remind: "Restart dev server for env changes to take effect. Or toggle in Admin > Settings > Features for runtime override."

### `/toggle-feature <flagName> <value>`

Same as above but set to the explicit value instead of toggling.

### `/toggle-feature booking-mode <mode>`

1. Read `.env` file
2. Find `NEXT_PUBLIC_BOOKING_MODE=...` line:
   - If found → change the value
   - If not found → append `NEXT_PUBLIC_BOOKING_MODE=<mode>`
3. Report the change
4. Also check for server-side `BOOKING_MODE=` and update that too if present

## After Toggle

Remind the user:
- Restart the dev server (`npm run dev`) for .env changes to take effect
- Alternatively, toggle features in the Admin dashboard (Settings > Features) for runtime changes without restart
- The admin UI overrides take effect within 60 seconds without redeployment
