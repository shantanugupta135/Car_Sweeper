/**
 * Data-source switch, mirroring the mobile app's EXPO_PUBLIC_API_MODE.
 *
 *   mock (default) — everything is served from lib/mock-admin-data.ts, in memory
 *   real           — the admin screens talk to /api/admin/*, which talks to the
 *                    same Supabase project the CarsGlow mobile app uses
 *
 * Set NEXT_PUBLIC_API_MODE=real in .env.local once SUPABASE_SERVICE_ROLE_KEY is
 * in place. Anything else keeps the portal on mock data so it always renders.
 */
export type ApiMode = "mock" | "real"

export const API_MODE: ApiMode =
  process.env.NEXT_PUBLIC_API_MODE === "real" ? "real" : "mock"

export const IS_REAL_MODE = API_MODE === "real"

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
