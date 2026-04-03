"use client"

import { useNavigation } from "@/lib/navigation-context"
import { DrawerNav } from "@/components/smartcar/drawer-nav"
import { HomeDashboard } from "@/components/screens/home-dashboard"
import { CleaningStatusScreen } from "@/components/screens/cleaning-status"
import { AddCarScreen } from "@/components/screens/add-car"
import { SubscriptionScreen } from "@/components/screens/subscription"
import { ServiceHistoryScreen } from "@/components/screens/service-history"
import { RatingScreen } from "@/components/screens/rating"
import { ComplaintScreen } from "@/components/screens/complaint"
import { ProfileScreen } from "@/components/screens/profile"

const screenComponents = {
  home: HomeDashboard,
  "add-car": AddCarScreen,
  subscription: SubscriptionScreen,
  "cleaning-status": CleaningStatusScreen,
  history: ServiceHistoryScreen,
  rating: RatingScreen,
  complaint: ComplaintScreen,
  profile: ProfileScreen,
}

export function AppShell() {
  const { screen } = useNavigation()
  const ScreenComponent = screenComponents[screen]

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px] animate-breathe" />
        <div className="absolute bottom-20 right-0 h-60 w-60 rounded-full bg-primary/3 blur-[80px] animate-breathe" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Top App Bar + Drawer Navigation */}
      <DrawerNav />

      {/* Screen content with top padding for fixed header */}
      <main className="relative z-10 animate-in fade-in duration-300 pt-14">
        <ScreenComponent />
      </main>
    </div>
  )
}
