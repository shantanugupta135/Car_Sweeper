import { NextResponse } from "next/server"
import { withAdmin } from "@/lib/api/guard"
import { createSociety, listSocieties } from "@/lib/api/admin-repo"

export const dynamic = "force-dynamic"

export const GET = withAdmin(async (_request, { supabase }) => {
  return NextResponse.json({ data: await listSocieties(supabase) })
})

export const POST = withAdmin(async (request, { supabase }) => {
  const body = await request.json()
  const society = await createSociety(supabase, {
    name: body.name,
    city: body.city,
    area: body.area,
    towers: body.towers ?? [],
  })
  return NextResponse.json({ data: society }, { status: 201 })
})
