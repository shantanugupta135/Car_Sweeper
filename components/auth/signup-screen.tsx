"use client"

import { useState } from "react"
import { Droplets, Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function SignupScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const passwordChecks = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !phone || !password) {
      setError("Please fill in all fields.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    const success = await signup(name, email, phone, password)
    if (!success) {
      setError("Signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,255,0.05),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-2.5 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-foreground text-xl">SmartCar Care</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-muted-foreground mt-1">Join 12,000+ car owners</p>
        </div>

        {/* Form card */}
        <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-phone" className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {passwordChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 ${check.valid ? "text-green-400" : "text-muted-foreground/40"}`} />
                      <span className={`text-xs ${check.valid ? "text-green-400" : "text-muted-foreground/60"}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-1">
              By signing up, you agree to our{" "}
              <button className="text-primary hover:underline">Terms</button> and{" "}
              <button className="text-primary hover:underline">Privacy Policy</button>
            </p>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
