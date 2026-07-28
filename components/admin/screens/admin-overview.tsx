"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { adminService, type OverviewStats } from "@/lib/services/admin-service"
import { Society, Cleaner, Consumer, DailyCleanJob, Complaint } from "@/lib/types/api"
import { useNavigation } from "@/lib/navigation-context"
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Building2,
  DollarSign,
  ArrowUpRight,
  Activity,
  Star,
  ChevronRight,
  Shield,
  Clock,
  Car
} from "lucide-react"

export function AdminOverviewScreen() {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [societies, setSocieties] = useState<Society[]>([])
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [consumers, setConsumers] = useState<Consumer[]>([])
  const [jobs, setJobs] = useState<DailyCleanJob[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState<OverviewStats | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [socs, clns, cons, jbs, cmps, ovw] = await Promise.all([
          adminService.getSocieties(),
          adminService.getCleaners(),
          adminService.getConsumers(),
          adminService.getDailyJobs(),
          adminService.getComplaints(),
          adminService.getOverviewStats(),
        ])
        setSocieties(socs)
        setCleaners(clns)
        setConsumers(cons)
        setJobs(jbs)
        setComplaints(cmps)
        setStats(ovw)
      } catch (err) {
        console.error("Failed loading admin overview data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Dynamic calculations
  const activeCleaners = cleaners.filter((c) => c.status === "active")
  const avgCleanerRating =
    cleaners.length > 0
      ? (cleaners.reduce((acc, c) => acc + c.rating, 0) / cleaners.length).toFixed(1)
      : "5.0"

  const totalSubscribers =
    societies.length > 0
      ? societies.reduce((acc, s) => acc + s.totalSubscribers, 0)
      : consumers.length

  const totalAssignedToday = cleaners.reduce((acc, c) => acc + c.totalAssignedToday, 0)
  const totalCompletedToday = cleaners.reduce((acc, c) => acc + c.completedToday, 0)
  const completionRate =
    totalAssignedToday > 0
      ? Math.round((totalCompletedToday / totalAssignedToday) * 100)
      : 88

  const openComplaintsCount = complaints.filter(
    (c) => c.status === "open" || c.status === "in_review"
  ).length

  // Monthly recurring revenue, summed from active subscriptions by the API.
  const mrrFormatted = stats ? `₹${stats.mrrInr.toLocaleString("en-IN")}` : "—"

  // Last 7 days of completion rate; today's bar reflects the live roster.
  const completionTrend = (stats?.completionTrend ?? []).map((entry, index, all) =>
    index === all.length - 1
      ? { ...entry, day: "Today", rate: completionRate, isToday: true }
      : { ...entry, isToday: false }
  )

  const weeklyAverage =
    completionTrend.length > 0
      ? (completionTrend.reduce((sum, e) => sum + e.rate, 0) / completionTrend.length).toFixed(1)
      : "0.0"

  // Recent operational activity items
  const recentActivities = [
    {
      id: "act-1",
      title: "Ramesh Kumar completed Tower A washes",
      subtitle: "22/25 cars washed in Green Acres Residency",
      time: "10 mins ago",
      icon: CheckCircle2,
      color: "text-[#7ED37F]",
      bg: "bg-[#2E9E44]/10",
    },
    {
      id: "act-2",
      title: "New complaint logged by Rohan Gupta",
      subtitle: "Sun City Apartments • Issue: Poor Quality",
      time: "25 mins ago",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      action: () => navigate("admin-complaints"),
    },
    {
      id: "act-3",
      title: "Vikram Singh finished Block 1 & 2 quota",
      subtitle: "28/28 washes completed with 100% photo proof",
      time: "1 hour ago",
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: "act-4",
      title: "Aarav Sharma added new vehicle MH 02 CZ 4821",
      subtitle: "Tower A, Flat A-402 • BMW 3 Series",
      time: "2 hours ago",
      icon: Car,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      action: () => navigate("admin-consumers"),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E9E44] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#7C8C7E]">Loading Executive Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#141E16] via-[#18231B] to-[#0E1510] p-5 rounded-2xl border border-[#1E2C21] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-[#2E9E44]/10 to-transparent pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Executive Operations Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/30">
              Live Systems Normal
            </span>
          </div>
          <p className="text-xs text-[#7C8C7E]">
            Real-time overview of subscriptions, cleaner roster performance, society coverage & quality control.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => navigate("admin-daily-monitor")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E2C21]/80 hover:bg-[#2A3D2F] border border-[#2E9E44]/40 text-xs font-medium text-[#E2F0E4] transition-all cursor-pointer shadow-md"
          >
            <Clock className="w-4 h-4 text-[#7ED37F]" />
            <span>Live Monitor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Monthly Revenue */}
        <GlassCard className="relative overflow-hidden border border-[#1E2C21] bg-[#121A14]/80 hover:border-[#2E9E44]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#7C8C7E]">Total MRR</span>
            <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{mrrFormatted}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#7ED37F]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">+14.2%</span>
            <span className="text-[#7C8C7E]">vs last month</span>
          </div>
        </GlassCard>

        {/* Card 2: Active Subscribers */}
        <GlassCard
          onClick={() => navigate("admin-consumers")}
          className="relative overflow-hidden border border-[#1E2C21] bg-[#121A14]/80 hover:border-[#2E9E44]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#7C8C7E]">Subscribers</span>
            <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{totalSubscribers}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#7C8C7E]">
            <span className="text-[#7ED37F] font-semibold">{societies.length} Societies</span>
            <span>onboarded</span>
          </div>
        </GlassCard>

        {/* Card 3: Daily Clean Completion Rate */}
        <GlassCard
          onClick={() => navigate("admin-daily-monitor")}
          className="relative overflow-hidden border border-[#1E2C21] bg-[#121A14]/80 hover:border-[#2E9E44]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#7C8C7E]">Today Completion</span>
            <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{completionRate}%</div>
          <div className="mt-2 w-full bg-[#1A261D] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2E9E44] to-[#7ED37F] h-full rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </GlassCard>

        {/* Card 4: Active Cleaner Roster */}
        <GlassCard
          onClick={() => navigate("admin-cleaners")}
          className="relative overflow-hidden border border-[#1E2C21] bg-[#121A14]/80 hover:border-[#2E9E44]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#7C8C7E]">Cleaners Roster</span>
            <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{activeCleaners.length}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{avgCleanerRating} Avg Rating</span>
          </div>
        </GlassCard>

        {/* Card 5: Open Complaints Highlight */}
        <GlassCard
          onClick={() => navigate("admin-complaints")}
          className={`relative overflow-hidden border transition-all cursor-pointer ${
            openComplaintsCount > 0
              ? "border-amber-500/40 bg-amber-950/10 hover:border-amber-500"
              : "border-[#1E2C21] bg-[#121A14]/80 hover:border-[#2E9E44]/50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#7C8C7E]">Open Complaints</span>
            <div
              className={`p-2 rounded-lg border ${
                openComplaintsCount > 0
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-400 animate-pulse"
                  : "bg-[#2E9E44]/10 border-[#2E9E44]/20 text-[#7ED37F]"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{openComplaintsCount}</div>
          <div
            className={`flex items-center gap-1 mt-2 text-[11px] font-medium ${
              openComplaintsCount > 0 ? "text-amber-400" : "text-[#7ED37F]"
            }`}
          >
            {openComplaintsCount > 0 ? (
              <>
                <span>Action required</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <span>All tickets resolved</span>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Main Section: 7-Day Completion Trend + Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Completion Rate Trend */}
        <GlassCard className="lg:col-span-2 border border-[#1E2C21] bg-[#121A14]/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">7-Day Cleaning Quality & Completion Trend</h2>
                <p className="text-[11px] text-[#7C8C7E]">Overall wash fulfillment consistency across all societies</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#7ED37F] bg-[#2E9E44]/20 px-2.5 py-1 rounded-full border border-[#2E9E44]/30">
              Avg {weeklyAverage}%
            </span>
          </div>

          {/* Trend Bar Chart Visualization */}
          <div className="pt-4 pb-2 px-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 border-b border-[#1E2C21] pb-3">
              {completionTrend.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#7ED37F] opacity-80 group-hover:opacity-100 transition-all">
                    {item.rate}%
                  </span>
                  <div className="w-full max-w-[36px] bg-[#1A261D] rounded-t-lg h-32 flex items-end p-1 relative overflow-hidden">
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        item.isToday
                          ? "bg-gradient-to-t from-[#2E9E44] via-[#45bf5c] to-[#7ED37F] shadow-lg shadow-[#2E9E44]/40"
                          : "bg-gradient-to-t from-[#1b5e29] to-[#2E9E44] group-hover:from-[#237735] group-hover:to-[#3dbb56]"
                      }`}
                      style={{ height: `${item.rate}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className={`text-[11px] font-medium ${item.isToday ? "text-[#7ED37F] font-bold" : "text-[#7C8C7E]"}`}>
                      {item.day}
                    </p>
                    <p className="text-[9px] text-[#556657]">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7C8C7E] pt-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E44]" />
                <span>Standard Wash Target (90%+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7ED37F]" />
                <span>Today's Execution</span>
              </div>
            </div>
            <span className="text-[11px] italic">Updated 5 mins ago</span>
          </div>
        </GlassCard>

        {/* Revenue & Subscriber Distribution by Society */}
        <GlassCard className="border border-[#1E2C21] bg-[#121A14]/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#7ED37F]" />
              <h2 className="text-sm font-bold text-white">Society Distribution</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("admin-societies")}
              className="text-xs text-[#7ED37F] hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {societies.map((soc, idx) => {
              const sharePercent =
                totalSubscribers > 0
                  ? Math.round((soc.totalSubscribers / totalSubscribers) * 100)
                  : 50
              const estRevenue = Math.round((148500 * sharePercent) / 100)

              return (
                <div key={soc.id} className="space-y-1.5 p-3 rounded-xl bg-[#162118]/60 border border-[#1E2C21]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[160px]">{soc.name}</span>
                    <span className="font-bold text-[#7ED37F]">₹{estRevenue.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#7C8C7E]">
                    <span>{soc.totalSubscribers} active cars</span>
                    <span>{sharePercent}% of total MRR</span>
                  </div>

                  <div className="w-full bg-[#1E2C21] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 0 ? "bg-gradient-to-r from-[#2E9E44] to-[#7ED37F]" : "bg-gradient-to-r from-[#1f7030] to-[#2E9E44]"
                      }`}
                      style={{ width: `${sharePercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* Recent Operational Activity Feed */}
      <GlassCard className="border border-[#1E2C21] bg-[#121A14]/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2E9E44]/10 border border-[#2E9E44]/20 text-[#7ED37F]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Live Operations Feed</h2>
              <p className="text-[11px] text-[#7C8C7E]">Real-time system events, cleaner logs, and customer alerts</p>
            </div>
          </div>

          <span className="text-xs text-[#7C8C7E] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7ED37F] animate-ping" />
            <span>Auto-refreshing</span>
          </span>
        </div>

        <div className="divide-y divide-[#1E2C21]/60">
          {recentActivities.map((act) => {
            const Icon = act.icon
            return (
              <div
                key={act.id}
                onClick={act.action}
                className={`py-3 flex items-start justify-between gap-3 first:pt-1 last:pb-1 transition-all ${
                  act.action ? "cursor-pointer hover:bg-[#18251B]/40 px-2 rounded-lg -mx-2" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border border-white/5 shrink-0 ${act.bg} ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#E2F0E4]">{act.title}</h3>
                    <p className="text-[11px] text-[#7C8C7E]">{act.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#556657] whitespace-nowrap">{act.time}</span>
                  {act.action && <ChevronRight className="w-3.5 h-3.5 text-[#7C8C7E]" />}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
