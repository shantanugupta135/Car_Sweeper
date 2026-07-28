"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { IS_REAL_MODE } from "@/lib/config"
import { getBrowserSupabase } from "@/lib/supabase/browser"

/** Mirrors `profiles.role` in the database exactly — no mapping layer. */
export type UserRole = "owner" | "cleaner" | "admin"

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role?: UserRole
}

interface AuthContextType {
  user: User | null
  role: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  /** Subscriber sign-in for the consumer dashboard at `/`. */
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  /**
   * Operations sign-in for `/admin`. In real mode this authenticates against
   * Supabase and refuses anyone whose profile role is not `admin`.
   */
  adminLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  setRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function displayNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Default to the subscriber experience. Previously this defaulted to "admin",
  // which routed every logged-in visitor on `/` into the ops portal and left the
  // consumer screens unreachable.
  const [role, setRoleState] = useState<UserRole>("owner")
  const [isLoading, setIsLoading] = useState(IS_REAL_MODE)

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState((prev) => (prev === newRole ? prev : newRole))
    setUser((prev) => (prev && prev.role !== newRole ? { ...prev, role: newRole } : prev))
  }, [])

  // Restore an existing admin session so a refresh does not bounce them out.
  useEffect(() => {
    if (!IS_REAL_MODE) return
    let cancelled = false

    async function restore() {
      const supabase = getBrowserSupabase()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        if (!cancelled) setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (!cancelled) {
        if (profile?.role === "admin") {
          setUser({
            id: profile.id,
            name: profile.name ?? "Admin",
            email: profile.email ?? session.user.email ?? "",
            phone: profile.phone ?? "",
            role: "admin",
          })
          setRoleState("admin")
        } else {
          await supabase.auth.signOut()
        }
        setIsLoading(false)
      }
    }

    restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    if (email && password.length >= 6) {
      setUser({
        id: "usr_001",
        name: displayNameFromEmail(email),
        email,
        phone: "+91 98765 43210",
        role: "owner",
      })
      setRoleState("owner")
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
      setUser({ id: "usr_" + Date.now(), name, email, phone, role: "owner" })
      setRoleState("owner")
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }, [])

  const adminLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true)

    if (!IS_REAL_MODE) {
      // Mock mode: the portal runs on seed data, so any credentials open it.
      await new Promise((r) => setTimeout(r, 600))
      setUser({
        id: "adm_mock",
        name: displayNameFromEmail(email || "admin@carsglow.com"),
        email: email || "admin@carsglow.com",
        phone: "+91 98765 43210",
        role: "admin",
      })
      setRoleState("admin")
      setIsLoading(false)
      return { ok: true }
    }

    const supabase = getBrowserSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      setIsLoading(false)
      return { ok: false, error: error?.message ?? "Could not sign in." }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, email, phone, role")
      .eq("id", data.session.user.id)
      .maybeSingle()

    if (profile?.role !== "admin") {
      await supabase.auth.signOut()
      setIsLoading(false)
      return { ok: false, error: "This account does not have admin access." }
    }

    setUser({
      id: profile.id,
      name: profile.name ?? "Admin",
      email: profile.email ?? email,
      phone: profile.phone ?? "",
      role: "admin",
    })
    setRoleState("admin")
    setIsLoading(false)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    if (IS_REAL_MODE) {
      void getBrowserSupabase().auth.signOut()
    }
    setUser(null)
    setRoleState("owner")
  }, [])

  const currentRole = user?.role || role

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        adminLogin,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
