"use client"

import { CheckCircle2, Users, Briefcase, MapPin, Award } from "lucide-react"

export function PartnerSection() {
  const partners = [
    {
      name: "Rajesh Kumar",
      region: "South Delhi",
      rating: 4.9,
      jobs: 342,
      image: "🧑‍🔧",
      verified: true,
      specialization: "Luxury Cars",
    },
    {
      name: "Priya Sharma",
      region: "Bangalore Central",
      rating: 4.85,
      jobs: 298,
      image: "👩‍🔧",
      verified: true,
      specialization: "SUVs",
    },
    {
      name: "Amit Patel",
      region: "Mumbai Suburbs",
      rating: 4.92,
      jobs: 415,
      image: "🧑‍🔧",
      verified: true,
      specialization: "Sedans",
    },
  ]

  const features = [
    { icon: Award, label: "Trained & Certified" },
    { icon: Briefcase, label: "Professional Process" },
    { icon: MapPin, label: "Area-Based Assignment" },
    { icon: Users, label: "Verified Professionals" },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Meet Your CarsGlow<br />
            <span className="text-primary">Partner</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Handpicked, trained, and verified professionals dedicated to keeping your car spotless. We take trust seriously.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{feature.label}</span>
              </div>
            )
          })}
        </div>

        {/* Partner Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Verified badge */}
              {partner.verified && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Verified</span>
                </div>
              )}

              {/* Avatar */}
              <div className="text-6xl mb-4">{partner.image}</div>

              {/* Info */}
              <h3 className="text-xl font-bold text-foreground mb-1">{partner.name}</h3>
              <p className="text-sm text-primary font-semibold mb-3">{partner.specialization}</p>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{partner.region}</span>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pb-4 border-b border-border/50">
                <div>
                  <p className="text-2xl font-bold text-primary">{partner.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{partner.jobs}</p>
                  <p className="text-xs text-muted-foreground">Cars Cleaned</p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-4 space-y-2">
                {[
                  "Background verified",
                  "Insurance covered",
                  "24/7 support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-8 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-foreground mb-2">Your dedicated partner awaits</h3>
          <p className="text-muted-foreground mb-6">
            Every booking connects you with a verified, trained professional in your area who cares about your car as much as you do.
          </p>
          <button
            onClick={() => window.open("https://wa.me/919953745105", "_blank")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all"
          >
            Book Your Partner
          </button>
        </div>
      </div>
    </section>
  )
}
