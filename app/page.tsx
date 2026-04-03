"use client"

import { AuthProvider } from "@/lib/auth-context"
import { NavigationProvider } from "@/lib/navigation-context"
import { AppRouter } from "@/components/app-router"

export default function SmartCarCare() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppRouter />
      </NavigationProvider>
    </AuthProvider>
  )
}
