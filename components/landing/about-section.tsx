"use client"

import { Eye, Shield, Clock, Smartphone, CheckCircle, Users, MapPin, Award } from "lucide-react"

const trustFeatures = [
  {
    icon: Eye,
    title: "Live Tracking",
    description: "Watch your car being cleaned in real-time. Our sweepers check-in with geo-tagged photos before and after every wash."
  },
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "Every CarsGlow sweeper undergoes rigorous background verification, professional training, and carries ID badges."
  },
  {
    icon: Clock,
    title: "Punctual Service",
    description: "Set your preferred time slot. Our sweepers arrive on schedule, every single day. No more waiting or uncertainty."
  },
  {
    icon: Smartphone,
    title: "Complete Transparency",
    description: "Get instant notifications, before/after photos, and detailed service reports directly on your phone."
  }
]

const stats = [
  { value: "12,000+", label: "Happy Car Owners" },
  { value: "50,000+", label: "Cars Cleaned Monthly" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "98%", label: "Satisfaction Rate" }
]

const whyChooseUs = [
  "Trained and uniformed professionals - not random local washers",
  "Photo proof of every cleaning with timestamp and location",
  "Premium eco-friendly products that protect your car's paint",
  "Dedicated customer support available 7 days a week",
  "Money-back guarantee if you're not satisfied",
  "No contracts - cancel anytime with zero hassle"
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            About CarsGlow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-6">
            Why Trust Us Over{" "}
            <span className="text-primary">Local Car Washers?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We understand your concerns. That random person cleaning your expensive car with no accountability? 
            Those days are over. CarsGlow brings <span className="text-foreground font-semibold">professional, trackable, and transparent</span> car 
            care right to your doorstep.
          </p>
        </div>

        {/* Trust features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main about content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card/30 p-8">
              {/* Phone mockup showing tracking */}
              <div className="relative mx-auto w-64 h-[480px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  {/* App screen content */}
                  <div className="p-4 space-y-4">
                    <div className="text-center pt-6">
                      <p className="text-xs text-muted-foreground">LIVE TRACKING</p>
                      <p className="text-lg font-bold text-foreground">Your Car is Being Cleaned</p>
                    </div>
                    
                    {/* Map placeholder */}
                    <div className="relative h-32 rounded-xl bg-primary/10 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-primary animate-bounce" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-card/90 rounded-lg p-2 text-xs">
                        <p className="font-medium text-foreground">Sweeper: Rajesh K.</p>
                        <p className="text-muted-foreground">Arriving in 2 mins</p>
                      </div>
                    </div>

                    {/* Status updates */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Before Photo Uploaded</p>
                          <p className="text-xs text-muted-foreground">9:02 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <Clock className="w-5 h-5 text-primary animate-pulse" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Cleaning in Progress...</p>
                          <p className="text-xs text-muted-foreground">Started 9:05 AM</p>
                        </div>
                      </div>
                    </div>

                    {/* Sweeper info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Rajesh Kumar</p>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" />
                          <p className="text-xs text-muted-foreground">Verified Pro | 4.9 Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                100% Trackable
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                Real-time Updates
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Monitor Everything From Your Couch
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Gone are the days of blindly trusting someone with your prized possession. With CarsGlow, 
                you get complete visibility into every cleaning session. Our app shows you exactly when 
                your sweeper arrives, captures before and after photos, and sends you instant notifications 
                at every step.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re at home, in office, or traveling - you&apos;ll always know your car is in safe, 
                professional hands. That&apos;s the CarsGlow promise.
              </p>
            </div>

            {/* Why choose us list */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Why Car Owners Choose CarsGlow:</h4>
              {whyChooseUs.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-card/50 border border-border"
            >
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust message */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
          <p className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            &ldquo;Your car is not just a vehicle. It&apos;s a part of your family.&rdquo;
          </p>
          <p className="text-muted-foreground">
            And we treat it that way. Every single day.
          </p>
        </div>
      </div>
    </section>
  )
}
