"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { adminService } from "@/lib/services/admin-service"
import { DailyCleanJob } from "@/lib/types/api"
import { PhotoAuditModal } from "@/components/admin/modals/photo-audit-modal"
import {
  Activity,
  Car,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  RefreshCw,
  CalendarPlus,
  Camera,
  User,
  MapPin,
  Filter,
  Sparkles,
  ShieldCheck,
  Check,
  Building,
  Eye
} from "lucide-react"

type FilterTab = "all" | "completed" | "in_progress" | "pending" | "skipped"

export function AdminDailyMonitorScreen() {
  const [jobs, setJobs] = useState<DailyCleanJob[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Audit modal state
  const [selectedJob, setSelectedJob] = useState<DailyCleanJob | null>(null)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "warning" } | null>(null)

  const fetchJobs = async () => {
    try {
      const data = await adminService.getDailyJobs()
      setJobs(data)
    } catch (err) {
      console.error("Failed to load daily jobs", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchJobs()
  }

  /**
   * Builds the day's roster: one job per vehicle with an active subscription
   * that is not paused, assigned to a cleaner covering that tower. This is what
   * puts work into the cleaners' task lists in the mobile app.
   */
  const handleGenerateRoster = async () => {
    setGenerating(true)
    try {
      const result = await adminService.generateDailyJobs()
      setJobs(result.jobs)
      showToast(
        result.created > 0
          ? `${result.created} wash${result.created === 1 ? "" : "es"} scheduled and assigned`
          : "Every eligible vehicle is already scheduled for today",
        result.created > 0 ? "success" : "warning"
      )
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not build the roster", "warning")
    } finally {
      setGenerating(false)
    }
  }

  // Handle audit modal approval
  const handleApproveJob = async (jobId: string) => {
    try {
      await adminService.updateJobStatus(jobId, "completed", 5)
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: "completed",
                rating: 5,
                completedAt: j.completedAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            : j
        )
      )
      showToast("Wash approved & 5★ rating confirmed", "success")
    } catch (err) {
      console.error("Error approving job", err)
    }
  }

  // Handle audit modal flag
  const handleFlagJob = async (jobId: string) => {
    try {
      await adminService.updateJobStatus(jobId, "skipped")
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "skipped" } : j))
      )
      showToast("Job flagged for re-wash inspection", "warning")
    } catch (err) {
      console.error("Error flagging job", err)
    }
  }

  const showToast = (text: string, type: "success" | "warning") => {
    setToastMsg({ text, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  // KPI Calculations
  const totalScheduled = jobs.length
  const completedCount = jobs.filter((j) => j.status === "completed").length
  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length
  const pendingCount = jobs.filter((j) => j.status === "pending").length
  const skippedCount = jobs.filter((j) => j.status === "skipped").length

  // Filtered jobs list
  const filteredJobs = jobs.filter((job) => {
    // Filter Tab
    if (activeTab !== "all" && job.status !== activeTab) {
      return false
    }

    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      const matchReg = job.vehicleReg.toLowerCase().includes(q)
      const matchModel = job.vehicleModel.toLowerCase().includes(q)
      const matchOwner = job.ownerName.toLowerCase().includes(q)
      const matchCleaner = job.cleanerName.toLowerCase().includes(q)
      const matchSociety = job.societyName.toLowerCase().includes(q)
      const matchTower = job.tower.toLowerCase().includes(q)
      return matchReg || matchModel || matchOwner || matchCleaner || matchSociety || matchTower
    }

    return true
  })

  const openAuditModal = (job: DailyCleanJob) => {
    setSelectedJob(job)
    setIsAuditModalOpen(true)
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-white">
      {/* Toast Banner */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-3 backdrop-blur-md transition-all animate-bounce ${
            toastMsg.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/40 text-rose-200"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-medium">{toastMsg.text}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE MONITOR FEED
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Today: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Daily Cleaning Monitor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time operations dashboard, cleaner queue tracking, and wash photo audits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleGenerateRoster}
            disabled={generating}
            title="Create today's jobs from active subscriptions and assign cleaners by tower"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-sm font-semibold text-emerald-300 transition-all disabled:opacity-50"
          >
            <CalendarPlus className={`w-4 h-4 ${generating ? "animate-pulse" : ""}`} />
            {generating ? "Building..." : "Generate Roster"}
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--glass-border)] text-sm font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>
      </div>

      {/* KPI Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Scheduled */}
        <GlassCard className="space-y-2 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Washes</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalScheduled}</p>
          <p className="text-[11px] text-slate-400">Scheduled Today</p>
        </GlassCard>

        {/* Completed */}
        <GlassCard className="space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{completedCount}</p>
          <p className="text-[11px] text-emerald-500/80">
            {totalScheduled > 0 ? `${Math.round((completedCount / totalScheduled) * 100)}% done` : '0%'}
          </p>
        </GlassCard>

        {/* In Progress */}
        <GlassCard className="space-y-2 border-l-4 border-l-cyan-400">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>In Progress</span>
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-cyan-300 font-mono">{inProgressCount}</p>
          <p className="text-[11px] text-cyan-400/80">Active On-Site</p>
        </GlassCard>

        {/* Pending */}
        <GlassCard className="space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300 font-mono">{pendingCount}</p>
          <p className="text-[11px] text-amber-400/80">Queued in Line</p>
        </GlassCard>

        {/* Skipped / Flagged */}
        <GlassCard className="space-y-2 border-l-4 border-l-rose-500 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Skipped / Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">{skippedCount}</p>
          <p className="text-[11px] text-rose-400/80">Requires Review</p>
        </GlassCard>
      </div>

      {/* Filter Tabs & Search Control Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(
              [
                { id: "all", label: "All", count: totalScheduled, color: "slate" },
                { id: "completed", label: "Completed", count: completedCount, color: "emerald" },
                { id: "in_progress", label: "In Progress", count: inProgressCount, color: "cyan" },
                { id: "pending", label: "Pending", count: pendingCount, color: "amber" },
                { id: "skipped", label: "Skipped", count: skippedCount, color: "rose" },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FilterTab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white/15 text-white shadow-inner border border-white/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Reg, Owner, Cleaner, Society..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Live Cleaning Queue Table */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--glass-border)]">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-sm">Loading live daily cleaning queue...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-200">No jobs match your filter</p>
            <p className="text-xs text-slate-400">
              Try switching tabs or clearing your search term to see more scheduled washes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Time / Status</th>
                  <th className="py-3.5 px-4">Vehicle Reg & Model</th>
                  <th className="py-3.5 px-4">Owner & Parking Bay</th>
                  <th className="py-3.5 px-4">Assigned Cleaner</th>
                  <th className="py-3.5 px-4">Society & Tower</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Time / Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            job.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : job.status === "in_progress"
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                              : job.status === "skipped"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              job.status === "completed"
                                ? "bg-emerald-400"
                                : job.status === "in_progress"
                                ? "bg-cyan-400 animate-pulse"
                                : job.status === "skipped"
                                ? "bg-rose-400"
                                : "bg-amber-400"
                            }`}
                          />
                          <span className="capitalize">{job.status.replace("_", " ")}</span>
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono pl-1">
                          {job.completedAt ? `Finished ${job.completedAt}` : "Scheduled Today"}
                        </div>
                      </div>
                    </td>

                    {/* Vehicle Reg & Model */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-sm font-bold text-white tracking-wide">
                        {job.vehicleReg}
                      </div>
                      <div className="text-slate-400 text-xs truncate max-w-[160px]">
                        {job.vehicleModel}
                      </div>
                    </td>

                    {/* Owner & Parking Bay */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {job.ownerName}
                      </div>
                      <div className="text-slate-400 text-xs font-mono flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        Bay: <span className="text-slate-300 font-semibold">{job.parkingSpot}</span>
                      </div>
                    </td>

                    {/* Assigned Cleaner */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {job.cleanerName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Cleaner ID: #{job.cleanerId}
                      </div>
                    </td>

                    {/* Society & Tower */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 truncate max-w-[180px]">
                        {job.societyName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {job.tower}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openAuditModal(job)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          job.beforePhotoUrl || job.afterPhotoUrl
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-sm"
                            : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Photos</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Photo Audit Modal */}
      <PhotoAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false)
          setSelectedJob(null)
        }}
        job={selectedJob}
        onApprove={handleApproveJob}
        onFlag={handleFlagJob}
      />
    </div>
  )
}
