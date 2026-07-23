"use client"

import { LandingHeader } from "./landing-header"
import { HeroSection } from "./hero-section"
import { ProblemSection } from "./problem-section"
import { HowItWorksSection } from "./how-it-works-section"
import { FeaturesSection } from "./features-section"
import { AboutSection } from "./about-section"
import { AuthenticitySection } from "./authenticity-section"
import { ProfessionalTeamSection } from "./professional-team-section"
import { TrustComparisonSection } from "./trust-comparison-section"
import { PremiumCareSection } from "./premium-care-section"
import { PartnerSection } from "./partner-section"
import { WhyCarsglowSection } from "./why-carsglow-section"
import { ApartmentSection } from "./apartment-section"
import { PricingSection } from "./pricing-section"
import { CTASection } from "./cta-section"
import { FooterSection } from "./footer-section"
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button"

export function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <FloatingWhatsAppButton />
      <LandingHeader onNavigate={onNavigate} />

      <HeroSection onNavigate={onNavigate} />

      {/* Problem */}
      <ProblemSection />

      {/* Why CarsGlow */}
      <div id="about">
         <WhyCarsglowSection />
      </div>
     

      {/* How it works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Features */}
      {/* <div id="features">
        <FeaturesSection />
      </div> */}

      {/* About Us */}
      {/* <div id="about">
        <AboutSection />
      </div> */}

      {/* Real Results & Authenticity */}
      <AuthenticitySection />

      {/* Professional Team */}
      {/* <ProfessionalTeamSection /> */}

      {/* Trust vs Local Cleaners */}
      {/* <TrustComparisonSection /> */}

      {/* Premium Care Section */}
      <div id="features">
        <PremiumCareSection />
      </div>   

      {/* Meet Your Partner */}
      {/* <PartnerSection /> */}

      {/* Apartment Communities */}
      <ApartmentSection />

      {/* Pricing */}
      <div id="pricing">
        <PricingSection onNavigate={onNavigate} />
      </div>

      {/* CTA Section */}
      <CTASection onNavigate={onNavigate} />

      {/* Footer */}
      <FooterSection onNavigate={onNavigate} />
    </div>
  )
}
