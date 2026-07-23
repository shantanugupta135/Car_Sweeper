"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Car,
  Users,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  CreditCard,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
} from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { Consumer, Society, Vehicle } from "@/lib/types/api"

export function AdminConsumersScreen() {
  const [consumers, setConsumers] = useState<Consumer[]>([])
  const [societies, setSocieties] = useState<Society[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [societyFilter, setSocietyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Interactive UI state
  const [expandedConsumerId, setExpandedConsumerId] = useState<string | null>(null)
  const [selectedConsumerDrawer, setSelectedConsumerDrawer] = useState<Consumer | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Load consumers and societies
  const loadData = async () => {
    setLoading(true)
    try {
      const [consData, socData] = await Promise.all([
        adminService.getConsumers(),
        adminService.getSocieties(),
      ])
      setConsumers(consData)
      setSocieties(socData)
    } catch (err) {
      console.error("Failed to fetch consumers:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculated KPIs
  const totalConsumers = consumers.length
  const activeSubscriptions = consumers.filter((c) => c.subscriptionStatus === "active").length
  const registeredVehiclesCount = consumers.reduce(
    (acc, c) => acc + (c.registeredVehicles?.length || 0),
    0
  )
  const pausedAccounts = consumers.filter((c) => c.subscriptionStatus === "paused").length
  const expiredAccounts = consumers.filter((c) => c.subscriptionStatus === "expired").length

  // Filtered list
  const filteredConsumers = useMemo(() => {
    return consumers.filter((c) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.societyName.toLowerCase().includes(q) ||
        c.flatNo.toLowerCase().includes(q) ||
        c.registeredVehicles.some(
          (v) =>
            v.registrationNumber.toLowerCase().includes(q) ||
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.parkingSpot.toLowerCase().includes(q)
        )

      const matchesSociety =
        societyFilter === "all" ||
        c.societyId === societyFilter ||
        c.societyName.toLowerCase() === societyFilter.toLowerCase()

      const matchesStatus =
        statusFilter === "all" || c.subscriptionStatus === statusFilter

      return matchesSearch && matchesSociety && matchesStatus
    })
  }, [consumers, searchQuery, societyFilter, statusFilter])

  // Toggle expand row
  const toggleExpand = (id: string) => {
    setExpandedConsumerId((prev) => (prev === id ? null : id))
  }

  // Toggle pause/resume consumer status (mock action)
  const handleToggleStatus = (consumerId: string) => {
    setConsumers((prev) =>
      prev.map((c) => {
        if (c.id === consumerId) {
          const nextStatus: Consumer["subscriptionStatus"] =
            c.subscriptionStatus === "active"
              ? "paused"
              : c.subscriptionStatus === "paused"
              ? "active"
              : "active"
          showToast(
            `Updated ${c.fullName}'s subscription to ${nextStatus.toUpperCase()}`
          )
          return { ...c, subscriptionStatus: nextStatus }
        }
        return c;
      })
    )
    if (selectedConsumerDrawer?.id === consumerId) {
      setSelectedConsumerDrawer((prev) =>
        prev
          ? {
              ...prev,
              subscriptionStatus:
                prev.subscriptionStatus === "active" ? "paused" : "active",
            }
          : null
      )
    }
  }

  // Helper for mock renewal date
  const getRenewalDate = (consumer: Consumer) => {
    if (consumer.subscriptionStatus === "expired") {
      return "Expired on June 30, 2026"
    }
    if (consumer.subscriptionStatus === "paused") {
      return "Paused (Auto-resumes Aug 01, 2026)"
    }
    return "Renews Aug 23, 2026 (Monthly)"
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-[#18261B] to-[#121E14] border border-[#2E9E44] text-[#E2F0E4] shadow-2xl text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#7ED37F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Consumer & Vehicle Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/30">
              {totalConsumers} Accounts
            </span>
          </div>
          <p className="text-xs text-[#7C8C7E] mt-1">
            Manage car owners, parking bay allocations, active subscriptions, and renewal status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#182019] hover:bg-[#1E2C21] border border-[#1E2C21] text-xs font-medium text-[#C8D9CB] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top KPI Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Total Consumers */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182019] to-[#111712] border border-[#1E2C21] shadow-lg relative overflow-hidden group hover:border-[#2E9E44]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7C8C7E]">Total Consumers</span>
            <div className="p-2 rounded-xl bg-[#2E9E44]/10 text-[#7ED37F]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{totalConsumers}</span>
            <span className="text-[10px] font-medium text-emerald-400">Registered</span>
          </div>
          <div className="mt-2 text-[11px] text-[#7C8C7E]">
            Across {societies.length || 2} partnered societies
          </div>
        </div>

        {/* KPI 2: Active Subscriptions */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182019] to-[#111712] border border-[#1E2C21] shadow-lg relative overflow-hidden group hover:border-[#2E9E44]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7C8C7E]">Active Subscriptions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {activeSubscriptions}
            </span>
            <span className="text-[10px] font-medium text-emerald-400/80">
              {totalConsumers > 0
                ? `${Math.round((activeSubscriptions / totalConsumers) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7C8C7E]">Currently receiving daily care</div>
        </div>

        {/* KPI 3: Registered Vehicles */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182019] to-[#111712] border border-[#1E2C21] shadow-lg relative overflow-hidden group hover:border-[#2E9E44]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7C8C7E]">Registered Vehicles</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-400 tracking-tight">
              {registeredVehiclesCount}
            </span>
            <span className="text-[10px] font-medium text-blue-400/80">
              {totalConsumers > 0 ? (registeredVehiclesCount / totalConsumers).toFixed(1) : 1} / owner
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7C8C7E]">Mapped to parking bays</div>
        </div>

        {/* KPI 4: Paused Accounts */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182019] to-[#111712] border border-[#1E2C21] shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7C8C7E]">Paused Accounts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <PauseCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 tracking-tight">
              {pausedAccounts}
            </span>
            {expiredAccounts > 0 && (
              <span className="text-[10px] font-medium text-rose-400">
                (+{expiredAccounts} expired)
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-[#7C8C7E]">Temporary leave / hold</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#182019]/70 border border-[#1E2C21] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, vehicle reg, flat #..."
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-[#0B0F12] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#7C8C7E] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8C7E] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Society Filter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B0F12] border border-[#1E2C21] text-xs">
              <Building className="w-3.5 h-3.5 text-[#7C8C7E]" />
              <select
                value={societyFilter}
                onChange={(e) => setSocietyFilter(e.target.value)}
                aria-label="Filter by Society"
                className="bg-transparent text-[#E2F0E4] focus:outline-none cursor-pointer text-xs pr-2"
              >
                <option value="all" className="bg-[#0B0F12]">All Societies</option>
                {societies.map((soc) => (
                  <option key={soc.id} value={soc.id} className="bg-[#0B0F12]">
                    {soc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-[#0B0F12] border border-[#1E2C21]">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-[#2E9E44] text-white"
                    : "text-[#7C8C7E] hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-[#7C8C7E] hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("paused")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === "paused"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-[#7C8C7E] hover:text-white"
                }`}
              >
                Paused
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("expired")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === "expired"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "text-[#7C8C7E] hover:text-white"
                }`}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary indicator */}
        {(searchQuery || societyFilter !== "all" || statusFilter !== "all") && (
          <div className="flex items-center justify-between pt-1 border-t border-[#1E2C21]/50 text-[11px] text-[#7C8C7E]">
            <span>
              Showing {filteredConsumers.length} of {consumers.length} consumers matching current criteria
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSocietyFilter("all")
                setStatusFilter("all")
              }}
              className="text-[#7ED37F] hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Consumer & Vehicle Directory Table */}
      <div className="rounded-2xl bg-[#182019]/60 border border-[#1E2C21] overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#7C8C7E] space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#2E9E44]" />
            <p>Loading consumer directory & registered vehicles...</p>
          </div>
        ) : filteredConsumers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#182019] border border-[#1E2C21] flex items-center justify-center mx-auto text-[#7C8C7E]">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">No consumers found</div>
            <p className="text-xs text-[#7C8C7E] max-w-sm mx-auto">
              No matching records found for search &quot;{searchQuery}&quot; with selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B0F12] text-[#7C8C7E] font-semibold border-b border-[#1E2C21] uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Consumer & Contact</th>
                  <th className="py-3.5 px-4">Society & Residence</th>
                  <th className="py-3.5 px-4">Registered Vehicles</th>
                  <th className="py-3.5 px-4">Plan Name</th>
                  <th className="py-3.5 px-4">Subscription Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2C21]/60">
                {filteredConsumers.map((consumer) => {
                  const isExpanded = expandedConsumerId === consumer.id
                  const status = consumer.subscriptionStatus

                  return (
                    <tr
                      key={consumer.id}
                      className={`group transition-colors ${
                        isExpanded ? "bg-[#182019]" : "hover:bg-[#182019]/40"
                      }`}
                    >
                      <td colSpan={6} className="p-0">
                        {/* Summary Row */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          {/* 1. Consumer Name & Contact info */}
                          <div className="flex items-start gap-3 min-w-[220px]">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2E9E44]/30 to-[#182019] border border-[#2E9E44]/40 flex items-center justify-center shrink-0 font-bold text-white shadow-sm">
                              {consumer.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-white text-sm group-hover:text-[#7ED37F] transition-colors">
                                {consumer.fullName}
                              </span>
                              <div className="flex items-center gap-3 text-[11px] text-[#7C8C7E]">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#7C8C7E]" />
                                  {consumer.email}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#7C8C7E] flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#7C8C7E]" />
                                {consumer.phone}
                              </div>
                            </div>
                          </div>

                          {/* 2. Society & Flat # */}
                          <div className="flex flex-col gap-1 min-w-[180px]">
                            <div className="flex items-center gap-1.5 font-medium text-white">
                              <Building className="w-3.5 h-3.5 text-[#7ED37F]" />
                              <span>{consumer.societyName}</span>
                            </div>
                            <span className="text-[11px] text-[#7C8C7E] font-mono">
                              {consumer.tower} • Flat {consumer.flatNo}
                            </span>
                          </div>

                          {/* 3. Registered Vehicles */}
                          <div className="flex flex-col gap-1 min-w-[220px]">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {consumer.registeredVehicles.length}{" "}
                                {consumer.registeredVehicles.length === 1 ? "Vehicle" : "Vehicles"}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {consumer.registeredVehicles.map((v) => (
                                <div
                                  key={v.id}
                                  className="text-[11px] font-mono text-[#C8D9CB] flex items-center gap-1.5"
                                >
                                  <Car className="w-3 h-3 text-[#7C8C7E]" />
                                  <span>
                                    {v.make} {v.model} ({v.registrationNumber})
                                  </span>
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#0B0F12] text-emerald-400 border border-[#1E2C21]">
                                    [{v.parkingSpot}]
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Plan Name */}
                          <div className="min-w-[160px]">
                            <div className="flex items-center gap-1 text-white font-medium">
                              <CreditCard className="w-3.5 h-3.5 text-[#2E9E44]" />
                              <span className="truncate max-w-[160px]">
                                {consumer.currentPlanName}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#7C8C7E] block mt-0.5">
                              {getRenewalDate(consumer)}
                            </span>
                          </div>

                          {/* 5. Subscription Status Badge */}
                          <div className="min-w-[110px]">
                            {status === "active" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                              </span>
                            )}
                            {status === "paused" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <PauseCircle className="w-3.5 h-3.5" />
                                Paused
                              </span>
                            )}
                            {status === "expired" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                <XCircle className="w-3.5 h-3.5" />
                                Expired
                              </span>
                            )}
                          </div>

                          {/* 6. Expand & Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedConsumerDrawer(consumer)}
                              className="p-1.5 rounded-lg bg-[#0B0F12] border border-[#1E2C21] text-[#7C8C7E] hover:text-[#7ED37F] hover:border-[#2E9E44]/50 transition-all"
                              title="Open Full Drawer View"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(consumer.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B0F12] border border-[#1E2C21] text-xs text-[#C8D9CB] hover:text-white transition-all"
                            >
                              <span>{isExpanded ? "Hide" : "Expand"}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Inline Expandable Detail Panel */}
                        {isExpanded && (
                          <div className="px-6 py-4 bg-[#0B0F12]/80 border-t border-[#1E2C21] space-y-4 animate-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between text-xs border-b border-[#1E2C21] pb-2">
                              <span className="font-semibold text-[#7ED37F] flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Detailed Parking Bay & Vehicle Roster
                              </span>
                              <span className="text-[11px] text-[#7C8C7E] font-mono">
                                Consumer ID: {consumer.id}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {consumer.registeredVehicles.map((vehicle, idx) => (
                                <div
                                  key={vehicle.id}
                                  className="p-3.5 rounded-xl bg-[#182019] border border-[#1E2C21] space-y-2 relative"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">
                                      Vehicle #{idx + 1}: {vehicle.make} {vehicle.model}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0B0F12] text-[#7ED37F] border border-[#2E9E44]/30">
                                      {vehicle.registrationNumber}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div>
                                      <span className="text-[#7C8C7E] block">Color</span>
                                      <span className="text-[#C8D9CB] font-medium">
                                        {vehicle.color}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[#7C8C7E] block">Parking Bay</span>
                                      <span className="text-emerald-400 font-mono font-semibold">
                                        Bay {vehicle.parkingSpot}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Additional Metadata & Control buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-4 text-[11px] text-[#7C8C7E]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[#2E9E44]" />
                                  Subscription Info:{" "}
                                  <strong className="text-white font-normal">
                                    {getRenewalDate(consumer)}
                                  </strong>
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(consumer.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                    consumer.subscriptionStatus === "active"
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                  }`}
                                >
                                  {consumer.subscriptionStatus === "active"
                                    ? "Pause Subscription"
                                    : "Activate Subscription"}
                                </button>
                                <a
                                  href={`tel:${consumer.phone}`}
                                  className="px-3 py-1.5 rounded-lg bg-[#182019] hover:bg-[#1E2C21] border border-[#1E2C21] text-xs font-semibold text-[#E2F0E4] flex items-center gap-1 transition-all"
                                >
                                  <Phone className="w-3 h-3 text-[#7ED37F]" />
                                  Call Owner
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer Detail View Slide-over */}
      {selectedConsumerDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0B0F12] border-l border-[#1E2C21] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2C21]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2E9E44]/20 border border-[#2E9E44]/40 flex items-center justify-center font-bold text-white text-lg">
                    {selectedConsumerDrawer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {selectedConsumerDrawer.fullName}
                    </h3>
                    <span className="text-xs text-[#7C8C7E]">Consumer Details & Vehicle Hub</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedConsumerDrawer(null)}
                  className="p-2 rounded-xl bg-[#182019] border border-[#1E2C21] text-[#7C8C7E] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-3.5 rounded-xl bg-[#182019] border border-[#1E2C21] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7C8C7E] uppercase tracking-wider block">
                    Subscription Tier
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {selectedConsumerDrawer.currentPlanName}
                  </span>
                </div>
                <div>
                  {selectedConsumerDrawer.subscriptionStatus === "active" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                  {selectedConsumerDrawer.subscriptionStatus === "paused" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Paused
                    </span>
                  )}
                  {selectedConsumerDrawer.subscriptionStatus === "expired" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      Expired
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#7ED37F] uppercase tracking-wider">
                  Contact & Residence
                </h4>
                <div className="p-4 rounded-xl bg-[#182019]/60 border border-[#1E2C21] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C8C7E]">Email Address</span>
                    <span className="text-white font-medium">{selectedConsumerDrawer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C8C7E]">Phone Number</span>
                    <span className="text-[#7ED37F] font-mono">{selectedConsumerDrawer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C8C7E]">Society</span>
                    <span className="text-white font-medium">
                      {selectedConsumerDrawer.societyName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C8C7E]">Tower & Flat</span>
                    <span className="text-white font-mono">
                      {selectedConsumerDrawer.tower} - {selectedConsumerDrawer.flatNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicles Roster */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#7ED37F] uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Vehicles ({selectedConsumerDrawer.registeredVehicles.length})</span>
                  <Car className="w-4 h-4 text-[#7C8C7E]" />
                </h4>

                {selectedConsumerDrawer.registeredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-xl bg-[#182019] border border-[#1E2C21] space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#1E2C21] pb-2">
                      <span className="font-bold text-white text-sm">
                        {vehicle.make} {vehicle.model}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#0B0F12] text-emerald-400 border border-[#2E9E44]/40">
                        {vehicle.registrationNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#7C8C7E] text-[10px] block">Exterior Color</span>
                        <span className="text-white font-medium">{vehicle.color}</span>
                      </div>
                      <div>
                        <span className="text-[#7C8C7E] text-[10px] block">Assigned Parking Bay</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {vehicle.parkingSpot}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-[#1E2C21] flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedConsumerDrawer.id)}
                className="flex-1 py-2.5 rounded-xl bg-[#2E9E44] hover:bg-[#258237] text-white text-xs font-bold transition-all shadow-lg shadow-[#2E9E44]/20"
              >
                {selectedConsumerDrawer.subscriptionStatus === "active"
                  ? "Pause Account"
                  : "Activate Account"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedConsumerDrawer(null)}
                className="px-4 py-2.5 rounded-xl bg-[#182019] hover:bg-[#1E2C21] border border-[#1E2C21] text-xs font-semibold text-[#7C8C7E] hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
