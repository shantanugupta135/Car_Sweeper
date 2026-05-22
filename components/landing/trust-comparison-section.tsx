"use client"

import { CheckCircle2, Clock, Shield, Smartphone, Users, Zap } from "lucide-react"

export function TrustComparisonSection() {
  const comparisons = [
    {
      category: "Verification",
      local: "No background check",
      carsglow: "Full background verification",
      icon: Shield,
    },
    {
      category: "Consistency",
      local: "Quality varies daily",
      carsglow: "Same professional every day",
      icon: Zap,
    },
    {
      category: "Tracking",
      local: "No real-time updates",
      carsglow: "Live tracking on your phone",
      icon: Smartphone,
    },
    {
      category: "Reliability",
      local: "No backup if unavailable",
      carsglow: "Dedicated backup professional",
      icon: Clock,
    },
    {
      category: "Quality Proof",
      local: "No documentation",
      carsglow: "Before/after photos daily",
      icon: CheckCircle2,
    },
    {
      category: "Support",
      local: "Direct contact issues",
      carsglow: "24/7 app-based support",
      icon: Users,
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Why Trust CarsGlow Over Local Cleaners?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop worrying about reliability. Get professional care backed by technology and accountability.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {comparisons.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.category}
                className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Glow background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Category with icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.category}</h3>
                  </div>

                  {/* Comparison rows */}
                  <div className="space-y-3">
                    {/* Local */}
                    <div className="bg-background/50 border border-border/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                        Local Cleaners
                      </p>
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✕</span>
                        <span>{item.local}</span>
                      </p>
                    </div>

                    {/* CarsGlow */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">
                        CarsGlow
                      </p>
                      <p className="text-sm text-foreground font-medium flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item.carsglow}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Join Thousands of Happy Car Owners
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Switch from unreliable local cleaners to professional, tracked, and verified car care.
          </p>
          <button
            onClick={() => window.open("https://wa.me/919953745105", "_blank")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/40 active:scale-95 transition-all duration-200"
          >
            Chat on WhatsApp
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
