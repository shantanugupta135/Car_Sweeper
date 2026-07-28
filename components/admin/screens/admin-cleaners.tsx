"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Sparkles,
  Phone,
  Building,
  Star,
  KeyRound,
  Check,
  Copy,
  Edit2,
  RefreshCw,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
} from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { Cleaner } from "@/lib/types/api"
import { AddCleanerModal } from "../modals/add-cleaner-modal"
import { EditCleanerModal } from "../modals/edit-cleaner-modal"

export function AdminCleanersScreen() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [editingCleaner, setEditingCleaner] = useState<Cleaner | null>(null)

  // Load cleaner roster
  const loadCleaners = async () => {
    setLoading(true)
    try {
      const data = await adminService.getCleaners()
      setCleaners(data)
    } catch (err) {
      console.error("Failed to load cleaners", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCleaners()
  }, [])

  // Callback when a new cleaner is added
  const handleCleanerAdded = (newCleaner: Cleaner) => {
    setCleaners((prev) => [newCleaner, ...prev])
    showToast(`Cleaner "${newCleaner.fullName}" onboarded successfully! PIN: ${newCleaner.accessPin}`)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const applyCleaner = (updated: Cleaner) => {
    setCleaners((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleCleanerUpdated = (updated: Cleaner) => {
    applyCleaner(updated)
    showToast(`Saved changes for ${updated.fullName}`)
  }

  /** Quick duty toggle — an inactive cleaner is skipped when the roster is built. */
  const handleToggleStatus = async (cleaner: Cleaner) => {
    const nextStatus = cleaner.status === "active" ? "on_leave" : "active"
    try {
      const updated = await adminService.updateCleaner(cleaner.id, { status: nextStatus })
      applyCleaner(updated)
      showToast(
        nextStatus === "active"
          ? `${cleaner.fullName} is back on active duty`
          : `${cleaner.fullName} marked on leave — new jobs will route elsewhere`
      )
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update the cleaner")
    }
  }

  const handleCopyPin = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin)
    setCopiedPinId(id)
    setTimeout(() => setCopiedPinId(null), 2000)
  }

  // Filter logic
  const filteredCleaners = cleaners.filter((cleaner) => {
    const matchesSearch =
      cleaner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cleaner.phone.includes(searchQuery) ||
      cleaner.assignedSocietyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cleaner.assignedTowers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "all" || cleaner.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Quick stats
  const totalCleaners = cleaners.length
  const activeCleaners = cleaners.filter((c) => c.status === "active").length
  const avgRating =
    cleaners.length > 0
      ? (cleaners.reduce((acc, c) => acc + c.rating, 0) / cleaners.length).toFixed(1)
      : "5.0"
  const totalWashesToday = cleaners.reduce((acc, c) => acc + c.completedToday, 0)
  const totalAssignedToday = cleaners.reduce((acc, c) => acc + c.totalAssignedToday, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-[#18261B] to-[#121E14] border border-[#2E9E44] text-[#E2F0E4] shadow-2xl text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#7ED37F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Cleaner Management</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/40">
              {totalCleaners} Onboarded
            </span>
          </div>
          <p className="text-xs text-[#7C8C7E] mt-0.5">
            Manage cleaner directory, society assignments, daily wash quotas, and mobile access PINs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-bold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Cleaner</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#1E2C21] text-[#7ED37F]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Total Roster</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{totalCleaners}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Active Today</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{activeCleaners}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Avg Roster Rating</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{avgRating} ★</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Today's Washes</span>
            <div className="text-xl font-bold text-[#E2F0E4]">
              {totalWashesToday} / {totalAssignedToday}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar: Search & Status Filter */}
      <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
          <input
            type="text"
            placeholder="Search by cleaner name, phone, society, tower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
          />
        </div>

        {/* Filter & Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-[#141B15] border border-[#1E2C21] p-1 rounded-xl">
            {["all", "active", "on_leave", "inactive"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                    : "text-[#7C8C7E] hover:text-[#E2F0E4] hover:bg-[#1E2C21]"
                }`}
              >
                {st === "all" ? "All Status" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadCleaners}
            className="p-2.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-[#7C8C7E] hover:text-white hover:border-[#2E9E44]/50 transition-all"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl bg-[#0B0F12] border border-[#1E2C21] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2F0E4]">
            <thead className="bg-[#121914] border-b border-[#1E2C21] text-[11px] font-bold text-[#7C8C7E] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Cleaner & ID</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Assigned Society & Towers</th>
                <th className="py-3.5 px-4">Daily Wash Quota</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Access PIN</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2C21]/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#7C8C7E]">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#2E9E44]" />
                      <span>Loading Cleaner Roster...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCleaners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#7C8C7E]">
                    No cleaners found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCleaners.map((cleaner) => {
                  const quotaPercent =
                    cleaner.totalAssignedToday > 0
                      ? Math.round((cleaner.completedToday / cleaner.totalAssignedToday) * 100)
                      : 0

                  return (
                    <tr
                      key={cleaner.id}
                      className="hover:bg-[#141B15]/80 transition-colors group"
                    >
                      {/* Cleaner Name & ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2C21] to-[#141B15] border border-[#2E9E44]/40 flex items-center justify-center font-bold text-sm text-[#7ED37F]">
                            {cleaner.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#7ED37F] transition-colors">
                              {cleaner.fullName}
                            </div>
                            <div className="text-[10px] font-mono text-[#7C8C7E]">{cleaner.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#C3D4C5]">
                          <Phone className="w-3.5 h-3.5 text-[#7C8C7E]" />
                          <span>{cleaner.phone}</span>
                        </div>
                      </td>

                      {/* Society & Towers */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Building className="w-3.5 h-3.5 text-[#2E9E44]" />
                            <span>{cleaner.assignedSocietyName || "Unassigned"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {cleaner.assignedTowers.map((tower) => (
                              <span
                                key={tower}
                                className="px-1.5 py-0.5 rounded bg-[#1A251C] border border-[#2E9E44]/30 text-[10px] text-[#7ED37F] font-mono"
                              >
                                {tower}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Daily Wash Quota */}
                      <td className="py-4 px-4 min-w-[160px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-white">
                              {cleaner.completedToday} / {cleaner.totalAssignedToday || cleaner.maxDailyCapacity} cars
                            </span>
                            <span className="text-[#7C8C7E] font-mono">{quotaPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#182019] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#2E9E44] to-[#7ED37F] rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-[#7C8C7E]">
                            Max Limit: {cleaner.maxDailyCapacity} / day
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{cleaner.rating.toFixed(1)}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {cleaner.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        )}
                        {cleaner.status === "on_leave" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            On Leave
                          </span>
                        )}
                        {cleaner.status === "inactive" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Mobile Access PIN Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleCopyPin(cleaner.accessPin, cleaner.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141B15] border border-[#2E9E44]/40 hover:border-[#2E9E44] transition-all group/pin"
                          title="Click to copy Mobile Access PIN"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#7ED37F]" />
                          <span className="font-mono font-bold text-xs tracking-wider text-[#E2F0E4]">
                            {cleaner.accessPin || "N/A"}
                          </span>
                          {copiedPinId === cleaner.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-[#7C8C7E] group-hover/pin:text-white" />
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cleaner)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#141B15] border border-[#1E2C21] hover:border-[#2E9E44]/50 text-[#7C8C7E] hover:text-[#E2F0E4] text-[11px] font-medium transition-all"
                            title={
                              cleaner.status === "active"
                                ? "Put on leave — today's unassigned work routes to other cleaners"
                                : "Return to active duty"
                            }
                          >
                            {cleaner.status === "active" ? "Put on Leave" : "Set Active"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCleaner(cleaner)}
                            className="p-1.5 rounded-lg bg-[#141B15] border border-[#1E2C21] hover:border-[#2E9E44]/50 text-[#7C8C7E] hover:text-white transition-all"
                            title="Edit coverage, capacity and status"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cleaner Modal */}
      <AddCleanerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCleanerAdded={handleCleanerAdded}
      />

      {/* Edit Cleaner Modal */}
      <EditCleanerModal
        cleaner={editingCleaner}
        onClose={() => setEditingCleaner(null)}
        onCleanerUpdated={handleCleanerUpdated}
      />
    </div>
  )
}
