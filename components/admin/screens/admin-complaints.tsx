"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { adminService } from "@/lib/services/admin-service"
import { Complaint } from "@/lib/types/api"
import { ComplaintResolutionModal } from "@/components/admin/modals/complaint-resolution-modal"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Camera,
  User,
  Car,
  ShieldCheck,
  Filter,
  Sparkles,
  FileText,
  Eye,
  RotateCcw,
  CreditCard,
  MessageSquare
} from "lucide-react"

type FilterTab = "all" | "open" | "in_review" | "resolved"

export function AdminComplaintsScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal / Drawer state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null)

  const fetchComplaints = async () => {
    try {
      const data = await adminService.getComplaints()
      setComplaints(data)
    } catch (err) {
      console.error("Failed to fetch complaints", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchComplaints()
  }

  const showToast = (text: string, type: "success" | "info" | "warning") => {
    setToastMsg({ text, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Handle Resolution Action from Modal or Table
  const handleResolutionAction = async (
    complaintId: string,
    action: "rewash" | "credit" | "resolve",
    newStatus: Complaint["status"]
  ) => {
    try {
      await adminService.updateComplaintStatus(complaintId, newStatus)
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
      )

      if (action === "rewash") {
        showToast("Priority Re-wash triggered & dispatched to cleaner!", "info")
      } else if (action === "credit") {
        showToast("₹150 Wallet Credit issued to customer account!", "success")
      } else {
        showToast("Complaint marked as Resolved!", "success")
      }

      setIsModalOpen(false)
      setSelectedComplaint(null)
    } catch (err) {
      console.error("Failed to resolve complaint", err)
    }
  }

  // KPI Calculations
  const totalComplaints = complaints.length
  const openCount = complaints.filter((c) => c.status === "open").length
  const inReviewCount = complaints.filter((c) => c.status === "in_review").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length

  // Filtering Logic
  const filteredComplaints = complaints.filter((c) => {
    if (activeTab !== "all" && c.status !== activeTab) {
      return false
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      const matchCustomer = c.consumerName.toLowerCase().includes(q)
      const matchReg = c.vehicleReg.toLowerCase().includes(q)
      const matchCleaner = c.cleanerName.toLowerCase().includes(q)
      const matchDesc = c.description.toLowerCase().includes(q)
      const matchIssue = c.issueType.toLowerCase().includes(q)
      return matchCustomer || matchReg || matchCleaner || matchDesc || matchIssue
    }

    return true
  })

  // Issue Type helper function
  const getIssueBadge = (type: Complaint["issueType"]) => {
    switch (type) {
      case "missed_wash":
        return { label: "Missed Wash", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" }
      case "poor_quality":
        return { label: "Poor Quality", color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" }
      case "scratch_or_damage":
        return { label: "Scratch / Damage", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
      case "other":
      default:
        return { label: "Other", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" }
    }
  }

  const openResolutionModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-white">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all animate-bounce ${
            toastMsg.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : toastMsg.type === "info"
              ? "bg-cyan-950/90 border-cyan-500/40 text-cyan-200"
              : "bg-amber-950/90 border-amber-500/40 text-amber-200"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : toastMsg.type === "info" ? (
            <RotateCcw className="w-5 h-5 text-cyan-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <span className="text-sm font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              TICKET RESOLUTION DESK
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Complaint Resolution Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit consumer feedback, inspect photo evidence, and issue instant re-washes or wallet credits.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[var(--glass-border)] text-sm font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Desk"}
        </button>
      </div>

      {/* KPI Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Complaints */}
        <GlassCard className="space-y-2 border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Complaints</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalComplaints}</p>
          <p className="text-[11px] text-slate-400">All Logged Tickets</p>
        </GlassCard>

        {/* Open Tickets */}
        <GlassCard className="space-y-2 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Open Tickets</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">{openCount}</p>
          <p className="text-[11px] text-rose-400/80">Requires Immediate Action</p>
        </GlassCard>

        {/* In Review */}
        <GlassCard className="space-y-2 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>In Review</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300 font-mono">{inReviewCount}</p>
          <p className="text-[11px] text-cyan-400/80">Re-wash or Audit Active</p>
        </GlassCard>

        {/* Resolved Today */}
        <GlassCard className="space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</p>
          <p className="text-[11px] text-emerald-400/80">Closed & Satisfied</p>
        </GlassCard>
      </div>

      {/* Filter Tabs & Search Control Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(
              [
                { id: "all", label: "All", count: totalComplaints },
                { id: "open", label: "Open", count: openCount },
                { id: "in_review", label: "In Review", count: inReviewCount },
                { id: "resolved", label: "Resolved", count: resolvedCount }
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FilterTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-white/15 text-white shadow-inner border border-white/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.3 rounded-full text-[10px] font-mono ${
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
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, vehicle, cleaner, description..."
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

      {/* Complaints Queue Table / Card List */}
      <GlassCard className="p-0 overflow-hidden border border-[var(--glass-border)]">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-sm">Loading complaints queue...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-slate-200">No complaints match your filter</p>
            <p className="text-xs text-slate-400">
              All clear! Try switching tabs or modifying your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ticket / Issue</th>
                  <th className="py-3.5 px-4">Customer & Vehicle</th>
                  <th className="py-3.5 px-4">Cleaner Assigned</th>
                  <th className="py-3.5 px-4">Description & Evidence</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredComplaints.map((c) => {
                  const issueBadge = getIssueBadge(c.issueType)

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => openResolutionModal(c)}
                    >
                      {/* Ticket / Issue Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="font-mono text-xs font-bold text-slate-300">
                            #{c.id.toUpperCase()}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${issueBadge.color}`}
                          >
                            {issueBadge.label}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.createdAt}
                          </div>
                        </div>
                      </td>

                      {/* Customer & Vehicle */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">
                          {c.consumerName}
                        </div>
                        <div className="font-mono text-xs text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                          <Car className="w-3 h-3 text-cyan-400" />
                          {c.vehicleReg}
                        </div>
                      </td>

                      {/* Cleaner Assigned */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {c.cleanerName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Assigned Cleaner
                        </div>
                      </td>

                      {/* Description & Photo Evidence Thumbnail */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3 max-w-sm">
                          {/* Thumbnail preview if photos exist */}
                          {c.photoUrls && c.photoUrls.length > 0 ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                              <img
                                src={c.photoUrls[0]}
                                alt="Evidence thumbnail"
                                className="w-full h-full object-cover"
                              />
                              {c.photoUrls.length > 1 && (
                                <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[9px] font-bold text-cyan-300">
                                  +{c.photoUrls.length - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-500">
                              <Camera className="w-4 h-4" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <p className="text-slate-300 text-xs line-clamp-2 leading-snug">
                              "{c.description}"
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            c.status === "resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : c.status === "in_review"
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.status === "resolved"
                                ? "bg-emerald-400"
                                : c.status === "in_review"
                                ? "bg-cyan-400 animate-pulse"
                                : "bg-rose-400"
                            }`}
                          />
                          <span className="capitalize">{c.status.replace("_", " ")}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openResolutionModal(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Resolve Ticket</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Complaint Resolution Modal / Drawer */}
      <ComplaintResolutionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedComplaint(null)
        }}
        complaint={selectedComplaint}
        onResolveAction={handleResolutionAction}
      />
    </div>
  )
}
