"use client"

import { useEffect, useState, useRef } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { NavigationProvider, useNavigation } from "@/lib/navigation-context"
import { AppShell } from "@/components/smartcar/app-shell"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"

function AdminGate() {
  const { isAuthenticated, login, setRole } = useAuth()
  const { navigate } = useNavigation()
  const [ready, setReady] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function initAdminSession() {
      if (!isAuthenticated) {
        await login("admin@carsglow.com", "admin123")
      }
      setRole("admin")
      navigate("admin-overview")
      setReady(true)
    }
    initAdminSession()
  }, [isAuthenticated, login, setRole, navigate])

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-emerald-400">Loading CarsGlow Admin Portal...</p>
        </div>
      </div>
    )
  }

  return <AppShell />
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AdminGate />
        <FloatingWhatsAppButton />
      </NavigationProvider>
    </AuthProvider>
  )
}
