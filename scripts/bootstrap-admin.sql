-- Promote an existing Supabase auth user to a CarsGlow operations admin.
--
-- There is no self-service admin sign-up, and the portal holds no privileged
-- key, so the first admin is created by hand. Two steps, no service role key
-- needed on your machine:
--
--   1. Supabase dashboard > Authentication > Users > "Add user"
--        Email:    ops@carsglow.com
--        Password: (choose one)
--        Tick "Auto Confirm User"
--
--   2. Supabase dashboard > SQL Editor > paste this file, edit the two values
--      below, and run it.
--
-- Re-running is safe: it updates the existing profile rather than duplicating.

DO $$
DECLARE
  -- ↓↓↓ EDIT THESE ↓↓↓
  v_email TEXT := 'ops@carsglow.com';
  v_name  TEXT := 'Ops Team';
  -- ↑↑↑ EDIT THESE ↑↑↑

  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(v_email);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'No auth user with email %. Create it first under Authentication > Users (tick Auto Confirm User).',
      v_email;
  END IF;

  -- profiles.phone is NOT NULL and UNIQUE; staff sign in by email, so store a
  -- stable placeholder that cannot collide with a real mobile number.
  INSERT INTO profiles (id, name, email, phone, role, status)
  VALUES (v_user_id, v_name, v_email, '+admin-' || left(v_user_id::text, 8), 'admin', 'active')
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = 'admin',
        status = 'active';

  RAISE NOTICE '% can now sign in at /admin', v_email;
END $$;
