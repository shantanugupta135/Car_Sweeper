"use client"

import { AuthProvider } from "@/lib/auth-context"
import { AppShell } from "@/components/smartcar/app-shell"
import { AppRouter } from "@/components/app-router";

export default function SmartCarCare() {
  return (
    <AuthProvider>
    <AppRouter />
  </AuthProvider>
  )
}
