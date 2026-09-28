# 06 — Contact & Notifications

## Form fields
name (2–60), email (valid), subject (optional, ≤120), message (10–2000), hidden honeypot `website`.

## Server flow
1. Rate limit: 3 requests / hour / IP.
2. Zod validate; if honeypot filled → return 200 silently, don't store.
3. Strip HTML from all fields.
4. Save Message (hash IP with SHA-256 + salt).
5. Return generic success. (No email notification — messages are read in the admin inbox.)

## Optional
Cloudflare Turnstile / hCaptcha if spam appears.

## Acceptance
- 4th submission within an hour → 429.
- Message visible in admin inbox with status `new`.
