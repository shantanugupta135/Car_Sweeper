"use client"

import Image from "next/image"
import { Droplets, ArrowRight, Star } from "lucide-react"

export function HeroSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.05),transparent_60%)]" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-700" />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-primary/20 animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 w-fit">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">India&apos;s #1 Doorstep Car Care</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground text-balance">
              Your Car Deserves a{" "}
              <span className="text-primary relative">
                Daily Shine
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
              </span>
              <br />
              At Your Doorstep
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg text-pretty">
              Premium waterless car cleaning delivered to your parking spot every morning.
              No water waste. No hassle. Just a spotless car, every single day.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate("signup")}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card/50 text-foreground font-semibold text-lg transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                Sign In
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Trusted by <span className="text-foreground font-semibold">12,000+</span> car owners</p>
              </div>
            </div>
          </div>

          {/* Right - Hero car image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.12),transparent_70%)]" />
            <div className="relative w-full max-w-lg">
              <Image
                src="/images/hero-car.jpg"
                alt="Premium car with SmartCar Care service"
                width={600}
                height={400}
                className="rounded-2xl object-cover"
                priority
              />
              {/* Floating stat cards */}
              <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-card/80 border border-border backdrop-blur-sm">
                <p className="text-xs text-muted-foreground">Daily Cleans</p>
                <p className="text-xl font-bold text-primary">8,500+</p>
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-3 rounded-xl bg-card/80 border border-border backdrop-blur-sm">
                <p className="text-xs text-muted-foreground">Water Saved</p>
                <p className="text-xl font-bold text-primary">2.5M L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
