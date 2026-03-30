"use client"

import { ArrowRight, Zap } from "lucide-react"

export function CTASection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.1),transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="p-12 sm:p-16 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-transparent">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            First Month Free for{" "}
            <span className="text-primary">Early Adopters</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 text-pretty">
            Join 12,000+ car owners who already wake up to a spotless car.
            Sign up today and your first month is completely on us.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("signup")}
              className="group flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Claim Free Trial
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-muted-foreground">No credit card required</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">25+</p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">12K+</p>
              <p className="text-sm text-muted-foreground">Happy Owners</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">App Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
