"use client"

import { useState, type FormEvent } from "react"
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { IS_REAL_MODE } from "@/lib/config"

/**
 * Gate for the operations portal.
 *
 * This replaces the previous auto-login, which signed everyone in as
 * admin@carsglow.com / admin123 on mount — harmless while the portal ran on
 * seed data, wide open the moment it reads real subscriber records.
 */
export function AdminLogin() {
  const { adminLogin, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await adminLogin(email.trim(), password)
    setSubmitting(false)
    if (!result.ok) setError(result.error ?? "Could not sign in.")
  }

  const busy = submitting || isLoading

  return (
    <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-[#E2F0E4]">CarsGlow Operations</h1>
          <p className="text-sm text-[#7C8C7E] mt-1">Admin portal sign-in</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#1E2C21] bg-[#141A16] p-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8C7E]">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@carsglow.com"
                className="w-full rounded-xl bg-[#0F1511] border border-[#1E2C21] pl-9 pr-3 py-2.5 text-sm text-[#E2F0E4] placeholder:text-[#3D4E3F] outline-none focus:border-emerald-500/60"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C8C7E]">Password</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-[#0F1511] border border-[#1E2C21] pl-9 pr-3 py-2.5 text-sm text-[#E2F0E4] placeholder:text-[#3D4E3F] outline-none focus:border-emerald-500/60"
              />
            </div>
          </label>

          {error && (
            <p className="text-sm text-[#E5484D] bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#0F1511] font-semibold py-2.5 text-sm transition-colors"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {!IS_REAL_MODE && (
            <p className="text-[11px] leading-relaxed text-[#7C8C7E] border-t border-[#1E2C21] pt-3">
              Running on <span className="text-emerald-400 font-semibold">mock data</span> — any email and password
              will open the portal. Set <code className="text-[#C8D9CB]">NEXT_PUBLIC_API_MODE=real</code> to connect
              it to the live CarsGlow database.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
