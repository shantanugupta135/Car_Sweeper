"use client"

import { Droplet, Shield, Wind, Sparkles, Zap } from "lucide-react"
import { CarouselSlider } from "@/components/carousel-slider"

export function PremiumCareSection() {
  const kitCarouselSlides = [
    {
      image: "/images/kit-towel.jpg",
      title: "Premium Microfiber Towels",
      subtitle: "Dedicated set - never shared with other vehicles",
    },
    {
      image: "/images/kit-cleaning-solutions.jpg",
      title: "Professional Cleaning Solutions",
      subtitle: "Automotive-grade products for paint protection",
    },
    {
      image: "/images/kit-washing-mitt.jpg",
      title: "Scratch-Safe Washing Mitt",
      subtitle: "Certified safe for all car surfaces",
    },
    {
      image: "/images/kit-tire-polish.jpg",
      title: "Premium Tire & Trim Care",
      subtitle: "Showroom-ready finish in minutes",
    },
    {
      image: "/images/kit-sealant.jpg",
      title: "Paint Protective Sealant",
      subtitle: "Long-lasting protection against elements",
    },
    {
      image: "/images/kit-complete-set.jpg",
      title: "Complete Premium Care Kit",
      subtitle: "Everything included in every booking",
    },
  ]

  const features = [
    {
      icon: Wind,
      title: "Dedicated Microfiber Towels",
      description: "100% dedicated microfiber towels for every car. Never shared with other vehicles.",
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Droplet,
      title: "Premium Cleaning Solutions",
      description: "Professional-grade cleaning sprays and products designed for automotive paint.",
      color: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: Shield,
      title: "Scratch-Safe Process",
      description: "Certified techniques using scratch-safe tools to protect your car's premium finish.",
      color: "from-emerald-500/20 to-cyan-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: Sparkles,
      title: "Paint-Safe Products",
      description: "All products are engineered to enhance and protect your vehicle's paint.",
      color: "from-purple-500/20 to-cyan-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      title: "Tire Polish & Trim Care",
      description: "Premium tire polish and trim protection to make your car look showroom-ready.",
      color: "from-yellow-500/20 to-orange-500/10",
      borderColor: "border-yellow-500/20",
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Not Just Cleaning.<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Professional Care.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 text-balance">
            Your car deserves more than standard cleaning. It deserves premium automotive care with professional-grade products and dedicated attention to detail.
          </p>
          <div className="inline-block bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <p className="text-primary font-semibold">
              "Your car doesn't deserve the same cloth used on ten other vehicles."
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.color} backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-300" />

                {/* Icon */}
                <div className="relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="relative z-10 font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA - Kit Carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Premium Care Kit Includes:</h3>
              <ul className="space-y-3">
                {[
                  "Dedicated microfiber towel set (never reused)",
                  "Premium automotive cleaning solutions",
                  "Scratch-safe washing mitt",
                  "Tire shine & trim protection",
                  "Professional water spotting removal",
                  "Paint protective sealant",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative border border-border/50 bg-gradient-to-br from-card to-card/50 rounded-3xl overflow-hidden">
              <CarouselSlider slides={kitCarouselSlides} autoPlay={true} autoPlayInterval={3500} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
