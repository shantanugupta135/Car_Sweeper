"use client"
import { NavigationProvider } from "@/lib/navigation-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NavigationProvider>{children}</NavigationProvider>
}