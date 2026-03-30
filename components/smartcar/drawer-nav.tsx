"use client"

import { useState } from "react"
import { Home, Clock, BarChart3, User, Menu, X, Car, CreditCard, MessageSquare, Star } from "lucide-react"
import { useNavigation, type Screen } from "@/lib/navigation-context"
import { cn } from "@/lib/utils"

const mainItems: { icon: typeof Home; label: string; screen: Screen }[] = [
  { icon: Home, label: "Home", screen: "home" },
  { icon: Clock, label: "Cleaning Status", screen: "cleaning-status" },
  { icon: BarChart3, label: "Service History", screen: "history" },
  { icon: User, label: "Profile", screen: "profile" },
]

const secondaryItems: { icon: typeof Home; label: string; screen: Screen }[] = [
  { icon: Car, label: "Add Car", screen: "add-car" },
  { icon: CreditCard, label: "Subscription", screen: "subscription" },
  { icon: Star, label: "Rate Service", screen: "rating" },
  { icon: MessageSquare, label: "Complaints", screen: "complaint" },
]

export function DrawerNav() {
  const [open, setOpen] = useState(false)
  const { screen, navigate } = useNavigation()

  const handleNavigate = (target: Screen) => {
    navigate(target)
    setOpen(false)
  }

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary active:scale-95"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-foreground">SmartCar Care</span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Drawer Panel */}
      <nav
        className={cn(
          "fixed left-0 top-0 z-[70] flex h-full w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">SmartCar Care</p>
              <p className="text-[11px] text-muted-foreground">Premium Auto Cleaning</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Rahul Sharma</p>
              <p className="text-[11px] text-muted-foreground">Premium Member</p>
            </div>
          </div>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Main</p>
          <ul className="flex flex-col gap-0.5">
            {mainItems.map((item) => {
              const isActive = screen === item.screen
              return (
                <li key={item.screen}>
                  <button
                    onClick={() => handleNavigate(item.screen)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 active:scale-[0.98]",
                      isActive
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", isActive && "drop-shadow-[0_0_6px_oklch(0.72_0.19_220)]")} />
                    {item.label}
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="my-3 border-t border-border" />

          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Services</p>
          <ul className="flex flex-col gap-0.5">
            {secondaryItems.map((item) => {
              const isActive = screen === item.screen
              return (
                <li key={item.screen}>
                  <button
                    onClick={() => handleNavigate(item.screen)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 active:scale-[0.98]",
                      isActive
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", isActive && "drop-shadow-[0_0_6px_oklch(0.72_0.19_220)]")} />
                    {item.label}
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-center text-[10px] text-muted-foreground">v1.0 &middot; SmartCar Care</p>
        </div>
      </nav>
    </>
  )
}
