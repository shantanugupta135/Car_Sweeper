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
