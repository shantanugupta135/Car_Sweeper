"use client"

import { BarChart3, Sparkles, Building2, Car, Clock, AlertTriangle, ChevronRight, Activity } from "lucide-react"
import { useNavigation, Screen } from "@/lib/navigation-context"

interface SidebarItem {
  id: Screen
  label: string
  icon: React.ElementType
  badge?: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "admin-overview",
    label: "Overview",
    icon: BarChart3,
  },
  {
    id: "admin-cleaners",
    label: "Cleaners",
    icon: Sparkles,
  },
  {
    id: "admin-societies",
    label: "Societies",
    icon: Building2,
  },
  {
    id: "admin-consumers",
    label: "Consumers",
    icon: Car,
  },
  {
    id: "admin-daily-monitor",
    label: "Live Monitor",
    icon: Clock,
    badge: "LIVE",
  },
  {
    id: "admin-complaints",
    label: "Complaints",
    icon: AlertTriangle,
  },
]

export function AdminSidebar() {
  const { screen, navigate } = useNavigation()

  return (
    <aside className="w-64 shrink-0 bg-[#0B0F12] border-r border-[#1E2C21] flex flex-col justify-between p-4 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7C8C7E]">
          Admin Operations
        </div>

        <nav className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = screen === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-[#2E9E44]/20 to-transparent text-[#7ED37F] border border-[#2E9E44]/40 shadow-sm shadow-[#2E9E44]/10"
                    : "text-[#C8D9CB] hover:bg-[#182019] hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? "bg-[#2E9E44] text-white" : "bg-[#182019] text-[#7C8C7E] group-hover:text-[#E2F0E4]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "text-[#7ED37F] translate-x-0.5" : "text-[#7C8C7E]/40 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom System Status Badge */}
      <div className="p-3 rounded-xl bg-[#182019]/60 border border-[#1E2C21] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#E2F0E4]">Portal Status</span>
          </div>
          <span className="text-[10px] text-[#7ED37F] font-mono">ONLINE</span>
        </div>
        <div className="text-[10px] text-[#7C8C7E] leading-relaxed">
          Operational mode: <span className="text-[#C8D9CB] font-mono">MOCK API</span>
        </div>
      </div>
    </aside>
  )
}
