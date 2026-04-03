"use client"

import { Home, Clock, BarChart3, User } from "lucide-react"
import { useNavigation, type Screen } from "@/lib/navigation-context"
import { cn } from "@/lib/utils"

const tabs: { icon: typeof Home; label: string; screen: Screen }[] = [
  { icon: Home, label: "Home", screen: "home" },
  { icon: Clock, label: "Status", screen: "cleaning-status" },
  { icon: BarChart3, label: "History", screen: "history" },
  { icon: User, label: "Profile", screen: "profile" },
]

export function BottomNav() {
  const { screen, navigate } = useNavigation()

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/80 backdrop-blur-xl"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = screen === tab.screen
          return (
            <button
              key={tab.screen}
              role="tab"
              aria-selected={isActive}
              onClick={() => navigate(tab.screen)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_oklch(0.72_0.19_220)]")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="h-0.5 w-4 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
