import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Cleaner, Complaint, Consumer, DailyCleanJob, Society, Vehicle } from "@/lib/types/api"

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Normalise an Indian mobile number to E.164 — the key the mobile app logs in with. */
export function normalisePhone(raw: string): string {
  const trimmed = (raw ?? "").toString().trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("+")) return trimmed.replace(/[^\d+]/g, "")
  const digits = trimmed.replace(/\D/g, "")
  return digits.length > 10 ? `+${digits}` : `+91${digits}`
}

/**
 * The mobile app and the admin portal name the same job states differently.
 * These are the only two places the vocabulary is allowed to cross over.
 */
const JOB_STATUS_TO_ADMIN: Record<string, DailyCleanJob["status"]> = {
  waiting: "pending",
  cleaning: "in_progress",
  completed: "completed",
  skipped: "skipped",
}

const JOB_STATUS_TO_DB: Record<DailyCleanJob["status"], string> = {
  pending: "waiting",
  in_progress: "cleaning",
  completed: "completed",
  skipped: "skipped",
}

/** complaint_issues.id (seeded for the mobile app) -> admin issue taxonomy. */
const ISSUE_TO_ADMIN: Record<string, Complaint["issueType"]> = {
  missed: "missed_wash",
  quality: "poor_quality",
  late: "poor_quality",
  damage: "scratch_or_damage",
  behavior: "other",
  other: "other",
}

/* -------------------------------------------------------------------------- */
/* Societies                                                                  */
/* -------------------------------------------------------------------------- */

export async function listSocieties(supabase: SupabaseClient): Promise<Society[]> {
  const [{ data: societies, error }, { data: cleaners }, { data: vehicles }] = await Promise.all([
    supabase.from("societies").select("*").order("name"),
    supabase.from("profiles").select("id, society_id").eq("role", "cleaner"),
    supabase.from("vehicles").select("owner_id, society_id"),
  ])

  if (error) throw new Error(error.message)

  return (societies ?? []).map((row) => {
    const subscriberIds = new Set(
      (vehicles ?? []).filter((v) => v.society_id === row.id).map((v) => v.owner_id),
    )
    return {
      id: row.id,
      name: row.name,
      city: row.city ?? "",
      area: row.area ?? "",
      towers: row.towers ?? [],
      totalSubscribers: subscriberIds.size,
      assignedCleanerIds: (cleaners ?? []).filter((c) => c.society_id === row.id).map((c) => c.id),
    }
  })
}

export async function createSociety(
  supabase: SupabaseClient,
  input: { name: string; city: string; area: string; towers: string[] },
): Promise<Society> {
  const { data, error } = await supabase
    .from("societies")
    .insert({
      name: input.name.trim(),
      city: input.city.trim() || "Bengaluru",
      area: input.area?.trim() ?? "",
      towers: input.towers ?? [],
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") throw new Error(`A society named "${input.name}" already exists.`)
    throw new Error(error.message)
  }

  return {
    id: data.id,
    name: data.name,
    city: data.city ?? "",
    area: data.area ?? "",
    towers: data.towers ?? [],
    totalSubscribers: 0,
    assignedCleanerIds: [],
  }
}

/* -------------------------------------------------------------------------- */
/* Cleaners                                                                   */
/* -------------------------------------------------------------------------- */

async function cleanerLoadToday(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("cleaning_jobs")
    .select("cleaner_id, status")
    .eq("created_at", todayIso())

  const load: Record<string, { assigned: number; completed: number }> = {}
  for (const job of data ?? []) {
    if (!job.cleaner_id) continue
    if (!load[job.cleaner_id]) load[job.cleaner_id] = { assigned: 0, completed: 0 }
    load[job.cleaner_id].assigned += 1
    if (job.status === "completed") load[job.cleaner_id].completed += 1
  }
  return load
}

function toCleaner(row: any, load: Record<string, { assigned: number; completed: number }>): Cleaner {
  const stats = load[row.id] ?? { assigned: 0, completed: 0 }
  return {
    id: row.id,
    fullName: row.name ?? "",
    phone: row.phone ?? "",
    status: (row.status ?? "active") as Cleaner["status"],
    assignedSocietyId: row.society_id ?? "",
    assignedSocietyName: row.societies?.name ?? "",
    assignedTowers: row.assigned_towers ?? [],
    maxDailyCapacity: row.max_daily_capacity ?? 30,
    completedToday: stats.completed,
    totalAssignedToday: stats.assigned,
    rating: Number(row.rating ?? 5),
    joinedDate: row.joined_date ?? "",
    accessPin: row.access_pin ?? "",
  }
}

export async function listCleaners(supabase: SupabaseClient): Promise<Cleaner[]> {
  const [{ data, error }, load] = await Promise.all([
    supabase.from("profiles").select("*, societies(name)").eq("role", "cleaner").order("name"),
    cleanerLoadToday(supabase),
  ])

  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => toCleaner(row, load))
}

export interface NewCleanerInput {
  fullName: string
  phone: string
  assignedSocietyId: string
  assignedTowers: string[]
  maxDailyCapacity: number
  accessPin: string
  status?: Cleaner["status"]
}

/**
 * Provisioning a cleaner is the hinge between the two apps.
 *
 * It creates (or reuses) the Supabase auth user keyed on the cleaner's phone
 * number and writes a `profiles` row with role='cleaner'. When that person then
 * enters the same number in the mobile app and passes OTP, verifyOtp finds a
 * complete profile, reports isNewUser=false with role='cleaner', and the app
 * routes them straight into the cleaner tab tree.
 *
 * Creating an `auth.users` row is the one step RLS cannot express, so it runs
 * in the `admin-provision-cleaner` edge function where Supabase supplies the
 * service role key. The portal itself only ever holds the anon key.
 */
export async function createCleaner(
  supabase: SupabaseClient,
  input: NewCleanerInput,
  serviceSupabase: SupabaseClient | null,
): Promise<Cleaner> {
  const phone = normalisePhone(input.phone)
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    throw new Error("Enter a valid 10-digit mobile number.")
  }
  if (!input.assignedSocietyId) throw new Error("Assign the cleaner to a society.")
  if (!input.fullName?.trim()) throw new Error("Full name is required.")

  const profile = serviceSupabase
    ? await provisionWithServiceRole(serviceSupabase, { ...input, phone })
    : await provisionViaEdgeFunction(supabase, { ...input, phone })

  return toCleaner(profile, await cleanerLoadToday(supabase))
}

/** Default path — no privileged key lives in this app. */
async function provisionViaEdgeFunction(supabase: SupabaseClient, input: NewCleanerInput) {
  const { data, error } = await supabase.functions.invoke("admin-provision-cleaner", { body: input })

  if (error) {
    // functions.invoke hides the response body on non-2xx; surface what we can.
    const detail = (data as { error?: { message?: string } } | null)?.error?.message
    throw new Error(
      detail ??
        `${error.message}. Deploy the function with: supabase functions deploy admin-provision-cleaner`,
    )
  }
  if (data?.error) throw new Error(data.error.message)

  return data.profile
}

/** Used only when SUPABASE_SERVICE_ROLE_KEY happens to be configured. */
async function provisionWithServiceRole(supabase: SupabaseClient, input: NewCleanerInput) {
  const { phone } = input

  const { data: society } = await supabase
    .from("societies")
    .select("id")
    .eq("id", input.assignedSocietyId)
    .maybeSingle()
  if (!society) throw new Error("That society no longer exists.")

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("phone", phone)
    .maybeSingle()

  if (existingProfile && existingProfile.role === "owner") {
    throw new Error("That number already belongs to a subscriber account.")
  }

  let userId = existingProfile?.id as string | undefined

  if (!userId) {
    const derivedEmail = `${phone.replace("+", "")}@carsglow.local`
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      email: derivedEmail,
      email_confirm: true,
      user_metadata: { role: "cleaner", full_name: input.fullName },
    })

    if (createError) {
      const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
      const match = list?.users.find((u) => normalisePhone(u.phone ?? "") === phone)
      if (!match) throw new Error(createError.message)
      userId = match.id
    } else {
      userId = created.user.id
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        name: input.fullName.trim(),
        phone,
        role: "cleaner",
        society_id: society.id,
        status: input.status ?? "active",
        assigned_towers: input.assignedTowers ?? [],
        max_daily_capacity: input.maxDailyCapacity ?? 30,
        access_pin: input.accessPin,
        joined_date: todayIso(),
      },
      { onConflict: "id" },
    )
    .select("*, societies(name)")
    .single()

  if (profileError) throw new Error(profileError.message)
  return profile
}

export async function updateCleaner(
  supabase: SupabaseClient,
  cleanerId: string,
  patch: Partial<Pick<Cleaner, "status" | "assignedTowers" | "maxDailyCapacity" | "fullName" | "accessPin">>,
): Promise<Cleaner> {
  const update: Record<string, unknown> = {}
  if (patch.status !== undefined) update.status = patch.status
  if (patch.assignedTowers !== undefined) update.assigned_towers = patch.assignedTowers
  if (patch.maxDailyCapacity !== undefined) update.max_daily_capacity = patch.maxDailyCapacity
  if (patch.fullName !== undefined) update.name = patch.fullName
  if (patch.accessPin !== undefined) update.access_pin = patch.accessPin

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", cleanerId)
    .eq("role", "cleaner")
    .select("*, societies(name)")
    .single()

  if (error) throw new Error(error.message)
  return toCleaner(data, await cleanerLoadToday(supabase))
}

/* -------------------------------------------------------------------------- */
/* Consumers                                                                  */
/* -------------------------------------------------------------------------- */

export async function listConsumers(supabase: SupabaseClient): Promise<Consumer[]> {
  const [{ data: profiles, error }, { data: vehicles }, { data: subscriptions }, { data: plans }] =
    await Promise.all([
      supabase.from("profiles").select("*, societies(name)").eq("role", "owner").order("name"),
      supabase.from("vehicles").select("*"),
      supabase.from("user_subscriptions").select("*"),
      supabase.from("subscription_plans").select("id, name"),
    ])

  if (error) throw new Error(error.message)

  const planNames = new Map((plans ?? []).map((p) => [p.id, p.name]))

  return (profiles ?? []).map((row) => {
    const owned: Vehicle[] = (vehicles ?? [])
      .filter((v) => v.owner_id === row.id)
      .map((v) => ({
        id: v.id,
        ownerId: v.owner_id,
        registrationNumber: v.registration_number ?? "",
        make: v.make ?? "",
        model: v.model ?? v.name ?? "",
        color: v.color ?? "",
        parkingSpot: v.parking_slot ?? "",
        societyId: v.society_id ?? "",
      }))

    const subscription = (subscriptions ?? []).find((s) => s.user_id === row.id)
    let subscriptionStatus: Consumer["subscriptionStatus"] = "expired"
    if (subscription?.active) {
      subscriptionStatus = subscription.end_date >= todayIso() ? "active" : "expired"
    } else if (subscription) {
      subscriptionStatus = "paused"
    }

    return {
      id: row.id,
      fullName: row.name ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      societyId: row.society_id ?? "",
      societyName: row.societies?.name ?? "",
      tower: row.tower ?? "",
      flatNo: row.flat_no ?? "",
      registeredVehicles: owned,
      subscriptionStatus,
      currentPlanName: subscription ? (planNames.get(subscription.plan_id) ?? subscription.plan_id) : "No plan",
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Daily jobs                                                                 */
/* -------------------------------------------------------------------------- */

function toJob(row: any): DailyCleanJob {
  const vehicle = row.vehicles ?? {}
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    vehicleReg: vehicle.registration_number ?? "",
    vehicleModel: [vehicle.make, vehicle.model].filter(Boolean).join(" ") || vehicle.name || "Vehicle",
    ownerName: vehicle.profiles?.name ?? "",
    cleanerId: row.cleaner_id ?? "",
    cleanerName: row.profiles?.name ?? "Unassigned",
    societyId: vehicle.society_id ?? "",
    societyName: vehicle.societies?.name ?? "",
    tower: row.tower ?? vehicle.tower ?? "",
    parkingSpot: vehicle.parking_slot ?? "",
    date: row.created_at,
    status: JOB_STATUS_TO_ADMIN[row.status] ?? "pending",
    beforePhotoUrl: row.before_photo_url ?? undefined,
    afterPhotoUrl: row.after_photo_url ?? undefined,
    completedAt: row.completed_at ?? undefined,
    rating: row.rating ?? undefined,
  }
}

const JOB_SELECT =
  "*, profiles!cleaning_jobs_cleaner_id_fkey(name), vehicles(*, societies(name), profiles!vehicles_owner_id_fkey(name))"

export async function listDailyJobs(supabase: SupabaseClient, date = todayIso()): Promise<DailyCleanJob[]> {
  const { data, error } = await supabase
    .from("cleaning_jobs")
    .select(JOB_SELECT)
    .eq("created_at", date)
    .order("status")

  if (error) throw new Error(error.message)
  return (data ?? []).map(toJob)
}

export async function updateJob(
  supabase: SupabaseClient,
  jobId: string,
  status: DailyCleanJob["status"],
  rating?: number,
): Promise<DailyCleanJob> {
  const update: Record<string, unknown> = { status: JOB_STATUS_TO_DB[status] }
  if (status === "completed") {
    update.progress = 100
    update.completed_at = new Date().toISOString().slice(11, 16)
  }
  if (status === "in_progress") update.progress = 50
  if (rating !== undefined) update.rating = rating

  const { data, error } = await supabase
    .from("cleaning_jobs")
    .update(update)
    .eq("id", jobId)
    .select(JOB_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return toJob(data)
}

/**
 * Builds today's roster from active subscriptions and assigns cleaners by
 * tower. Idempotent — re-running only fills in what is missing.
 */
export async function generateDailyJobs(
  supabase: SupabaseClient,
  date = todayIso(),
): Promise<{ created: number; skipped: number }> {
  const { data, error } = await supabase.rpc("generate_daily_jobs", { target_date: date })
  if (error) throw new Error(error.message)

  const row = Array.isArray(data) ? data[0] : data
  return { created: row?.created_count ?? 0, skipped: row?.skipped_count ?? 0 }
}

/* -------------------------------------------------------------------------- */
/* Executive overview                                                         */
/* -------------------------------------------------------------------------- */

export interface OverviewStats {
  /** Monthly recurring revenue in rupees, from currently active subscriptions. */
  mrrInr: number
  activeSubscriptions: number
  /** Completion rate per day for the last 7 days, oldest first. */
  completionTrend: { day: string; label: string; rate: number }[]
}

export async function getOverviewStats(supabase: SupabaseClient): Promise<OverviewStats> {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
  const weekAgoIso = weekAgo.toISOString().slice(0, 10)

  const [{ data: subscriptions }, { data: plans }, { data: jobs }] = await Promise.all([
    supabase.from("user_subscriptions").select("plan_id, active, end_date"),
    supabase.from("subscription_plans").select("id, price_per_month_inr"),
    supabase.from("cleaning_jobs").select("created_at, status").gte("created_at", weekAgoIso),
  ])

  const priceById = new Map((plans ?? []).map((p) => [p.id, p.price_per_month_inr as number]))
  const activeSubs = (subscriptions ?? []).filter((s) => s.active && s.end_date >= todayIso())
  const mrrInr = activeSubs.reduce((sum, s) => sum + (priceById.get(s.plan_id) ?? 0), 0)

  const completionTrend: OverviewStats["completionTrend"] = []
  for (let offset = 6; offset >= 0; offset--) {
    const day = new Date(today.getTime() - offset * 24 * 60 * 60 * 1000)
    const iso = day.toISOString().slice(0, 10)
    const dayJobs = (jobs ?? []).filter((j) => j.created_at === iso)
    const done = dayJobs.filter((j) => j.status === "completed").length
    completionTrend.push({
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: dayJobs.length > 0 ? Math.round((done / dayJobs.length) * 100) : 0,
    })
  }

  return { mrrInr, activeSubscriptions: activeSubs.length, completionTrend }
}

/* -------------------------------------------------------------------------- */
/* Complaints                                                                 */
/* -------------------------------------------------------------------------- */

const COMPLAINT_SELECT =
  "*, complaint_issues(label), vehicles(registration_number, profiles!vehicles_owner_id_fkey(id, name))"

function toComplaint(row: any, cleanerByJob: Map<string, string>): Complaint {
  const vehicle = row.vehicles ?? {}
  return {
    id: row.id,
    jobId: row.job_id ?? "",
    consumerId: vehicle.profiles?.id ?? "",
    consumerName: vehicle.profiles?.name ?? "",
    vehicleReg: vehicle.registration_number ?? "",
    cleanerName: cleanerByJob.get(row.job_id) ?? "Unassigned",
    issueType: ISSUE_TO_ADMIN[row.issue_id] ?? "other",
    status: row.status as Complaint["status"],
    description: row.description ?? row.complaint_issues?.label ?? "",
    photoUrls: row.photo_urls ?? [],
    createdAt: row.created_at_iso,
  }
}

export async function listComplaints(supabase: SupabaseClient): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from("complaints")
    .select(COMPLAINT_SELECT)
    .order("created_at_iso", { ascending: false })

  if (error) throw new Error(error.message)

  const jobIds = (data ?? []).map((c) => c.job_id).filter(Boolean)
  const cleanerByJob = new Map<string, string>()

  if (jobIds.length > 0) {
    const { data: jobs } = await supabase
      .from("cleaning_jobs")
      .select("id, profiles!cleaning_jobs_cleaner_id_fkey(name)")
      .in("id", jobIds)

    for (const job of jobs ?? []) {
      const name = (job.profiles as { name?: string } | null)?.name
      if (name) cleanerByJob.set(job.id, name)
    }
  }

  return (data ?? []).map((row) => toComplaint(row, cleanerByJob))
}

export async function updateComplaint(
  supabase: SupabaseClient,
  complaintId: string,
  status: Complaint["status"],
  resolutionNote: string | undefined,
  adminId: string,
): Promise<Complaint> {
  const update: Record<string, unknown> = { status }
  if (resolutionNote !== undefined) update.resolution_note = resolutionNote
  if (status === "resolved") {
    update.resolved_at = new Date().toISOString()
    update.resolved_by = adminId
  }

  const { data, error } = await supabase
    .from("complaints")
    .update(update)
    .eq("id", complaintId)
    .select(COMPLAINT_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return toComplaint(data, new Map())
}
