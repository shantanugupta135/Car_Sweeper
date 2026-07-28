-- =============================================================================
-- CarsGlow — one-shot database setup
--
-- Paste this whole file into the Supabase dashboard > SQL Editor and hit Run.
-- No CLI and no service role key needed: the SQL Editor runs as `postgres`.
--
-- It contains, in order:
--   1. supabase/migrations/20260728000000_admin_portal.sql
--   2. supabase/migrations/20260728010000_push_delivery.sql
--   3. scripts/bootstrap-admin.sql  (promotes anant.aditya10@gmail.com)
--
-- Safe to re-run: every statement is idempotent.
--
-- Generated from the files above. If you edit them, regenerate rather than
-- editing this copy. If you later install the Supabase CLI, `supabase db push`
-- applies migrations 1 and 2 and will skip what is already there.
-- =============================================================================


-- #############################################################################
-- # 1/3  admin_portal
-- #############################################################################

-- =============================================================================
-- Admin Operations Portal — shared schema
--
-- Brings the database up to the level the CarsGlow admin web app needs, while
-- staying backward compatible with the mobile app:
--   0. Three roles, named for what they are: admin / cleaner / owner
--   1. Helper functions that break the RLS recursion on `profiles`
--   2. Admin-domain columns on societies / profiles / vehicles / cleaning_jobs /
--      complaints
--   3. Missing write policies the mobile app already assumes it has
--   4. `admin` policies so the product owner can operate across every society
--   5. `generate_daily_jobs()` — turns active subscriptions into today's roster
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Role vocabulary
--
-- The product has exactly three roles:
--
--   admin    the product owner — full visibility and control across the platform
--   cleaner  cleans cars, scoped to the society they are assigned to
--   owner    a car owner / subscriber, scoped to their own vehicles
--
-- The original schema called the first one `society_admin`, from an earlier
-- idea of a per-society manager. That role does not exist: there is one admin
-- and they see everything. Renamed so the data says what it means.
-- -----------------------------------------------------------------------------

UPDATE profiles SET role = 'admin' WHERE role = 'society_admin';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('owner', 'cleaner', 'admin'));


-- -----------------------------------------------------------------------------
-- 1. Auth helpers (SECURITY DEFINER so they do NOT re-enter RLS)
--
-- The original policies on `profiles` contained `SELECT ... FROM profiles`,
-- which makes Postgres evaluate the profiles policy while evaluating the
-- profiles policy -> "infinite recursion detected in policy for relation
-- profiles". Every one of those subqueries is replaced below.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM profiles WHERE id = auth.uid() $$;

CREATE OR REPLACE FUNCTION auth_society_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT society_id FROM profiles WHERE id = auth.uid() $$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COALESCE(auth_role() = 'admin', FALSE) $$;

CREATE OR REPLACE FUNCTION is_cleaner_for_society(target_society UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COALESCE(auth_role() = 'cleaner' AND auth_society_id() = target_society, FALSE) $$;


-- -----------------------------------------------------------------------------
-- 2. Admin-domain columns
-- -----------------------------------------------------------------------------

ALTER TABLE societies
  ADD COLUMN IF NOT EXISTS area TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS towers TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  -- cleaner fields
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS assigned_towers TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS max_daily_capacity INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS access_pin TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- consumer fields
  ADD COLUMN IF NOT EXISTS tower TEXT,
  ADD COLUMN IF NOT EXISTS flat_no TEXT;

DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_status_check
    CHECK (status IN ('active', 'inactive', 'on_leave'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS make TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS tower TEXT;

ALTER TABLE cleaning_jobs
  ADD COLUMN IF NOT EXISTS tower TEXT,
  ADD COLUMN IF NOT EXISTS before_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS after_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS int_before_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS int_after_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS steps_done JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS key_status TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TEXT,
  ADD COLUMN IF NOT EXISTS rating INTEGER,
  ADD COLUMN IF NOT EXISTS service_record_id UUID REFERENCES service_records(id) ON DELETE SET NULL;

-- 'skipped' is an admin/cleaner outcome the original CHECK did not allow.
ALTER TABLE cleaning_jobs DROP CONSTRAINT IF EXISTS cleaning_jobs_status_check;
ALTER TABLE cleaning_jobs ADD CONSTRAINT cleaning_jobs_status_check
  CHECK (status IN ('waiting', 'cleaning', 'completed', 'skipped'));

-- One job per vehicle per day — makes roster generation idempotent.
-- Collapse any pre-existing duplicates first, keeping the most advanced row.
DELETE FROM cleaning_jobs c USING cleaning_jobs keep
WHERE c.vehicle_id = keep.vehicle_id
  AND c.created_at = keep.created_at
  AND (keep.progress, keep.id) > (c.progress, c.id);

CREATE UNIQUE INDEX IF NOT EXISTS cleaning_jobs_vehicle_day_idx
  ON cleaning_jobs (vehicle_id, created_at);

ALTER TABLE complaints
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES cleaning_jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resolution_note TEXT,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check
  CHECK (status IN ('open', 'in_review', 'resolved'));

-- The resolution notification fired only on open -> resolved, so it was skipped
-- whenever an admin moved the complaint through 'in_review' first.
CREATE OR REPLACE FUNCTION handle_complaint_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_owner_id UUID;
  v_cleaner_id UUID;
  v_vehicle_name TEXT;
  v_plate TEXT;
  v_society_id UUID;
  v_issue_label TEXT;
BEGIN
  SELECT owner_id, name, registration_number, society_id
    INTO v_owner_id, v_vehicle_name, v_plate, v_society_id
  FROM vehicles WHERE id = NEW.vehicle_id;

  SELECT label INTO v_issue_label FROM complaint_issues WHERE id = NEW.issue_id;

  IF TG_OP = 'INSERT' THEN
    SELECT cleaner_id INTO v_cleaner_id
    FROM cleaning_jobs
    WHERE vehicle_id = NEW.vehicle_id AND cleaner_id IS NOT NULL
    ORDER BY created_at DESC LIMIT 1;

    IF v_cleaner_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, body)
      VALUES (v_cleaner_id, 'general', 'Complaint Raised',
        'A complaint was raised for ' || v_vehicle_name || ' (' || v_plate || '): "' || COALESCE(NEW.description, v_issue_label) || '".');
    ELSE
      FOR v_cleaner_id IN
        SELECT id FROM profiles WHERE role = 'cleaner' AND society_id = v_society_id
      LOOP
        INSERT INTO notifications (user_id, type, title, body)
        VALUES (v_cleaner_id, 'general', 'Complaint Raised',
          'A complaint was raised for ' || v_vehicle_name || ' (' || v_plate || '): "' || COALESCE(NEW.description, v_issue_label) || '".');
      END LOOP;
    END IF;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status <> 'resolved' AND NEW.status = 'resolved' THEN
    INSERT INTO notifications (user_id, type, title, body)
    VALUES (v_owner_id, 'general', 'Complaint Resolved',
      'Your complaint regarding "' || COALESCE(v_issue_label, 'wash quality') || '" has been resolved.'
      || COALESCE(' ' || NEW.resolution_note, ''));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- -----------------------------------------------------------------------------
-- 3. Policies the mobile app already assumed existed
-- -----------------------------------------------------------------------------

-- completeOnboarding() upserts a profile row on first login; admins also write
-- staff profiles from the operations portal.
DROP POLICY IF EXISTS "Profiles insertable by self" ON profiles;
CREATE POLICY "Profiles insertable by self" ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() OR is_admin());

-- subscribe() writes user_subscriptions; only SELECT was granted.
DROP POLICY IF EXISTS "Subscriptions writable by owner" ON user_subscriptions;
CREATE POLICY "Subscriptions writable by owner" ON user_subscriptions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- submitRating() writes back onto the owner's own service record.
DROP POLICY IF EXISTS "Records ratable by owner" ON service_records;
CREATE POLICY "Records ratable by owner" ON service_records FOR UPDATE TO authenticated
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid()))
  WITH CHECK (vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid()));


-- -----------------------------------------------------------------------------
-- 4. De-recursed policies + admin access
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Profiles are readable by society members" ON profiles;
CREATE POLICY "Profiles are readable by society members" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin() OR society_id IS NULL OR society_id = auth_society_id());

DROP POLICY IF EXISTS "Profiles can be updated by owner" ON profiles;
CREATE POLICY "Profiles can be updated by owner" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Vehicles readable by owners and cleaners in same society" ON vehicles;
CREATE POLICY "Vehicles readable by owners and cleaners in same society" ON vehicles FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR is_admin() OR is_cleaner_for_society(society_id));

DROP POLICY IF EXISTS "Vehicles mutable only by owners" ON vehicles;
CREATE POLICY "Vehicles mutable only by owners" ON vehicles FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR is_admin())
  WITH CHECK (owner_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Cleaning jobs readable by owners and cleaners" ON cleaning_jobs;
CREATE POLICY "Cleaning jobs readable by owners and cleaners" ON cleaning_jobs FOR SELECT TO authenticated
  USING (
    is_admin()
    OR vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid())
    OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id))
  );

DROP POLICY IF EXISTS "Cleaning jobs mutable by cleaners" ON cleaning_jobs;
CREATE POLICY "Cleaning jobs mutable by cleaners" ON cleaning_jobs FOR ALL TO authenticated
  USING (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id)))
  WITH CHECK (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id)));

DROP POLICY IF EXISTS "Records readable by owners and cleaners" ON service_records;
CREATE POLICY "Records readable by owners and cleaners" ON service_records FOR SELECT TO authenticated
  USING (
    is_admin()
    OR vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid())
    OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id))
  );

DROP POLICY IF EXISTS "Records insertable by cleaners" ON service_records;
CREATE POLICY "Records insertable by cleaners" ON service_records FOR INSERT TO authenticated
  WITH CHECK (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id)));

DROP POLICY IF EXISTS "Photos readable by owners" ON wash_photo_sets;
CREATE POLICY "Photos readable by owners" ON wash_photo_sets FOR SELECT TO authenticated
  USING (
    is_admin()
    OR service_id IN (
      SELECT id FROM service_records WHERE vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid())
    )
    OR service_id IN (
      SELECT id FROM service_records WHERE vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id))
    )
  );

DROP POLICY IF EXISTS "Photos uploadable by cleaners" ON wash_photo_sets;
CREATE POLICY "Photos uploadable by cleaners" ON wash_photo_sets FOR INSERT TO authenticated
  WITH CHECK (
    is_admin()
    OR service_id IN (
      SELECT id FROM service_records WHERE vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id))
    )
  );

DROP POLICY IF EXISTS "Complaints readable and writable by owners" ON complaints;
CREATE POLICY "Complaints readable and writable by owners" ON complaints FOR ALL TO authenticated
  USING (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid()))
  WITH CHECK (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE owner_id = auth.uid()));

DROP POLICY IF EXISTS "Societies writable by admin" ON societies;
CREATE POLICY "Societies writable by admin" ON societies FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Subscriptions readable by admin" ON user_subscriptions;
CREATE POLICY "Subscriptions readable by admin" ON user_subscriptions FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Schedules readable by cleaners and admin" ON schedules;
CREATE POLICY "Schedules readable by cleaners and admin" ON schedules FOR SELECT TO authenticated
  USING (is_admin() OR vehicle_id IN (SELECT id FROM vehicles WHERE is_cleaner_for_society(society_id)));


-- -----------------------------------------------------------------------------
-- 5. Daily roster generation
--
-- Creates one 'waiting' cleaning job per eligible vehicle for `target_date` and
-- assigns the best-matching active cleaner (tower match first, then least
-- loaded cleaner in the society under their daily capacity).
--
-- Eligible = vehicle owner has an active subscription AND the vehicle's
-- schedule is not paused over `target_date`.
--
-- Safe to run repeatedly: existing jobs for the day are left untouched.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION generate_daily_jobs(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (created_count INTEGER, skipped_count INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_vehicle RECORD;
  v_cleaner_id UUID;
  v_services TEXT[];
  v_interior_day TEXT;
  v_created INTEGER := 0;
  v_skipped INTEGER := 0;
BEGIN
  -- SECURITY DEFINER + granted to `authenticated`, so the role check has to be
  -- here: without it any signed-in subscriber could rebuild the whole roster.
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only an admin can generate the daily roster';
  END IF;

  FOR v_vehicle IN
    SELECT v.id, v.owner_id, v.society_id, v.tower, v.parking_slot,
           s.preferred_slot, s.is_paused, s.paused_from_iso, s.paused_until_iso,
           s.interior_clean_day
    FROM vehicles v
    JOIN user_subscriptions us ON us.user_id = v.owner_id AND us.active = TRUE
                              AND us.end_date >= target_date
    LEFT JOIN schedules s ON s.vehicle_id = v.id
  LOOP
    -- Already rostered for the day?
    IF EXISTS (SELECT 1 FROM cleaning_jobs WHERE vehicle_id = v_vehicle.id AND created_at = target_date) THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Vacation pause covers the target date?
    IF COALESCE(v_vehicle.is_paused, FALSE)
       AND target_date >= COALESCE(v_vehicle.paused_from_iso, target_date)
       AND target_date <= COALESCE(v_vehicle.paused_until_iso, target_date) THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Cleaner whose assigned towers cover this vehicle, else least loaded.
    SELECT p.id INTO v_cleaner_id
    FROM profiles p
    WHERE p.role = 'cleaner'
      AND p.status = 'active'
      AND p.society_id = v_vehicle.society_id
      AND (
        v_vehicle.tower IS NULL
        OR cardinality(p.assigned_towers) = 0
        OR v_vehicle.tower = ANY (p.assigned_towers)
      )
      AND (
        SELECT COUNT(*) FROM cleaning_jobs cj
        WHERE cj.cleaner_id = p.id AND cj.created_at = target_date
      ) < p.max_daily_capacity
    ORDER BY
      (v_vehicle.tower IS NOT NULL AND v_vehicle.tower = ANY (p.assigned_towers)) DESC,
      (SELECT COUNT(*) FROM cleaning_jobs cj WHERE cj.cleaner_id = p.id AND cj.created_at = target_date) ASC
    LIMIT 1;

    -- Interior clean on the subscriber's chosen weekday.
    v_interior_day := COALESCE(v_vehicle.interior_clean_day, 'Sunday');
    IF TRIM(TO_CHAR(target_date, 'Day')) = v_interior_day THEN
      v_services := ARRAY['Exterior Wash', 'Tire Shine', 'Interior Clean'];
    ELSE
      v_services := ARRAY['Exterior Wash', 'Tire Shine'];
    END IF;

    INSERT INTO cleaning_jobs (
      vehicle_id, cleaner_id, status, progress, start_time, estimated_end,
      services, steps, tower, created_at
    ) VALUES (
      v_vehicle.id,
      v_cleaner_id,
      'waiting',
      0,
      SPLIT_PART(COALESCE(v_vehicle.preferred_slot, '6-8 AM'), '-', 1),
      SPLIT_PART(COALESCE(v_vehicle.preferred_slot, '6-8 AM'), '-', 2),
      v_services,
      '[]'::jsonb,
      v_vehicle.tower,
      target_date
    );

    v_created := v_created + 1;
  END LOOP;

  RETURN QUERY SELECT v_created, v_skipped;
END;
$$;

GRANT EXECUTE ON FUNCTION generate_daily_jobs(DATE) TO authenticated, service_role;


-- -----------------------------------------------------------------------------
-- 6. Storage for before/after wash photos
--
-- Cleaners capture photos on device; without a bucket the only thing that ever
-- reached the database was a local file:// URI that no owner could open.
-- -----------------------------------------------------------------------------

-- Writing storage policies from SQL is permission-sensitive on managed
-- Supabase. Keep it non-fatal: if it fails, create the `wash-photos` bucket
-- (public) under Storage in the dashboard and everything else still applies.
DO $$ BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('wash-photos', 'wash-photos', TRUE)
  ON CONFLICT (id) DO NOTHING;

  DROP POLICY IF EXISTS "Wash photos readable by anyone" ON storage.objects;
  CREATE POLICY "Wash photos readable by anyone" ON storage.objects FOR SELECT
    USING (bucket_id = 'wash-photos');

  DROP POLICY IF EXISTS "Wash photos uploadable by staff" ON storage.objects;
  CREATE POLICY "Wash photos uploadable by staff" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'wash-photos' AND (is_admin() OR auth_role() = 'cleaner'));
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not configure the wash-photos bucket (%). Create it manually under Storage.', SQLERRM;
END $$;


-- #############################################################################
-- # 2/3  push_delivery
-- #############################################################################

-- =============================================================================
-- Push delivery
--
-- The notification triggers write rows into `notifications`, and the mobile app
-- stores `profiles.expo_push_token` — but nothing ever connected the two, so no
-- push was ever delivered. This forwards each new notification to the
-- `send-push` edge function via pg_net.
--
-- Configure once per project (values are read at trigger time, so the trigger is
-- inert until they are set):
--
--   ALTER DATABASE postgres SET app.settings.functions_url =
--     'https://<project-ref>.supabase.co/functions/v1';
--   ALTER DATABASE postgres SET app.settings.push_hook_secret = '<PUSH_HOOK_SECRET>';
--
-- Then set the same secret on the function:
--   supabase secrets set PUSH_HOOK_SECRET='<PUSH_HOOK_SECRET>'
-- =============================================================================

-- pg_net may need enabling from the dashboard (Database > Extensions) on some
-- projects. Don't let that abort the rest of the migration — the trigger below
-- degrades to a warning without it, and in-app notifications keep working.
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not enable pg_net (%). Enable it under Database > Extensions to get push delivery.', SQLERRM;
END $$;

CREATE OR REPLACE FUNCTION dispatch_push_notification()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  v_functions_url TEXT;
  v_secret TEXT;
BEGIN
  v_functions_url := current_setting('app.settings.functions_url', TRUE);
  v_secret := current_setting('app.settings.push_hook_secret', TRUE);

  -- Not configured yet — the in-app notification row still exists, we just
  -- skip the push rather than failing the write that created it.
  IF v_functions_url IS NULL OR v_secret IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_functions_url || '/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-push-secret', v_secret
    ),
    body := jsonb_build_object('notificationId', NEW.id)
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never let a push failure roll back a completed wash or a resolved complaint.
  RAISE WARNING 'dispatch_push_notification failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_dispatch_push_notification
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION dispatch_push_notification();


-- #############################################################################
-- # 3/3  bootstrap the admin account
-- #############################################################################

-- Promote a Supabase auth user to the CarsGlow admin.
--
-- Run this in the Supabase dashboard > SQL Editor. It runs as `postgres`, which
-- bypasses RLS, so no service role key is needed on your machine.
--
-- ORDER MATTERS: run `supabase db push` first. This script sets role = 'admin',
-- which the original CHECK constraint does not allow — the admin_portal
-- migration widens it. The guard below says so plainly if you get it backwards.
--
-- If the auth user does not exist yet, create it under
-- Authentication > Users > "Add user" (tick "Auto Confirm User"), then re-run.
--
-- Re-running is safe: it updates the existing profile rather than duplicating.

DO $$
DECLARE
  -- ↓↓↓ EDIT THESE ↓↓↓
  v_email TEXT := 'anant.aditya10@gmail.com';
  v_name  TEXT := 'Anant Aditya';
  -- ↑↑↑ EDIT THESE ↑↑↑

  v_user_id UUID;
  v_allows_admin BOOLEAN;
BEGIN
  -- Has the admin_portal migration been applied?
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_check'
      AND pg_get_constraintdef(oid) LIKE '%''admin''%'
  ) INTO v_allows_admin;

  IF NOT v_allows_admin THEN
    RAISE EXCEPTION
      'profiles.role does not accept ''admin'' yet. Run `supabase db push` from sweeper-clean-expoapp first (migration 20260728000000_admin_portal.sql), then re-run this script.';
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(v_email);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'No auth user with email %. Create it under Authentication > Users (tick "Auto Confirm User"), then re-run.',
      v_email;
  END IF;

  -- Confirm the address if the signup email was never clicked, so the account
  -- can sign in immediately.
  UPDATE auth.users
     SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
   WHERE id = v_user_id;

  -- profiles.phone is NOT NULL and UNIQUE; the admin signs in by email, so
  -- store a stable placeholder that cannot collide with a real mobile number.
  INSERT INTO profiles (id, name, email, phone, role, status)
  VALUES (v_user_id, v_name, v_email, '+admin-' || left(v_user_id::text, 8), 'admin', 'active')
  ON CONFLICT (id) DO UPDATE
    SET name   = EXCLUDED.name,
        email  = EXCLUDED.email,
        role   = 'admin',
        status = 'active';

  RAISE NOTICE '% is now an admin and can sign in at /admin', v_email;
END $$;
