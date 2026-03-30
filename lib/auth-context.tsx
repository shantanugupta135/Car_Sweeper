"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    if (email && password.length >= 6) {
      setUser({
        id: "usr_001",
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        phone: "+91 98765 43210",
      })
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }, [])

  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    if (name && email && phone && password.length >= 6) {
      setUser({ id: "usr_" + Date.now(), name, email, phone })
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
