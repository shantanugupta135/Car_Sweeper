"use client"

import Image from "next/image"
import { Award, BadgeCheck, Heart, Zap, MapPin, Users } from "lucide-react"

export function ProfessionalTeamSection() {
  const professionals = [
    {
      name: "Rajesh Kumar",
      role: "Senior Cleaning Professional",
      specialty: "Noida Sector 50-52",
      image: "/images/cleaning-professional.jpg",
      certifications: ["5 Years Experience", "Premium Training"],
      rating: 4.9,
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Meet Your Cleaning Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verified professionals, trained for excellence. Every member is background-checked and committed to premium service standards.
          </p>
        </div>

        {/* Professional Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="group relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card */}
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
              <div className="grid sm:grid-cols-2 gap-6 p-8">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden h-64 sm:h-full min-h-80">
                  <Image
                    src="/images/cleaning-professional.jpg"
                    alt="Cleaning professional"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-white/95 rounded-full">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-foreground">Verified</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{professionals[0].name}</h3>
                        <p className="text-primary font-medium">{professionals[0].role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{professionals[0].rating}★</div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {professionals[0].specialty}
                    </p>

                    {/* Certifications */}
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Qualifications</p>
                      <div className="flex flex-wrap gap-2">
                        {professionals[0].certifications.map((cert) => (
                          <div
                            key={cert}
                            className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary"
                          >
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">200+</p>
                        <p className="text-xs text-muted-foreground">Cars Cleaned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">100%</p>
                        <p className="text-xs text-muted-foreground">Satisfied</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <Award className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Verified Staff</h4>
              <p className="text-sm text-muted-foreground">Background checked and verified professionals</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Premium Training</h4>
              <p className="text-sm text-muted-foreground">Certified in modern car care techniques</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <Heart className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Care & Reliability</h4>
              <p className="text-sm text-muted-foreground">Dedicated professionals who care about your car</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <BadgeCheck className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Accountability</h4>
              <p className="text-sm text-muted-foreground">Every service tracked and verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
