"use client"

import { Search, Plus, Shield, Car, Sparkles } from "lucide-react"
import { useAuth, UserRole } from "@/lib/auth-context"
import { useNavigation, Screen } from "@/lib/navigation-context"

export function AdminHeader() {
  const { role, setRole } = useAuth()
  const { navigate } = useNavigation()

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    if (newRole === "owner" || newRole === "cleaner") {
      navigate("home")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0B0F12]/90 backdrop-blur-xl border-b border-[#1E2C21] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Brand logo & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2E9E44] to-[#166534] flex items-center justify-center shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              CarsGlow
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/40">
              Admin
            </span>
          </div>
          <span className="text-[11px] text-[#7C8C7E] hidden sm:inline">Operations & Management Portal</span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
          <input
            type="text"
            placeholder="Search cleaners, societies, consumers, vehicles..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#182019]/80 border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#7C8C7E] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Quick Role Switcher + Quick Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Role Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#182019] border border-[#1E2C21]">
          <button
            type="button"
            onClick={() => handleRoleChange("owner")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === "owner"
                ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                : "text-[#7C8C7E] hover:text-[#E2F0E4] hover:bg-[#1E2C21]/50"
            }`}
            title="Switch to Consumer view"
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Consumer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("cleaner")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === "cleaner"
                ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                : "text-[#7C8C7E] hover:text-[#E2F0E4] hover:bg-[#1E2C21]/50"
            }`}
            title="Switch to Cleaner view"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cleaner</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              role === "admin"
                ? "bg-[#2E9E44] text-white shadow-md shadow-[#2E9E44]/30"
                : "text-[#7C8C7E] hover:text-[#E2F0E4] hover:bg-[#1E2C21]/50"
            }`}
            title="Switch to Admin view"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Quick Action Button: + Add Cleaner */}
        <button
          type="button"
          onClick={() => navigate("admin-cleaners")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-semibold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Cleaner</span>
        </button>
      </div>
    </header>
  )
}
