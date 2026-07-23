"use client"

import { useState } from "react"
import { ArrowLeft, Check, Zap } from "lucide-react"
import { GlassCard } from "@/components/smartcar/glass-card"
import { AnimatedButton } from "@/components/smartcar/animated-button"
import { useNavigation } from "@/lib/navigation-context"
import { subscriptionPlans, subscriptionPlan } from "@/lib/mock-data"

export function SubscriptionScreen() {
  const { goBack } = useNavigation()
  const [selectedPlan, setSelectedPlan] = useState("premium")

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6 relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-gradient-flow" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 animate-slide-in-top">
        <button
          onClick={goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all active:scale-95 hover:border hover:border-primary/30"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Subscription Plans</h1>
      </div>

      {/* Current Plan Indicator */}
      <GlassCard className="relative z-10 flex items-center gap-3 animate-slide-in-bottom animation-delay-100 hover:shadow-lg hover:shadow-primary/20" glow>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
          <Zap className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{subscriptionPlan.name}</p>
          <p className="text-xs text-muted-foreground">Active - {subscriptionPlan.daysRemaining} days remaining</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary uppercase">
          Active
        </span>
      </GlassCard>

      {/* Plan Cards */}
      <div className="relative z-10 flex flex-col gap-4">
        {subscriptionPlans.map((plan, i) => (
          <GlassCard
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative overflow-hidden transition-all animate-slide-in-bottom cursor-pointer hover:shadow-lg hover:shadow-primary/10 ${
              selectedPlan === plan.id ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
            }`}
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase">
                Popular
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {"₹"}{plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-surface-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Subscribe Button */}
      <AnimatedButton variant="primary" size="lg" className="w-full">
        {selectedPlan === "premium" ? "Current Plan" : "Switch Plan"}
      </AnimatedButton>
    </div>
  )
}
