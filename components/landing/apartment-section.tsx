"use client"

import { Clock, Droplet, CheckSquare, MapPin, Zap, AlertCircle } from "lucide-react"
import Image from "next/image"
import { CarouselSlider } from "@/components/carousel-slider"

export function ApartmentSection() {
  const carouselSlides = [
    {
      image: "/images/nimbus_lowrise.png",
      title: "Your Society, Your Partner",
      subtitle: "Professional car care tailored for apartment living",
    },
    {
      image: "/images/cleaning-cinematic-2.jpg",
      title: "Premium Microfiber Care",
      subtitle: "Dedicated towels for every car - never reused",
    },
    {
      image: "/images/purvanchal_city.jpg",
      title: "Pristine Finish",
      subtitle: "Professional tire and trim care included",
    },
    {
      image: "/images/cleaning-cinematic-4.jpg",
      title: "Organized Professional Workflow",
      subtitle: "Zero mess, zero complaints from neighbors",
    },
    {
      image: "/images/cleaning-cinematic-5.jpg",
      title: "Water Droplet Perfection",
      subtitle: "90% less water, maximum shine",
    },
    {
      image: "/images/epv-ii.jpg",
      title: "Trusted by Apartment Communities",
      subtitle: "Professional pride in every service",
    },
  ]

  const keyFeatures = [
    {
      icon: MapPin,
      title: "Fixed Area Cleaning Partners",
      description: "Same verified professional assigned to your society every month. They know your parking layout, water access points, and building guidelines.",
      color: "from-blue-500",
    },
    {
      icon: Clock,
      title: "Morning Scheduling System",
      description: "Fixed early morning slots (7 AM - 9 AM) before residents leave for work. No disruption, no traffic congestion in parking.",
      color: "from-orange-500",
    },
    {
      icon: Droplet,
      title: "Low Water Usage",
      description: "90% less water than traditional methods. Microfiber towel technology protects water resources and your society's water bill.",
      color: "from-cyan-500",
    },
    {
      icon: Zap,
      title: "Society-Friendly Operations",
      description: "Organized professional workflow respects society rules. No noise complaints, organized parking management, waste handling.",
      color: "from-green-500",
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Built for<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Apartment Communities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            Designed from the ground up for India's apartment culture. From Noida to Bangalore, we understand your society's unique needs.
          </p>
        </div>

        {/* Main Visual Section - Carousel Slider */}
        <div className="relative mb-16 border border-border/50 bg-gradient-to-br from-card to-card/50">
          <CarouselSlider slides={carouselSlides} autoPlay={true} autoPlayInterval={4000} />
        </div>

        {/* Key Features - 4 Column Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {keyFeatures.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} to-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Detailed Feature Sections with Images */}
        <div className="mb-16 space-y-12">
          {/* Fixed Area Partners */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Feature 1</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Fixed Area Cleaning Partners</h3>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                We don't send random cleaners to your society. Every month, your dedicated partner returns. They know your building, your parking layout, water access points, and all security guidelines.
              </p>
              <ul className="space-y-3">
                {[
                  "Same professional every visit builds trust",
                  "Knows your society's specific requirements",
                  "Background verified and insured",
                  "24/7 dedicated support line",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50 group">
              <img
                src="/images/purvanchal_city.jpg"
                alt="Fixed area cleaning partner in Noida"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Morning Scheduling */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50 group order-2 md:order-1">
              <img
                src="/images/nimbus_lowrise.png"
                alt="Early morning scheduling system"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Feature 2</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Morning Scheduling System</h3>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                5 AM to 9 AM fixed slots mean your car is spotless before you leave for work. No overlapping with peak parking hours. No complaints from neighbors about water on the road.
              </p>
              <ul className="space-y-3">
                {[
                  "Fixed 7-9 AM time slots",
                  "No disruption to daily traffic",
                  "Water dries before morning rush",
                  "Society-wide coordination system",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Water Efficiency */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Droplet className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Feature 3</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Low Water Usage</h3>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                Traditional washing wastes 100+ liters per car. We use only 10-15 liters with our microfiber technology. That's 90% less water. Perfect for water-conscious societies managing shared resources.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-3xl font-bold text-primary">10-15L</p>
                  <p className="text-sm text-muted-foreground">Water per car</p>
                </div>
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-3xl font-bold text-destructive">100+L</p>
                  <p className="text-sm text-muted-foreground">Traditional method</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Microfiber towel technology",
                  "Eco-friendly cleaning solutions",
                  "Reduces society water bill",
                  "Environmentally responsible",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50 group">
              <img
                src="/images/water-efficient.jpg"
                alt="Water efficient cleaning process"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Organized Workflow */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50 group order-2 md:order-1">
              <img
                src="/images/epv-ii.jpg"
                alt="Organized professional workflow"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Feature 4</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Organized Professional Workflow</h3>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                No stray equipment, no spillage, no complaints. Our professionals follow a strict protocol respecting your society's regulations. Clean before, spotless after.
              </p>
              <ul className="space-y-3">
                {[
                  "Organized equipment handling",
                  "Zero spillage guarantee",
                  "Respects society parking rules",
                  "Professional dress code and conduct",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Society Benefits CTA */}
        {/* <div className="relative p-8 md:p-12 rounded-3xl border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Perfect for Your Society</h3>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Whether it's Noida, Bangalore, Mumbai, or Delhi - our apartment-first approach is designed for modern Indian communities. Low water usage, organized professionals, community discounts.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-green-500" />
                  <span className="text-foreground font-semibold">Building-wide discounts available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-green-500" />
                  <span className="text-foreground font-semibold">Dedicated society support manager</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-green-500" />
                  <span className="text-foreground font-semibold">Community WhatsApp group for coordination</span>
                </div>
              </div>
              <button
                onClick={() => window.open("https://wa.me/919953745105", "_blank")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all hover:scale-105"
              >
                Get CarsGlow for Your Society
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="text-4xl font-bold text-primary mb-2">90%</p>
                <p className="text-sm text-foreground">Less Water</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="text-4xl font-bold text-primary mb-2">₹500+</p>
                <p className="text-sm text-foreground">Savings per month</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="text-4xl font-bold text-primary mb-2">1</p>
                <p className="text-sm text-foreground">Dedicated Partner</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="text-4xl font-bold text-primary mb-2">0</p>
                <p className="text-sm text-foreground">Complaints</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
