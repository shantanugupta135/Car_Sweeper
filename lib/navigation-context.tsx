"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Screen =
  | "home"
  | "add-car"
  | "subscription"
  | "cleaning-status"
  | "history"
  | "rating"
  | "complaint"
  | "profile"

interface NavigationContextType {
  screen: Screen
  navigate: (screen: Screen) => void
  goBack: () => void
  history: Screen[]
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [screenHistory, setScreenHistory] = useState<Screen[]>(["home"])

  const screen = screenHistory[screenHistory.length - 1]

  const navigate = (newScreen: Screen) => {
    setScreenHistory((prev) => [...prev, newScreen])
  }

  const goBack = () => {
    setScreenHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

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
