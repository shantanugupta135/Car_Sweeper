"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Screen =
  | "home"
  | "add-car"
  | "subscription"
  | "cleaning-status"
  | "history"
  | "rating"
  | "complaint"
  | "profile"
  | "admin-overview"
  | "admin-cleaners"
  | "admin-societies"
  | "admin-consumers"
  | "admin-daily-monitor"
  | "admin-complaints"

interface NavigationContextType {
  screen: Screen
  navigate: (screen: Screen) => void
  goBack: () => void
  history: Screen[]
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [screenHistory, setScreenHistory] = useState<Screen[]>(["admin-overview"])

  const screen = screenHistory[screenHistory.length - 1]

  const navigate = useCallback((newScreen: Screen) => {
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === newScreen) return prev
      return [...prev, newScreen]
    })
  }, [])

  const goBack = useCallback(() => {
    setScreenHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  return (
    <NavigationContext.Provider value={{ screen, navigate, goBack, history: screenHistory }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider")
  return ctx
}
