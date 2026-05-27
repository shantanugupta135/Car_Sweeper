"use client"

import { CheckCircle2, X } from "lucide-react"

export function WhyCarsglowSection() {
  const comparison = [
    {
      feature: "Dedicated Microfiber Towels",
      carsglow: true,
      others: false,
    },
    {
      feature: "Premium Cleaning Kits",
      carsglow: true,
      others: false,
    },
    {
      feature: "Scratch-Safe Cleaning",
      carsglow: true,
      others: false,
    },
    {
      feature: "Daily Progress Tracking",
      carsglow: true,
      others: false,
    },
    {
      feature: "Before & After Photos",
      carsglow: true,
      others: false,
    },
    {
      feature: "Verified Professionals",
      carsglow: true,
      others: true,
    },
    {
      feature: "24/7 Customer Support",
      carsglow: true,
      others: true,
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CarsGlow?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not just another car cleaning service. Here's what sets us apart.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-6 font-semibold text-foreground">Feature</th>
                <th className="text-center p-6 font-semibold text-primary">CarsGlow</th>
                <th className="text-center p-6 font-semibold text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="p-6 text-foreground font-medium">{item.feature}</td>
                  <td className="text-center p-6">
                    {item.carsglow ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-muted-foreground mx-auto opacity-30" />
                    )}
                  </td>
                  <td className="text-center p-6">
                    {item.others ? (
                      <CheckCircle2 className="w-6 h-6 text-muted-foreground mx-auto opacity-50" />
                    ) : (
                      <X className="w-6 h-6 text-muted-foreground mx-auto opacity-30" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Differentiators */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Photo Proof</h3>
            <p className="text-sm text-muted-foreground">
              Real before & after photos with every cleaning. Complete transparency.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Peace of Mind</h3>
            <p className="text-sm text-muted-foreground">
              Full insurance coverage & background-verified professionals for safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-foreground mb-2">Consistent Quality</h3>
            <p className="text-sm text-muted-foreground">
              Same premium standards, same dedicated professional, every single time.
            </p>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-12 p-8 rounded-2xl border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            100% Satisfaction Guarantee
          </h3>
          <p className="text-muted-foreground mb-4">
            Not happy with your cleaning? We'll make it right. That's the CarsGlow promise.
          </p>
          <div className="inline-flex gap-2 text-sm font-semibold text-primary">
            <CheckCircle2 className="w-5 h-5" />
            <span>Money-back guarantee on first booking</span>
          </div>
        </div>
      </div>
    </section>
  )
}
