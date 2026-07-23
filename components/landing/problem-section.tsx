"use client"

import { Clock, Droplet, Ban, AlertTriangle, TrendingDown } from "lucide-react"

const problems = [
  {
    icon: AlertTriangle,
    title: "Unreliable Cleaners",
    description: "Local cleaners disappear without notice. No background check. No accountability. Your car is at risk.",
  },
  {
    icon: Clock,
    title: "No Real-Time Tracking",
    description: "You don't know if your car is being cleaned properly. No before/after proof. Just trust and hope.",
  },
  {
    icon: Droplet,
    title: "Inconsistent Quality",
    description: "Every cleaner uses different techniques. Scratches, swirls, and missed spots are common problems.",
  },
  {
    icon: TrendingDown,
    title: "Hidden Costs & Haggling",
    description: "Prices change monthly. No transparency. Constant negotiation drains your time and money.",
  },
]

export function ProblemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,71,87,0.04),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 mb-4">
            The Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Tired of Unreliable Car Cleaners?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Local car washers offer zero transparency, no accountability, and constant reliability issues. It's time for professional, verified, tracked car care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl border border-destructive/10 bg-destructive/[0.03] transition-all duration-300 hover:border-destructive/25 hover:bg-destructive/[0.06]"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
