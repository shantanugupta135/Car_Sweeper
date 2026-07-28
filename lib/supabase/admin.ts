import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase access for the admin API.
 *
 * The portal deliberately runs on the **anon key plus the signed-in admin's own
 * JWT** — the same public credentials the mobile app ships with. Authority comes
 * from the `admin` RLS policies (see the admin_portal migration), not from a
 * privileged key sitting in the web app's environment.
 *
 * The one operation RLS cannot express — creating a cleaner's `auth.users` row —
 * is delegated to the `admin-provision-cleaner` edge function, where Supabase
 * injects the service role key itself.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null
}

/**
 * A client that acts *as the calling admin*. Every query it runs is filtered by
 * RLS, so a bug in a route handler cannot leak another society's data or write
 * something the admin is not entitled to write.
 */
export function getRequestSupabase(accessToken: string): SupabaseClient {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, " +
        "or leave NEXT_PUBLIC_API_MODE unset to run the portal on mock data.",
    )
  }

  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

/**
 * Optional escalation. Only used if SUPABASE_SERVICE_ROLE_KEY happens to be set,
 * which lets an operator provision cleaners without deploying the edge function.
 * Everything works without it.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!config || !serviceKey) return null

  return createClient(config.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
