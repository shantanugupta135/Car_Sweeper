#!/usr/bin/env node
/**
 * Creates (or repairs) a CarsGlow operations admin.
 *
 * There is no self-service admin sign-up by design — the very first admin has
 * to be minted with the service role, and this is that step.
 *
 *   node scripts/create-admin.mjs ops@carsglow.com 'a-strong-password' 'Ops Team'
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * Safe to re-run: an existing account is updated in place rather than duplicated.
 */
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

function loadEnv(file) {
  try {
    for (const line of readFileSync(resolve(process.cwd(), file), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "")
      }
    }
  } catch {
    // file is optional — env may already be exported
  }
}

loadEnv(".env.local")
loadEnv(".env")

const [email, password, name = "CarsGlow Admin"] = process.argv.slice(2)

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [full name]")
  process.exit(1)
}

if (password.length < 8) {
  console.error("Choose a password of at least 8 characters.")
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    "This script needs SUPABASE_SERVICE_ROLE_KEY, which the portal itself does not use.\n\n" +
      "If you do not have it to hand, create the first admin from the dashboard instead:\n" +
      "  1. Authentication > Users > Add user (tick 'Auto Confirm User')\n" +
      "  2. SQL Editor > run scripts/bootstrap-admin.sql\n",
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
if (listError) {
  console.error("Could not list users:", listError.message)
  process.exit(1)
}

let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

if (user) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true })
  if (error) {
    console.error("Could not update the existing account:", error.message)
    process.exit(1)
  }
  console.log(`• Reused existing auth user ${user.id} and reset its password.`)
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin", full_name: name },
  })
  if (error) {
    console.error("Could not create the auth user:", error.message)
    process.exit(1)
  }
  user = data.user
  console.log(`• Created auth user ${user.id}.`)
}

// profiles.phone is NOT NULL and UNIQUE — derive a stable placeholder for
// staff accounts that sign in by email rather than SMS.
const placeholderPhone = `+admin-${user.id.slice(0, 8)}`

const { error: profileError } = await supabase.from("profiles").upsert(
  {
    id: user.id,
    name,
    email,
    phone: placeholderPhone,
    role: "admin",
    status: "active",
  },
  { onConflict: "id" },
)

if (profileError) {
  console.error("Could not write the admin profile:", profileError.message)
  process.exit(1)
}

console.log(`\n✓ ${email} can now sign in at /admin.`)
