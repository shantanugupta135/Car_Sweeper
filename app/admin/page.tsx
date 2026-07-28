"use client"

import { useEffect, useRef } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { NavigationProvider, useNavigation } from "@/lib/navigation-context"
import { AppShell } from "@/components/smartcar/app-shell"
import { AdminLogin } from "@/components/admin/admin-login"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"

function AdminGate() {
  const { isAuthenticated, isLoading, role, setRole } = useAuth()
  const { navigate } = useNavigation()
  const landed = useRef(false)

  // Once signed in, park on the overview exactly once so the sidebar can
  // navigate freely afterwards.
  useEffect(() => {
    if (isAuthenticated && role === "admin" && !landed.current) {
      landed.current = true
      setRole("admin")
      navigate("admin-overview")
    }
    if (!isAuthenticated) landed.current = false
  }, [isAuthenticated, role, navigate, setRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-emerald-400">Loading CarsGlow Admin Portal...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || role !== "admin") {
    return <AdminLogin />
  }

  return <AppShell />
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <NavigationProvider initialScreen="admin-overview">
        <AdminGate />
        <FloatingWhatsAppButton />
      </NavigationProvider>
    </AuthProvider>
  )
}
