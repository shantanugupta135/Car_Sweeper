import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { updateComplaint } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

/**
 * Moving a complaint to `resolved` fires the database trigger that notifies the
 * subscriber in the mobile app, so the resolution note written here is what
 * they read on their phone.
 */
export const PATCH = withAdmin(async (request, { supabase, adminId }, params) => {
  const body = await request.json()
  const complaint = await updateComplaint(supabase, params.id, body.status, body.resolutionNote, adminId)
  return NextResponse.json({ data: complaint })
})
