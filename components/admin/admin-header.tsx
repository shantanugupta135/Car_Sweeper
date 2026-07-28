"use client"

import { Plus, Shield, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useNavigation } from "@/lib/navigation-context"
import { AdminGlobalSearch } from "@/components/admin/admin-global-search"
import { IS_REAL_MODE } from "@/lib/config"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const { navigate } = useNavigation()

  const initials = (user?.name ?? "Admin")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

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

      <AdminGlobalSearch />

      {/* Right Controls: signed-in admin + quick action */}
      <div className="flex items-center gap-3 shrink-0">
        {!IS_REAL_MODE && (
          <span
            className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#F4A300]/15 text-[#F4A300] border border-[#F4A300]/30"
            title="NEXT_PUBLIC_API_MODE is not set to 'real' — showing seed data"
          >
            Mock data
          </span>
        )}

        <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-[#182019] border border-[#1E2C21]">
          <span className="w-7 h-7 rounded-lg bg-[#2E9E44]/20 border border-[#2E9E44]/40 text-[11px] font-bold text-[#7ED37F] flex items-center justify-center">
            {initials}
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[11px] font-semibold text-[#E2F0E4]">{user?.name ?? "Admin"}</span>
            <span className="text-[10px] text-[#7C8C7E]">{user?.email ?? "operations"}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="ml-1 p-1.5 rounded-lg text-[#7C8C7E] hover:text-[#E5484D] hover:bg-[#E5484D]/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
