"use client"

import { Sparkles, Shield, Leaf, Smartphone } from "lucide-react"

const solutions = [
  {
    icon: Sparkles,
    title: "Waterless Nano-Tech Cleaning",
    description: "Advanced polymer-based formula that lifts dirt without a single drop of water. Better for your car, better for the planet.",
    stat: "0 Liters",
    statLabel: "Water Used",
  },
  {
    icon: Shield,
    title: "Trained & Verified Crew",
    description: "Background-checked professionals with 200+ hours of training. Consistent quality, every single time.",
    stat: "200+",
    statLabel: "Training Hours",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Products",
    description: "100% biodegradable cleaning agents. No harsh chemicals touching your car or the environment.",
    stat: "100%",
    statLabel: "Biodegradable",
  },
  {
    icon: Smartphone,
    title: "Smart Dashboard Control",
    description: "Track your cleaner in real-time, view before/after photos, rate each service, and manage everything from one app.",
    stat: "Real-time",
    statLabel: "Live Tracking",
  },
]

export function SolutionSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.06),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            SmartCar Care — Reinvented
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Premium doorstep car care powered by technology, driven by sustainability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{item.stat}</span>
                    <span className="text-sm text-muted-foreground">{item.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
