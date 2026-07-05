"use client"

import { Check } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/9953745105?text=Hi%20CarsGlo%20team!%20I%20am%20interested%20in%20your%20car%20service%20🚗%20⚡%20I’ll%20fill%20details%20here:%20https://forms.gle/p9wKFGminZz2mmr4A"

const plans = [
  {
    name: "Basic",
    description: "Essential daily car care for everyday owners",
    carTypes: [
      { type: "Hatchback", price: "599" },
      { type: "Sedan / Compact-SUV", price: "699" },
      { type: "SUVs", price: "899" },
    ],
    period: "/30 days",
    features: [
      "Daily exterior waterless wash",
      "Dashboard wipe-down",
      "In-app tracking",
      "Service reports",
      "Before/after photos",
    ],
    popular: false,
  },
  {
    name: "Pro",
    description: "Complete care for those who want more",
    carTypes: [
      { type: "Hatchback", price: "899" },
      { type: "Sedan / Compact-SUV", price: "999" },
      { type: "SUVs", price: "1,199" },
    ],
    period: "/30 days",
    features: [
      "Everything in Basic",
      "Full interior cleaning",
      "Tire shine & glass polish",
      "Priority scheduling",
      "Dedicated crew member",
      "24/7 priority support",
    ],
    popular: true,
  },
]

export function PricingSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  const handleGetStarted = () => {
    window.open(WHATSAPP_URL, "_blank")
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Plans That Fit Every Car Owner
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "border-primary/40 bg-primary/[0.04] shadow-[0_0_40px_rgba(0,212,255,0.08)] scale-[1.02]"
                  : "border-border bg-card/30 hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.description}</p>

              {/* Car type pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {plan.carTypes.map((car, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{car.type}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">&#8377;</span>
                      <span className="text-xl font-bold text-foreground">{car.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGetStarted}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    : "bg-card border border-border text-foreground hover:border-primary/30"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
