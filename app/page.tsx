"use client"

import { AuthProvider } from "@/lib/auth-context"
import { NavigationProvider } from "@/lib/navigation-context"
import { AppRouter } from "@/components/app-router"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"

export default function SmartCarCare() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppRouter />
        <FloatingWhatsAppButton />
      </NavigationProvider>
    </AuthProvider>
  )
}
