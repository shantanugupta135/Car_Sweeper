"use client"

import { useState, useEffect } from "react"
import { Droplets, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Animated water droplets component
function WaterDroplets() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Falling water droplets */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${2 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Animated cleaning car with sweeper
function AnimatedCar() {
  return (
    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden mb-12">
      {/* Road */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}} />
      </div>

      {/* Car moving animation */}
      <div
        className="relative z-20 flex items-end gap-2"
        style={{
          animation: "driveCar 6s ease-in-out infinite",
        }}
      >
        {/* Car SVG */}
        <svg
          width="160"
          height="100"
          viewBox="0 0 160 100"
          className="drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))",
          }}
        >
          {/* Car body */}
          <rect x="20" y="50" width="120" height="35" rx="6" fill="#00d4ff" opacity="0.1" stroke="#00d4ff" strokeWidth="2" />
          {/* Car top */}
          <rect x="40" y="30" width="80" height="25" rx="4" fill="#00d4ff" opacity="0.15" stroke="#00d4ff" strokeWidth="2" />
          {/* Windows */}
          <rect x="50" y="35" width="25" height="18" fill="#0a0a0f" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
          <rect x="85" y="35" width="25" height="18" fill="#0a0a0f" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
          {/* Wheels */}
          <circle cx="40" cy="85" r="8" fill="#00d4ff" opacity="0.6" stroke="#00d4ff" strokeWidth="2" />
          <circle cx="120" cy="85" r="8" fill="#00d4ff" opacity="0.6" stroke="#00d4ff" strokeWidth="2" />
          {/* Headlights */}
          <circle cx="22" cy="60" r="3" fill="#00d4ff" />
          <circle cx="30" cy="60" r="3" fill="#00d4ff" />
        </svg>

        {/* Sweeper brush following car */}
        <div
          className="relative -ml-8 z-30 flex flex-col items-center"
          style={{
            animation: "sweepBrush 6s ease-in-out infinite",
          }}
        >
          {/* Brush head */}
          <svg width="50" height="60" viewBox="0 0 50 60" className="drop-shadow-lg">
            {/* Handle */}
            <rect x="22" y="0" width="6" height="40" fill="#00d4ff" opacity="0.4" />
            {/* Bristles */}
            <circle cx="25" cy="45" r="12" fill="#00d4ff" opacity="0.3" stroke="#00d4ff" strokeWidth="1" />
            <line x1="13" y1="45" x2="37" y2="45" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
            <line x1="15" y1="48" x2="35" y2="48" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
            <line x1="15" y1="52" x2="35" y2="52" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
            <line x1="17" y1="55" x2="33" y2="55" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        {/* Water splash particles */}
        <div className="absolute -right-12 top-12 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary rounded-full opacity-40"
              style={{
                left: `${Math.random() * 30}px`,
                top: `${Math.random() * 20}px`,
                animation: `splash ${1.5}s ease-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Shine/clean effect appearing on car */}
        <div
          className="absolute inset-0 opacity-0"
          style={{
            animation: "carShine 6s ease-in-out infinite",
            background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent)",
            width: "40px",
            height: "35px",
            top: "50px",
            left: "30px",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Cleaning progress indicator below road */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/40"
              style={{
                animation: `pulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes driveCar {
          0%, 100% {
            transform: translateX(-180px);
          }
          50% {
            transform: translateX(180px);
          }
        }

        @keyframes sweepBrush {
          0%, 100% {
            transform: translateX(-180px) rotateZ(0deg);
            opacity: 0.3;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateX(180px) rotateZ(-15deg);
            opacity: 0.8;
          }
          75% {
            opacity: 0.3;
          }
        }

        @keyframes splash {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx, 0), 40px) scale(0);
          }
        }

        @keyframes carShine {
          0%, 100% {
            opacity: 0;
            transform: translateX(-50px);
          }
          40% {
            opacity: 0;
          }
          50% {
            opacity: 0.6;
            transform: translateX(50px);
          }
          60% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}

export function LoginScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Water droplets animation */}
      <WaterDroplets />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Animated car demonstration */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="mb-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">See Your Car Shine</h2>
              <p className="text-muted-foreground text-lg">Watch how SmartCar Care transforms your vehicle</p>
            </div>

            {/* Animated car component */}
            <AnimatedCar />

            {/* Feature tags under animation */}
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                Doorstep Cleaning
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                Smart Scheduling
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                Premium Results
              </span>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md flex-shrink-0">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8 lg:items-start lg:mb-12">
              <button onClick={() => onNavigate("landing")} className="flex items-center gap-2.5 mb-6 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <span className="font-bold text-foreground text-xl">SmartCar</span>
              </button>
              <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">Access your vehicle dashboard</p>
            </div>

            {/* Form card */}
            <div className="relative p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/10 hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="login-email" className="text-sm font-semibold text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/30 focus:shadow-lg focus:shadow-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="text-sm font-semibold text-foreground">Password</label>
                    <button type="button" className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/30 focus:shadow-lg focus:shadow-primary/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                  className="group relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isLoading ? (
                    <div className="relative z-10 w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Sign In</span>
                      <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-card/50 text-foreground text-sm font-medium hover:bg-card hover:border-primary/30 transition-all duration-200 active:scale-95">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-card/50 text-foreground text-sm font-medium hover:bg-card hover:border-primary/30 transition-all duration-200 active:scale-95">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06a4.28 4.28 0 0 1-.04-.56c0-1.12.535-2.3 1.205-3.04C13.578 1.67 14.904 1 16.12 1c.05.14.08.28.1.43h.145zm4.05 17.16c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.862 0 2.212-1.01 3.9-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/></svg>
                </button>
              </div>
            </div>

            {/* Sign up link */}
            <p className="text-center mt-8 text-sm text-muted-foreground">
              New to SmartCar Care?{" "}
              <button onClick={() => onNavigate("signup")} className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Create account →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
