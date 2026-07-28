import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config"

/**
 * Browser client — used only to sign the admin in and to hold their session.
 * All actual admin reads and writes go through /api/admin/*, which runs with
 * the service role on the server. The service key never reaches the browser.
 */
let client: SupabaseClient | null = null

export function getBrowserSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      SUPABASE_URL || "https://placeholder.supabase.co",
      SUPABASE_ANON_KEY || "placeholder-anon-key",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: "carsglow-admin-auth",
        },
      },
    )
  }
  return client
}
