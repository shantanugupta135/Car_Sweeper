"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Building,
  MapPin,
  Layers,
  Users,
  UserCheck,
  RefreshCw,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { Society, Cleaner } from "@/lib/types/api"
import { AddSocietyModal } from "../modals/add-society-modal"

export function AdminSocietiesScreen() {
  const [societies, setSocieties] = useState<Society[]>([])
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Load society and cleaner data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [socData, cleanerData] = await Promise.all([
        adminService.getSocieties(),
        adminService.getCleaners(),
      ])
      setSocieties(socData)
      setCleaners(cleanerData)
    } catch (err) {
      console.error("Failed to load society data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Callback when a society is onboarded
  const handleSocietyAdded = (newSociety: Society) => {
    setSocieties((prev) => [newSociety, ...prev])
    showToast(`Society "${newSociety.name}" onboarded successfully with ${newSociety.towers.length} towers!`)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter logic
  const filteredSocieties = societies.filter((soc) => {
    const q = searchQuery.toLowerCase()
    return (
      soc.name.toLowerCase().includes(q) ||
      soc.city.toLowerCase().includes(q) ||
      soc.area.toLowerCase().includes(q) ||
      soc.towers.some((t) => t.toLowerCase().includes(q))
    )
  })

  // Helper to get cleaners assigned to a society
  const getAssignedCleaners = (societyId: string) => {
    return cleaners.filter(
      (c) => c.assignedSocietyId === societyId
    )
  }

  // Quick stats
  const totalSocieties = societies.length
  const totalTowers = societies.reduce((acc, s) => acc + s.towers.length, 0)
  const totalSubscribers = societies.reduce((acc, s) => acc + s.totalSubscribers, 0)
  const activeCleanersAssigned = cleaners.filter((c) => c.status === "active").length

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
            <h1 className="text-2xl font-black tracking-tight text-white">Society Directory</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/40">
              {totalSocieties} Onboarded
            </span>
          </div>
          <p className="text-xs text-[#7C8C7E] mt-0.5">
            Manage apartment complexes, tower coverage, active subscribers, and cleaner assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-bold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Onboard Society</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#1E2C21] text-[#7ED37F]">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Total Societies</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{totalSocieties}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Towers Covered</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{totalTowers}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Active Subscribers</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{totalSubscribers}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#7C8C7E] uppercase font-semibold">Active Cleaners</span>
            <div className="text-xl font-bold text-[#E2F0E4]">{activeCleanersAssigned}</div>
          </div>
        </div>
      </div>

      {/* Filter & View Mode Top Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
          <input
            type="text"
            placeholder="Search by society name, city, area, tower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
          />
        </div>

        {/* View Mode Toggle & Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-[#141B15] border border-[#1E2C21] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                  : "text-[#7C8C7E] hover:text-[#E2F0E4]"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                  : "text-[#7C8C7E] hover:text-[#E2F0E4]"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-[#7C8C7E] hover:text-white hover:border-[#2E9E44]/50 transition-all"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Directory Content */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] text-center text-[#7C8C7E]">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#2E9E44]" />
            <span className="text-xs font-medium">Loading Society Directory...</span>
          </div>
        </div>
      ) : filteredSocieties.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0B0F12] border border-[#1E2C21] text-center text-[#7C8C7E]">
          <Building className="w-8 h-8 mx-auto mb-2 text-[#2E9E44]/50" />
          <p className="text-xs font-medium">No societies found matching "{searchQuery}".</p>
        </div>
      ) : viewMode === "grid" ? (
        /* Glassmorphic Dark Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSocieties.map((soc) => {
            const assignedCleaners = getAssignedCleaners(soc.id)
            return (
              <div
                key={soc.id}
                className="group relative rounded-2xl bg-[#0B0F12] border border-[#1E2C21] hover:border-[#2E9E44]/50 p-5 space-y-4 shadow-xl hover:shadow-2xl hover:shadow-[#2E9E44]/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2C21] to-[#141B15] border border-[#2E9E44]/40 flex items-center justify-center text-[#7ED37F]">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-[#7ED37F] transition-colors text-sm">
                          {soc.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-[#7C8C7E]">
                          <MapPin className="w-3 h-3 text-[#2E9E44]" />
                          <span>
                            {soc.area}, {soc.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#7C8C7E] bg-[#141B15] px-2 py-0.5 rounded border border-[#1E2C21]">
                      {soc.id}
                    </span>
                  </div>

                  {/* Towers Badges */}
                  <div>
                    <div className="text-[11px] font-semibold text-[#7C8C7E] mb-1.5 flex items-center justify-between">
                      <span>Towers List ({soc.towers.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                      {soc.towers.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-lg bg-[#141B15] border border-[#1E2C21] text-[11px] text-[#E2F0E4] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cleaners List / Pills */}
                  <div>
                    <div className="text-[11px] font-semibold text-[#7C8C7E] mb-1.5 flex items-center justify-between">
                      <span>Assigned Cleaners ({assignedCleaners.length})</span>
                    </div>
                    {assignedCleaners.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assignedCleaners.map((cleaner) => (
                          <div
                            key={cleaner.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#121E14] border border-[#2E9E44]/30 text-xs text-[#7ED37F]"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span className="font-semibold text-[11px]">{cleaner.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#536355] italic">No cleaners assigned yet</span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Subscribers & Actions */}
                <div className="pt-3 border-t border-[#1E2C21]/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#E2F0E4]">
                    <Users className="w-3.5 h-3.5 text-[#2E9E44]" />
                    <span className="font-bold text-white">{soc.totalSubscribers}</span>
                    <span className="text-[#7C8C7E] text-[11px]">Active Subscribers</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Managing society settings for ${soc.name}`)
                    }
                    className="p-1.5 rounded-lg bg-[#141B15] border border-[#1E2C21] hover:border-[#2E9E44]/50 text-[#7C8C7E] hover:text-white transition-all flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Data Table View */
        <div className="rounded-2xl bg-[#0B0F12] border border-[#1E2C21] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2F0E4]">
              <thead className="bg-[#121914] border-b border-[#1E2C21] text-[11px] font-bold text-[#7C8C7E] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Society & ID</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Towers Covered</th>
                  <th className="py-3.5 px-4">Active Subscribers</th>
                  <th className="py-3.5 px-4">Assigned Cleaners</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2C21]/60">
                {filteredSocieties.map((soc) => {
                  const assignedCleaners = getAssignedCleaners(soc.id)
                  return (
                    <tr key={soc.id} className="hover:bg-[#141B15]/80 transition-colors group">
                      {/* Society & ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2C21] to-[#141B15] border border-[#2E9E44]/40 flex items-center justify-center font-bold text-sm text-[#7ED37F]">
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#7ED37F] transition-colors">
                              {soc.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#7C8C7E]">{soc.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#C3D4C5]">
                          <MapPin className="w-3.5 h-3.5 text-[#2E9E44]" />
                          <span>
                            {soc.area}, {soc.city}
                          </span>
                        </div>
                      </td>

                      {/* Towers Covered */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {soc.towers.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded bg-[#1A251C] border border-[#2E9E44]/30 text-[10px] text-[#7ED37F] font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Subscribers Count */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141B15] border border-[#1E2C21] font-bold text-white">
                          <Users className="w-3.5 h-3.5 text-[#2E9E44]" />
                          <span>{soc.totalSubscribers} subscribers</span>
                        </div>
                      </td>

                      {/* Cleaners Count & Pills */}
                      <td className="py-4 px-4">
                        {assignedCleaners.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedCleaners.map((cleaner) => (
                              <span
                                key={cleaner.id}
                                className="px-2 py-0.5 rounded-lg bg-[#121E14] border border-[#2E9E44]/40 text-[#7ED37F] text-[11px] font-medium"
                              >
                                {cleaner.fullName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#536355] italic">None assigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => showToast(`Managing settings for ${soc.name}`)}
                          className="px-3 py-1.5 rounded-xl bg-[#141B15] border border-[#1E2C21] hover:border-[#2E9E44]/50 text-[#7C8C7E] hover:text-white text-xs font-medium transition-all"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Society Modal */}
      <AddSocietyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSocietyAdded={handleSocietyAdded}
      />
    </div>
  )
}
