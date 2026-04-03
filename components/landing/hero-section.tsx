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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 w-fit animate-slide-in-left hover:shadow-lg hover:shadow-primary/10 transition-all">
              <Droplets className="w-4 h-4 text-primary animate-bounce-subtle" />
              <span className="text-sm font-medium text-primary">India&apos;s #1 Doorstep Car Care</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground text-balance animate-slide-in-left animation-delay-100">
              Your Car Deserves a{" "}
              <span className="text-primary relative inline-block">
                Daily Shine
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent animate-gradient-flow" />
              </span>
              <br />
              At Your Doorstep
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg text-pretty animate-slide-in-left animation-delay-200">
              Premium waterless car cleaning delivered to your parking spot every morning.
              No water waste. No hassle. Just a spotless car, every single day.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left animation-delay-300">
              <button
                onClick={() => onNavigate("signup")}
                className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card/50 text-foreground font-semibold text-lg transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 active:scale-95"
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

          {/* Right - Animated Car Washing Scene */}
          <div className="relative flex items-center justify-center h-[500px]">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.15),transparent_70%)]" />
            
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Animated car container */}
              <div className="relative w-full h-64 flex items-center justify-center perspective">
                {/* Car with shine effect */}
                <div className="relative animate-car-bounce">
                  <div className="animate-car-drive">
                    {/* Car image */}
                    <Image
                      src="/images/hero-car-washing.jpg"
                      alt="Car being washed"
                      width={400}
                      height={280}
                      className="rounded-2xl object-cover shadow-2xl shadow-primary/30"
                      priority
                    />
                    
                    {/* Shine effect overlay */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-sweep" />
                    </div>
                  </div>
                </div>

                {/* Animated sweeper brush */}
                <div className="absolute right-12 top-20 animate-sweeper-swing origin-bottom">
                  {/* Brush handle */}
                  <div className="w-1 h-20 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mx-auto" />
                  {/* Brush head */}
                  <svg className="w-16 h-12 -mx-6" viewBox="0 0 100 80" fill="none">
                    <ellipse cx="50" cy="20" rx="35" ry="15" fill="rgba(100,180,200,0.8)" />
                    <path d="M 20 20 Q 20 35 50 50 Q 80 35 80 20" fill="rgba(100,180,200,0.6)" />
                    <path d="M 30 25 Q 30 32 50 42 Q 70 32 70 25" fill="rgba(150,210,230,0.7)" stroke="rgba(150,210,230,0.9)" strokeWidth="1" />
                  </svg>
                </div>

                {/* Water droplets */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute animate-water-drip"
                    style={{ 
                      left: `${20 + i * 15}%`, 
                      top: '40px',
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-70 blur-sm" />
                  </div>
                ))}

                {/* Soap bubbles */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={`bubble-${i}`}
                    className="absolute animate-bubble-float"
                    style={{ 
                      left: `${30 + i * 20}%`, 
                      top: '180px',
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    <div className="w-3 h-3 border border-cyan-400/50 rounded-full" />
                  </div>
                ))}

                {/* Spray effect */}
                <div className="absolute left-0 top-1/2 w-20 h-20 pointer-events-none">
                  <svg className="w-full h-full text-cyan-400/40" viewBox="0 0 100 100" fill="none">
                    {[1, 2, 3].map((j) => (
                      <line
                        key={j}
                        x1="50"
                        y1="50"
                        x2={50 + Math.cos((j * 2 * Math.PI) / 3) * 40}
                        y2={50 + Math.sin((j * 2 * Math.PI) / 3) * 40}
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Service indicators below car */}
              <div className="mt-8 flex gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-6 h-6 text-primary animate-bounce-subtle" />
                  </div>
                  <p className="text-sm text-muted-foreground">Zero Water</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Quick Clean</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-primary fill-primary animate-bounce-subtle" />
                  </div>
                  <p className="text-sm text-muted-foreground">Shiny Finish</p>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-card/80 border border-border backdrop-blur-sm animate-slide-in-left animation-delay-400">
              <p className="text-xs text-muted-foreground">Daily Cleans</p>
              <p className="text-xl font-bold text-primary">8,500+</p>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-3 rounded-xl bg-card/80 border border-border backdrop-blur-sm animate-slide-in-right animation-delay-400">
              <p className="text-xs text-muted-foreground">Water Saved</p>
              <p className="text-xl font-bold text-primary">2.5M L</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
