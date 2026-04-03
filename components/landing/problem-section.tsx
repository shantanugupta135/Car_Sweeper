"use client"

import { Clock, Droplet, Ban, AlertTriangle } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Wasted Mornings",
    description: "Spending 30+ minutes every weekend at a car wash, waiting in line under the sun.",
  },
  {
    icon: Droplet,
    title: "Water Wastage",
    description: "Traditional washes use 150+ liters of water per session. That's 7,800 liters a year per car.",
  },
  {
    icon: Ban,
    title: "Inconsistent Quality",
    description: "Random roadside cleaners with no accountability. Scratches, missed spots, and no-shows.",
  },
  {
    icon: AlertTriangle,
    title: "Paint Damage",
    description: "Harsh chemicals and dirty rags silently destroying your car's finish every single wash.",
  },
]

export function ProblemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,71,87,0.04),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 mb-4">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Car Care is Broken
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Every car owner faces these frustrations daily. It&apos;s time for a smarter solution.
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
