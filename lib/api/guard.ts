import "server-only"

import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getRequestSupabase } from "@/lib/supabase/admin"

export interface AdminContext {
  /** Scoped to the calling admin — all queries pass through RLS. */
  supabase: SupabaseClient
  adminId: string
  adminName: string
  /** Forwarded to edge functions that need to re-verify the caller. */
  accessToken: string
}

export function apiError(message: string, status = 400, code = "ERROR") {
  return NextResponse.json({ error: { code, message } }, { status })
}

/**
 * Authorises an /api/admin/* call.
 *
 * Two layers: this checks the caller's profile carries `admin` and fails fast
 * with a clear message, and the `admin` RLS policies enforce the same thing at
 * the database, so a missed check here is not a data leak.
 */
export async function requireAdmin(
  request: Request,
): Promise<{ ok: true; context: AdminContext } | { ok: false; response: NextResponse }> {
  const accessToken = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "")
  if (!accessToken) {
    return { ok: false, response: apiError("Sign in to use the admin portal.", 401, "UNAUTHORISED") }
  }

  let supabase: SupabaseClient
  try {
    supabase = getRequestSupabase(accessToken)
  } catch (err) {
    return {
      ok: false,
      response: apiError(err instanceof Error ? err.message : "Supabase is not configured", 503, "NOT_CONFIGURED"),
    }
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError || !userData.user) {
    return { ok: false, response: apiError("Your session has expired. Sign in again.", 401, "UNAUTHORISED") }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (!profile || profile.role !== "admin") {
    return { ok: false, response: apiError("This account is not an admin.", 403, "FORBIDDEN") }
  }

  return {
    ok: true,
    context: { supabase, adminId: profile.id, adminName: profile.name ?? "Admin", accessToken },
  }
}

/** Wraps a handler with the admin guard and turns thrown errors into 500s. */
export function withAdmin(
  handler: (request: Request, context: AdminContext, params: Record<string, string>) => Promise<NextResponse>,
) {
  return async (request: Request, route?: { params: Promise<Record<string, string>> }) => {
    const guard = await requireAdmin(request)
    if (!guard.ok) return guard.response

    try {
      const params = route?.params ? await route.params : {}
      return await handler(request, guard.context, params)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected server error"
      console.error("[admin-api]", message)
      return apiError(message, 500, "EXCEPTION")
    }
  }
}
