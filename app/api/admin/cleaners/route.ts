import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { createCleaner, listCleaners } from "@/lib/api/admin-repo"
import { getServiceSupabase } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export const GET = withAdmin(async (_request, { supabase }) => {
  return NextResponse.json({ data: await listCleaners(supabase) })
})

/**
 * Provisions the cleaner's login. After this returns, that phone number can
 * sign in on the mobile app and lands in the cleaner tab tree.
 */
export const POST = withAdmin(async (request, { supabase }) => {
  const body = await request.json()
  const cleaner = await createCleaner(
    supabase,
    {
      fullName: body.fullName,
      phone: body.phone,
      assignedSocietyId: body.assignedSocietyId,
      assignedTowers: body.assignedTowers ?? [],
      maxDailyCapacity: Number(body.maxDailyCapacity) || 30,
      accessPin: body.accessPin,
      status: body.status,
    },
    getServiceSupabase(),
  )
  return NextResponse.json({ data: cleaner }, { status: 201 })
})
