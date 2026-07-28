import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { updateJob } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

export const PATCH = withAdmin(async (request, { supabase }, params) => {
  const body = await request.json()
  const job = await updateJob(supabase, params.id, body.status, body.rating)
  return NextResponse.json({ data: job })
})
