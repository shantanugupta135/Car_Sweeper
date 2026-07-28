import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { getOverviewStats } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

export const GET = withAdmin(async (_request, { supabase }) => {
  return NextResponse.json({ data: await getOverviewStats(supabase) })
})
