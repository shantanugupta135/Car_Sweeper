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
import { PricingSection } from "./pricing-section"
import { FooterSection } from "./footer-section"

export function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onNavigate={onNavigate} />

      <HeroSection onNavigate={onNavigate} />

      {/* Problem */}
      <ProblemSection />

      {/* How it works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Features */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* About Us */}
      {/* <div id="about">
        <AboutSection />
      </div> */}

      {/* Real Results & Authenticity */}
      <AuthenticitySection />

      {/* Professional Team */}
      {/* <ProfessionalTeamSection /> */}

      {/* Trust vs Local Cleaners */}
      <TrustComparisonSection />

      {/* Pricing */}
      <div id="pricing">
        <PricingSection onNavigate={onNavigate} />
      </div>

      {/* Footer */}
      <FooterSection onNavigate={onNavigate} />
    </div>
  )
}
