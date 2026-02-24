---
name: notification-debug
description: Debug notification delivery issues — trace push, SMS, and email paths, check subscriptions, verify triggers and settings
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash(curl *), Bash(npx prisma *)
argument-hint: "<issue-description>"
---

# Notification Debugger

Debug a notification delivery issue using deep knowledge of the three-channel notification system (push, SMS, email).

**Issue:** $ARGUMENTS

## The Notification Architecture

```
Trigger Event (booking, assignment, cron, etc.)
  → lib/notifications/index.ts (dispatcher)
    → Settings check (is channel enabled?)
    → Channel dispatch:
       ├── Push  → lib/notifications/push.ts → Web Push API → Service Worker
       ├── SMS   → lib/notifications/sms.ts  → Twilio API → Phone
       └── Email → lib/emails/*.tsx          → Resend API → Inbox
    → Database log → Notification table (success/failure recorded)
```

## Debugging Steps

### 1. Identify the Channel and Trigger

Based on the issue description, determine:
- **Which channel?** Push / SMS / Email / All
- **Which trigger?** Booking confirmation, staff assignment, reminder, etc.

Map the trigger to its dispatch function in `lib/notifications/index.ts`:
| Trigger | Dispatch Function |
|---------|------------------|
| New booking | `sendBookingConfirmation()` + `sendAdminNewBookingAlert()` + `sendAdminNewBookingEmailAlert()` |
| Staff assigned | `sendStaffAssignment()` |
| Check-in | `sendCheckInWelcome()` |
| Order placed | `sendOrderConfirmation()` + `sendStaffNewOrderNotification()` |
| Day-before reminder | Cron: `app/api/cron/booking-reminders/route.ts` |
| Tonight's summary | Cron: `app/api/cron/staff-daily-summary/route.ts` |
| Ticket purchase | `sendTicketConfirmation()` |

### 2. Check Configuration

#### Push Notifications
- **VAPID keys set?** Check `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` env vars
- **Subscriptions exist?** Check `PushSubscription` table in database
- **Service worker registered?** Check `public/sw.js` exists and is served correctly
- **Permission granted?** Browser must have granted notification permission

Read `lib/notifications/push.ts` and check:
- `sendPushToAll()` — fetches ALL active subscriptions
- `sendPushToStaff()` — fetches subscriptions for specific staff IDs
- `sendPushToAdmins()` — fetches subscriptions with `role: 'admin'`
- Auto-cleanup: expired subscriptions (410/404) are batch-deleted

#### SMS
- **Twilio credentials set?** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- **SMS enabled?** `SMS_ENABLED` env var must be `"true"`
- **Phone format valid?** Must be E.164 format (`+1XXXXXXXXXX`)
- **`formatPhoneNumber()`** assumes US if no country code — international needs `+`

#### Email
- **Resend configured?** `RESEND_API_KEY` env var
- **From address set?** `VENUE_EMAIL_FROM`, `VENUE_EMAIL_FROM_NAME`
- **Admin emails configured?** Check notification settings in database
- **Rate limiting:** 600ms stagger between admin emails to avoid Resend 429 errors

### 3. Check Settings

Read notification settings from database:
```
settings.key = 'notifications'
```

This controls:
- Which channels are enabled per notification type
- Admin email addresses for alerts
- Admin phone numbers for SMS alerts
- Custom message templates

Also check `lib/config/features.ts`:
- `FEATURE_SMS_NOTIFICATIONS` — master SMS toggle
- `FEATURE_EMAIL_NOTIFICATIONS` — master email toggle

### 4. Trace the Code Path

For the specific trigger, read the dispatch function and trace:
1. **Is the function called?** Check the caller (API route, cron job, etc.)
2. **Are settings checked?** `getNotificationSettings()` gate
3. **Is the channel dispatch reached?** Conditional on settings
4. **Is the external API called?** Web Push / Twilio / Resend
5. **Is the result logged?** `logNotification()` records success/failure

### 5. Check the Notification Log

Query the `Notification` table for recent entries:
- `type` — which notification type
- `channel` — push/sms/email
- `status` — sent/failed/pending
- `error` — error message if failed
- `recipientId` — who it was for
- `createdAt` — when it was attempted

### 6. Common Failure Points

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Push not received | Missing VAPID keys | Set env vars |
| Push not received | Expired subscription | User re-enables in browser |
| Push not received | No subscription in DB | User hasn't toggled push on |
| SMS not received | Twilio credentials missing | Set env vars |
| SMS not received | Invalid phone format | Check `formatPhoneNumber()` |
| SMS not received | `SMS_ENABLED !== "true"` | Set env var |
| Email not received | Resend API key missing | Set env var |
| Email not received | Rate limited (429) | Check timing of sends |
| Email in spam | Missing SPF/DKIM | Configure DNS for sending domain |
| No notification at all | Settings disabled | Check admin notification settings |
| No notification at all | Feature flag off | Check `features.ts` |
| Wrong timing | Timezone issue | Cron uses UTC, check venue timezone conversion |

### 7. Propose Fix

Once root cause is identified:
- Provide specific fix with code
- If it's a config issue, list the exact env vars/settings to change
- If it's a code issue, identify the file and line
- Suggest a test to verify the fix works
