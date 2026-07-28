import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { generateDailyJobs, listDailyJobs, todayIso } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

export const GET = withAdmin(async (request, { supabase }) => {
  const date = new URL(request.url).searchParams.get("date") ?? todayIso()
  return NextResponse.json({ data: await listDailyJobs(supabase, date) })
})

/** Builds the day's roster from active subscriptions. Safe to re-run. */
export const POST = withAdmin(async (request, { supabase }) => {
  const body = await request.json().catch(() => ({}))
  const date = body.date ?? todayIso()
  const result = await generateDailyJobs(supabase, date)
  return NextResponse.json({ data: { ...result, jobs: await listDailyJobs(supabase, date) } })
})
