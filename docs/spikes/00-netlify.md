# Spike 0 — Payload on Netlify (2026-11-05)

| Check | How | Result | Notes |
|---|---|---|---|
| Build succeeds, migrations run | Netlify deploy log shows `payload migrate` + `next build` | PASS | Deploy ready in 78 s. Prod DB has 12 tables; `payload_migrations`: initial (1), users_roles (2), markets (3). No dev-push (batch -1) rows. |
| Admin login + create first user | https://ccm-lab.netlify.app/admin | PASS | Owner created the first admin while Netlify team-login protection was on; role is admin after the users_roles migration. |
| Media upload → R2 → renders | upload image in Media | PARTIAL | R2 credentials verified (list/put/delete on `ccm-lab-media` and `ccm-lab-backups`). Upload through the admin on Netlify pending user check. |
| Cold admin load time | first /admin load after 10 min idle (Neon suspended) | PENDING | User observation needed (seconds). |
| Warm public page TTFB | `curl -w "%{time_starttransfer}\n"` | PASS | ~0.27 s (Netlify Durable cache hit). |
| Admin edit → public page updates (revalidation) | change Lab status message; reload `/` | PARTIAL | Job-driven revalidation verified: heartbeat updated cached / immediately: never → 1:38:10 PM CT. Admin-UI edit pending user check. |
| Scheduled function runs | cron-heartbeat logs; heartbeat time advances | PASS | cron-heartbeat ran unattended at 2:00:42 PM CT. |
| Manual cron call | curl POST with secret → 200; wrong secret → 401 | PASS | Wrong secret 401; right secret 200 `{ok:true}` in 0.56 s. |
| Function bundle size warnings | deploy log | PASS | Server handler ~32.8 MB, cron-heartbeat ~0.34 MB, no build warnings. |

## Notes
- Netlify site lives in a separate CCM Netlify account.
- Team-login protection is now non-production only (previews require Netlify login). Production public site sits behind the app's own lab passcode gate. Verified: cached pages cannot bypass it, RSC requests are gated, on-site redirects work, cookie is Secure HttpOnly 30-day, noindex header + robots disallow.

## Spike 5 — email
PENDING — Resend not configured yet.

**Verdict:** PASS — platform viable; pending items are user confirmations, not blockers.
