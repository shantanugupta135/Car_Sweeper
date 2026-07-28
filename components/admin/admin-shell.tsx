"use client"

import type { ReactNode } from "react"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"
import { useNavigation, Screen } from "@/lib/navigation-context"
import { BarChart3, Sparkles, Building2, Car, Clock, AlertTriangle } from "lucide-react"

interface AdminShellProps {
  children: ReactNode
}

const MOBILE_NAV_ITEMS = [
  { id: "admin-overview" as Screen, label: "Overview", icon: BarChart3 },
  { id: "admin-cleaners" as Screen, label: "Cleaners", icon: Sparkles },
  { id: "admin-societies" as Screen, label: "Societies", icon: Building2 },
  { id: "admin-consumers" as Screen, label: "Consumers", icon: Car },
  { id: "admin-daily-monitor" as Screen, label: "Monitor", icon: Clock },
  { id: "admin-complaints" as Screen, label: "Complaints", icon: AlertTriangle },
]

export function AdminShell({ children }: AdminShellProps) {
  const { screen, navigate } = useNavigation()

  return (
    <div className="min-h-screen bg-[#0B0F12] text-[#E2F0E4] flex flex-col font-sans antialiased selection:bg-[#2E9E44]/30 selection:text-[#7ED37F]">
      {/* Top Header */}
      <AdminHeader />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F12]/95 backdrop-blur-xl border-t border-[#1E2C21] px-2 py-1.5 flex items-center justify-around md:hidden">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = screen === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-all ${
                isActive ? "text-[#7ED37F]" : "text-[#7C8C7E]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#2E9E44]" : ""}`} />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
