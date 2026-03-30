"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing/landing-page"
import { LoginScreen } from "@/components/auth/login-screen"
import { SignupScreen } from "@/components/auth/signup-screen"

type AppPage = "landing" | "login" | "signup" | "dashboard"

export function AppRouter() {
  const { isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState<AppPage>("landing")

  // When user authenticates, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && (currentPage === "login" || currentPage === "signup")) {
      setCurrentPage("dashboard")
    }
  }, [isAuthenticated, currentPage])

  // When user logs out, go back to landing
  useEffect(() => {
    if (!isAuthenticated && currentPage === "dashboard") {
      setCurrentPage("landing")
    }
  }, [isAuthenticated, currentPage])

  const navigate = useCallback((page: string) => {
    setCurrentPage(page as AppPage)
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  switch (currentPage) {
    case "landing":
      return <LandingPage onNavigate={navigate} />
    case "login":
      return <LoginScreen onNavigate={navigate} />
    case "signup":
      return <SignupScreen onNavigate={navigate} />
    default:
      return <LandingPage onNavigate={navigate} />
  }
}
