"use client"

import {
  BarChart3,
  Bell,
  Camera,
  Clock,
  Globe,
  Headphones,
  MapPin,
  Zap,
} from "lucide-react"

const features = [
  { icon: MapPin, title: "Live Crew Tracking", description: "See exactly where your cleaner is in real-time on an interactive map." },
  { icon: Camera, title: "Before/After Photos", description: "Visual proof of every cleaning session delivered to your dashboard." },
  { icon: Bell, title: "Smart Notifications", description: "Get notified when your cleaner arrives, starts, and finishes the job." },
  { icon: BarChart3, title: "Service Analytics", description: "Track cleaning history, view reports, and monitor your car's care trends." },
  { icon: Clock, title: "Flexible Scheduling", description: "Pause, skip, or reschedule with one tap. No penalties, no contracts." },
  { icon: Zap, title: "Instant Support", description: "One-tap complaint resolution with guaranteed 30-minute response time." },
  { icon: Globe, title: "Multi-City Coverage", description: "Available across 25+ cities. Same quality, same experience everywhere." },
  { icon: Headphones, title: "24/7 Help Center", description: "Dedicated support team available around the clock for any concern." },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Built for Modern Car Owners
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed to give you complete control and peace of mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl border border-border bg-card/30 transition-all duration-300 hover:border-primary/25 hover:bg-card/60"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
