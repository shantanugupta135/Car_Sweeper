# Connecting the admin portal to the live CarsGlow database

The portal talks to the **same Supabase project as the mobile app**
(`sweeper-clean-expoapp`), using the **same public credentials** — project URL
and anon key. There is no extra secret to obtain.

## Roles

`profiles.role` has exactly three values, and they are the same string
everywhere — database, RLS policies, edge functions, mobile app, web app:

| role | who | sees |
|---|---|---|
| `admin` | the product owner | everything, across every society. Web portal only |
| `cleaner` | cleans cars | jobs and vehicles in their assigned society |
| `owner` | a car owner / subscriber | their own vehicles, washes and history |

`is_admin()` in the database is simply `role = 'admin'` — there is no
society-scoped manager tier. (The original schema called this `society_admin`;
the admin_portal migration renames it and rewrites the CHECK constraint.)

## Where authority comes from

The anon key grants nothing on its own. Every admin request carries the
signed-in admin's JWT, and the `admin` RLS policies decide what that
person may read and write. If someone lifts the anon key out of the bundle,
they still cannot see a single subscriber record.

One operation cannot be expressed as an RLS policy: creating a cleaner's
`auth.users` row. That lives in the **`admin-provision-cleaner` edge function**,
where Supabase injects the service role key automatically — so the key stays
inside Supabase and never has to be copied into this app's environment.

```
Browser (anon key + admin JWT)
   │
   ├─▶ /api/admin/*            Next.js route handler
   │      │                    re-checks role = admin
   │      └─▶ Supabase          queries run AS THE ADMIN, filtered by RLS
   │
   └─▶ POST /api/admin/cleaners
          └─▶ admin-provision-cleaner   (edge function, service role)
                 └─▶ auth.users + profiles
```

`SUPABASE_SERVICE_ROLE_KEY` is supported but **optional** — setting it merely
skips the edge function. Leave it blank.

---

## 1. Apply the migrations

From `sweeper-clean-expoapp`:

```bash
supabase db push
```

| Migration | What it adds |
|---|---|
| `20260701000000_init_schema.sql` | base tables + RLS (already applied) |
| `20260720*` | notification triggers, interior clean day, push token |
| **`20260728000000_admin_portal.sql`** | admin columns, `admin` policies, `generate_daily_jobs()`, photo bucket, and the fix for the recursive `profiles` policy |
| **`20260728010000_push_delivery.sql`** | forwards new notification rows to `send-push` |

> **The live project is currently on the pre-admin schema** — `societies.towers`,
> `profiles.assigned_towers` and `generate_daily_jobs()` do not exist yet, so
> `db push` is the first thing to run.

> The recursion fix is not optional: the original `profiles` SELECT policy
> contained `SELECT ... FROM profiles`, which Postgres rejects with *"infinite
> recursion detected in policy for relation profiles"*. Anything that reads a
> profile — including login — fails until `20260728000000` is applied.

## 2. Deploy the edge functions

```bash
supabase functions deploy \
  admin-provision-cleaner auth-otp create-payment-order \
  razorpay-webhook sync-cleaner-offline send-push
```

`admin-provision-cleaner` is the only one the portal needs. Secrets for the rest:

```bash
supabase secrets set \
  RAZORPAY_KEY_ID=...         \
  RAZORPAY_KEY_SECRET=...     \
  RAZORPAY_WEBHOOK_SECRET=... \
  PUSH_HOOK_SECRET=$(openssl rand -hex 32)

# Dev/staging only — enables the 123456 OTP bypass. Never on production.
supabase secrets set ALLOW_DEV_OTP=true
```

For push delivery, tell the database where to call:

```sql
ALTER DATABASE postgres SET app.settings.functions_url =
  'https://<project-ref>.supabase.co/functions/v1';
ALTER DATABASE postgres SET app.settings.push_hook_secret = '<PUSH_HOOK_SECRET>';
```

Until both settings exist the trigger is inert — notifications still appear
in-app, they just are not pushed.

## 3. Configure the portal

`Car_Sweeper-main/.env.local` (already filled in):

```
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key — same as the mobile .env>
SUPABASE_SERVICE_ROLE_KEY=          # leave blank
```

Set `NEXT_PUBLIC_API_MODE=mock` to go back to seed data at any time.

## 4. Create the first admin

No service role key required:

1. Supabase dashboard → **Authentication → Users → Add user**
   (email + password, tick **Auto Confirm User**)
2. Supabase dashboard → **SQL Editor** → run
   [`scripts/bootstrap-admin.sql`](../scripts/bootstrap-admin.sql), editing the
   email and name at the top.

Then sign in at `/admin`.

If you *do* have the service key handy, `npm run create-admin <email> <password> "<name>"`
does both steps in one go.

---

## How a cleaner gets from the portal into the app

```
Admin portal                          Database                       Mobile app
────────────────────────────────────────────────────────────────────────────────
Cleaners › Add New Cleaner
  name, phone, society, towers,
  capacity
        │
        ├─ POST /api/admin/cleaners
        │    └─ admin-provision-cleaner
        │         (re-verifies the caller
        │          is an admin)         
        │
        ├──────────────────────────▶ auth.users
        │                             phone = +91XXXXXXXXXX
        │                             phone_confirm = true
        │
        └──────────────────────────▶ profiles
                                      role = 'cleaner'
                                      society_id, assigned_towers,
                                      max_daily_capacity, access_pin
                                                │
                                                │   cleaner enters the same
                                                │   number on the login screen
                                                ▼
                                      verifyOtp ─────────────▶ profile found,
                                                               role = 'cleaner',
                                                               isNewUser = false
                                                                     │
                                                                     ▼
                                                            /(cleaner-tabs)
```

Routing lives in `app/(auth)/login.tsx` → `destinationFor()`, with the
cold-start equivalent in `app/index.tsx`.

## The daily loop

1. **Live Monitor › Generate Roster** calls `generate_daily_jobs()`. For every
   vehicle whose owner has an active subscription and whose schedule is not
   paused, it inserts one `waiting` job and assigns the best-matching active
   cleaner — tower match first, then least loaded under their daily capacity.
   Idempotent, and it refuses to run for anyone who is not an admin.
2. Cleaners see those jobs in the mobile app's Tasks tab.
3. Completing a wash uploads before/after photos to the `wash-photos` bucket and
   calls `sync-cleaner-offline`, which writes the `service_record`, the
   `wash_photo_set`, and flips the job to `completed`. With no signal the
   completion is queued on the device and drained on the next launch.
4. Triggers write `notifications` rows; `send-push` delivers them.
5. Owners see the wash in History, view photos, rate it, or raise a complaint —
   which lands in the portal's Complaints desk, linked to the job.
6. Resolving it writes a resolution note; the trigger sends that to the
   subscriber as a notification.

## Mode differences

| | mock | real |
|---|---|---|
| Data source | `lib/mock-admin-data.ts` | Supabase via `/api/admin/*` |
| Admin sign-in | any credentials | Supabase password auth + `admin` role check |
| Writes | in-memory, lost on refresh | persisted |
| Generate Roster | no-op | inserts jobs |
| Header badge | "MOCK DATA" shown | hidden |

`lib/config.ts` holds the switch; `lib/services/admin-service.ts` picks
`MockAdminService` or `HttpAdminService` behind one `AdminApi` interface — the
screens are identical either way.

## Verification

```bash
# Car_Sweeper-main
npm run typecheck && npm run build

# sweeper-clean-expoapp
npx tsc --noEmit && npx expo lint
```
