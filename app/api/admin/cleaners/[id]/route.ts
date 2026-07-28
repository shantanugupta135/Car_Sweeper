import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { updateCleaner } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

export const PATCH = withAdmin(async (request, { supabase }, params) => {
  const body = await request.json()
  const cleaner = await updateCleaner(supabase, params.id, body)
  return NextResponse.json({ data: cleaner })
})
