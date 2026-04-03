"use client"

import { UserPlus, Car, Calendar, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up & Add Your Car",
    description: "Create your account in 30 seconds. Add your vehicle details and parking location.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Choose Your Plan",
    description: "Pick a subscription that fits — daily, alternate days, or weekend plans. Starting at just 499/mo.",
  },
  {
    icon: Car,
    step: "03",
    title: "We Come to You",
    description: "Our trained crew arrives at your doorstep every morning. No water, no noise, just a pristine clean.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Track & Rate",
    description: "Get real-time progress, before/after photos, and rate every service from your dashboard.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,212,255,0.04),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            4 Simple Steps to a Spotless Car
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started takes less than a minute.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {steps.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center">
              {/* Step number ring */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
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
