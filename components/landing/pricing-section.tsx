"use client"

import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "499",
    period: "/month",
    description: "Perfect for weekend car owners",
    features: [
      "4 cleans per month (weekends)",
      "Exterior waterless wash",
      "Dashboard wipe-down",
      "In-app tracking",
      "Service reports",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "999",
    period: "/month",
    description: "Most popular for daily commuters",
    features: [
      "15 cleans per month (alternate days)",
      "Full exterior + interior clean",
      "Tire shine & glass polish",
      "Before/after photos",
      "Priority scheduling",
      "Dedicated crew member",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "1,499",
    period: "/month",
    description: "For those who accept nothing less",
    features: [
      "30 cleans per month (daily)",
      "Full detailing every session",
      "Ceramic coating maintenance",
      "AC vent & seat deep clean",
      "24/7 priority support",
      "Multi-car discount (20%)",
      "Quarterly full detailing free",
    ],
    popular: false,
  },
]

export function PricingSection({ onNavigate }: { onNavigate: (page: string) => void }) {
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

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

              <div className="flex items-baseline gap-1 mt-6 mb-6">
                <span className="text-sm text-muted-foreground">&#8377;</span>
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
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
                onClick={() => onNavigate("signup")}
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
